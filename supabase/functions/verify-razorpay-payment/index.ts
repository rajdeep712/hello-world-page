import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.177.0/node/crypto.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// UUID validation regex
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Razorpay ID format validation (typically starts with order_, pay_, sig_)
const razorpayIdRegex = /^[a-zA-Z0-9_]+$/;

// Per-order verification attempt limiter
const verificationAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_VERIFICATION_ATTEMPTS = 5;
const VERIFICATION_WINDOW_MS = 30 * 60 * 1000; // 30 minutes

function checkVerificationLimit(orderId: string): { allowed: boolean; attempts: number } {
  const now = Date.now();
  const record = verificationAttempts.get(orderId);

  // Clean old records
  if (record && now - record.lastAttempt > VERIFICATION_WINDOW_MS) {
    verificationAttempts.delete(orderId);
    verificationAttempts.set(orderId, { count: 1, lastAttempt: now });
    return { allowed: true, attempts: 1 };
  }

  if (!record) {
    verificationAttempts.set(orderId, { count: 1, lastAttempt: now });
    return { allowed: true, attempts: 1 };
  }

  if (record.count >= MAX_VERIFICATION_ATTEMPTS) {
    return { allowed: false, attempts: record.count };
  }

  record.count++;
  record.lastAttempt = now;
  return { allowed: true, attempts: record.count };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(JSON.stringify({ error: 'Unauthorized', verified: false }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Authenticate user with anon key
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
    if (authError || !user) {
      console.error('Authentication failed:', authError?.message || 'No user found');
      return new Response(JSON.stringify({ error: 'Unauthorized', verified: false }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Authenticated user:', user.id);

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = await req.json();
    
    // Validate order_id UUID format
    if (!order_id || !uuidRegex.test(order_id)) {
      console.error('Invalid order_id format:', order_id);
      return new Response(JSON.stringify({ error: 'Invalid order_id format', verified: false }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check verification attempt limit for this order
    const attemptCheck = checkVerificationLimit(order_id);
    if (!attemptCheck.allowed) {
      console.warn(`Verification attempt limit exceeded for order ${order_id} (${attemptCheck.attempts} attempts)`);
      return new Response(JSON.stringify({ 
        error: 'Too many verification attempts for this order. Please contact support.',
        verified: false 
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Verification attempt ${attemptCheck.attempts}/${MAX_VERIFICATION_ATTEMPTS} for order ${order_id}`);

    // Validate Razorpay IDs format
    if (!razorpay_order_id || !razorpayIdRegex.test(razorpay_order_id)) {
      console.error('Invalid razorpay_order_id format:', razorpay_order_id);
      return new Response(JSON.stringify({ error: 'Invalid razorpay_order_id format', verified: false }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!razorpay_payment_id || !razorpayIdRegex.test(razorpay_payment_id)) {
      console.error('Invalid razorpay_payment_id format:', razorpay_payment_id);
      return new Response(JSON.stringify({ error: 'Invalid razorpay_payment_id format', verified: false }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!razorpay_signature || typeof razorpay_signature !== 'string' || razorpay_signature.length > 256) {
      console.error('Invalid razorpay_signature');
      return new Response(JSON.stringify({ error: 'Invalid razorpay_signature', verified: false }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Verifying payment:', { razorpay_order_id, razorpay_payment_id, order_id });

    // Use service role for order operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify order exists and belongs to the authenticated user
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('id, user_id, payment_status')
      .eq('id', order_id)
      .single();

    if (fetchError || !order) {
      console.error('Order not found:', order_id, fetchError);
      return new Response(JSON.stringify({ error: 'Order not found', verified: false }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate that the authenticated user owns this order
    if (order.user_id !== user.id) {
      console.error('Unauthorized: User', user.id, 'does not own order', order_id);
      return new Response(JSON.stringify({ error: 'Unauthorized', verified: false }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if order is already paid
    if (order.payment_status === 'paid') {
      console.log('Order already paid:', order_id);
      return new Response(JSON.stringify({ error: 'Order already paid', verified: false }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
    if (!keySecret) {
      console.error('Razorpay key secret not configured');
      throw new Error('Razorpay key secret not configured');
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = createHmac("sha256", keySecret)
      .update(body)
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;
    console.log('Signature verification:', isValid);

    if (!isValid) {
      console.error('Invalid payment signature for order:', order_id);
      throw new Error('Invalid payment signature');
    }

    // Update order in database
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        payment_status: 'paid',
        order_status: 'confirmed',
        razorpay_order_id,
        razorpay_payment_id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', order_id);

    if (updateError) {
      console.error('Error updating order:', updateError);
      throw updateError;
    }

    console.log('Order updated successfully:', order_id);

    // Clear verification attempts on success
    verificationAttempts.delete(order_id);

    return new Response(JSON.stringify({ success: true, verified: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('Error verifying payment:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message, verified: false }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
