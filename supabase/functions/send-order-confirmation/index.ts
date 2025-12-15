import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  order_id: string;
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    // Create client with user's auth token
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { order_id }: EmailRequest = await req.json();
    
    // Validate order_id format (UUID)
    if (!order_id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(order_id)) {
      console.error('Invalid order_id format:', order_id);
      return new Response(
        JSON.stringify({ error: 'Invalid order_id format' }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    console.log('Sending order confirmation email for order:', order_id, 'by user:', user.id);

    // Fetch order details with service role
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', order_id)
      .single();

    if (orderError || !order) {
      console.error('Error fetching order:', orderError);
      return new Response(
        JSON.stringify({ error: 'Order not found' }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Verify the order belongs to the authenticated user
    if (order.user_id !== user.id) {
      console.warn(`User ${user.id} attempted to send email for order ${order_id} owned by ${order.user_id}`);
      return new Response(
        JSON.stringify({ error: 'Forbidden' }),
        { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Use email/name from order record (trusted data), not from request
    const customer_email = order.customer_email;
    const customer_name = order.customer_name;

    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', order_id);

    if (itemsError) {
      console.error('Error fetching order items:', itemsError);
      throw itemsError;
    }

    // Build items HTML
    const itemsHtml = orderItems.map((item: { item_name: string; quantity: number; unit_price: number; total_price: number; item_type: string }) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e5e5;">${item.item_name}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; text-align: right;">₹${item.unit_price.toLocaleString()}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; text-align: right;">₹${item.total_price.toLocaleString()}</td>
      </tr>
    `).join('');

    // Check if order contains workshops
    const hasWorkshops = orderItems.some((item: { item_type: string }) => item.item_type === 'workshop');

    const workshopNote = hasWorkshops ? `
      <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <h3 style="margin: 0 0 8px 0; color: #92400e;">Workshop Booking Confirmed!</h3>
        <p style="margin: 0; color: #78350f;">We're excited to have you join us! You'll receive a separate email with workshop details, including date, time, and what to bring.</p>
      </div>
    ` : '';

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmation</title>
      </head>
      <body style="font-family: 'Georgia', serif; background-color: #faf9f7; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <div style="background-color: #292524; padding: 32px; text-align: center;">
            <img src="https://hkxmiedtdrdjddplexue.supabase.co/storage/v1/object/public/assets/logo.jpg" alt="Basho" style="height: 60px; width: auto; margin-bottom: 8px;" />
          </div>
          
          <div style="padding: 32px;">
            <h2 style="color: #292524; margin: 0 0 8px 0;">Thank you for your order, ${customer_name}!</h2>
            <p style="color: #78716c; margin: 0 0 24px 0;">Your order has been confirmed and is being processed.</p>
            
            <div style="background-color: #f5f5f4; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
              <p style="margin: 0; color: #57534e;"><strong>Order Number:</strong> ${order.order_number}</p>
              <p style="margin: 8px 0 0 0; color: #57534e;"><strong>Order Date:</strong> ${new Date(order.created_at).toLocaleDateString('en-IN', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>

            ${workshopNote}
            
            <h3 style="color: #292524; margin: 0 0 16px 0; border-bottom: 2px solid #292524; padding-bottom: 8px;">Order Details</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f5f5f4;">
                  <th style="padding: 12px; text-align: left; color: #57534e;">Item</th>
                  <th style="padding: 12px; text-align: center; color: #57534e;">Qty</th>
                  <th style="padding: 12px; text-align: right; color: #57534e;">Price</th>
                  <th style="padding: 12px; text-align: right; color: #57534e;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            
            <div style="margin-top: 24px; padding-top: 16px; border-top: 2px solid #292524;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #78716c;">Subtotal:</span>
                <span style="color: #292524;">₹${order.subtotal.toLocaleString()}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #78716c;">Shipping:</span>
                <span style="color: #292524;">₹${(order.shipping_cost || 0).toLocaleString()}</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e5e5;">
                <span style="color: #292524;">Total:</span>
                <span style="color: #292524;">₹${order.total_amount.toLocaleString()}</span>
              </div>
            </div>

            ${order.shipping_address ? `
              <div style="margin-top: 24px; background-color: #f5f5f4; border-radius: 8px; padding: 16px;">
                <h4 style="margin: 0 0 8px 0; color: #292524;">Shipping Address</h4>
                <p style="margin: 0; color: #57534e; white-space: pre-line;">${order.shipping_address}</p>
              </div>
            ` : ''}
          </div>
          
          <div style="background-color: #292524; padding: 24px; text-align: center;">
            <p style="color: #a8a29e; margin: 0 0 8px 0; font-size: 14px;">Thank you for supporting handcrafted pottery.</p>
            <p style="color: #78716c; margin: 0; font-size: 12px;">© ${new Date().getFullYear()} Basho Pottery Studio. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Basho Pottery <onboarding@resend.dev>",
      to: [customer_email],
      subject: `Order Confirmed - ${order.order_number}`,
      html: emailHtml,
    });

    if (emailResponse.error) {
      console.error("Email sending failed:", emailResponse.error);
      throw new Error(`Email sending failed: ${emailResponse.error.message}`);
    }

    console.log("Email sent successfully:", emailResponse.data);

    // Create admin notification for new order
    const { error: notificationError } = await supabase
      .from('admin_notifications')
      .insert({
        type: 'order',
        title: 'New Order Received',
        message: `Order #${order.order_number} from ${customer_name} for ₹${order.total_amount.toLocaleString()}`,
        order_id: order.id,
      });

    if (notificationError) {
      console.error('Error creating admin notification:', notificationError);
    } else {
      console.log('Admin notification created for order:', order.order_number);
    }

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: unknown) {
    console.error("Error in send-order-confirmation function:", error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
