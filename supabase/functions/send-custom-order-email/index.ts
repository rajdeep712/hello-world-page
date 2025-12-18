import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  customOrderId: string;
  emailType: "payment_request" | "payment_confirmed" | "in_delivery" | "delivered" | "custom";
  customMessage?: string;
  paymentAmount?: number;
}

const getEmailContent = (
  emailType: string,
  customerName: string,
  estimatedPrice: number | null,
  customMessage?: string,
  paymentLink?: string
) => {
  const baseStyles = `
    font-family: 'Georgia', serif;
    color: #333;
    max-width: 600px;
    margin: 0 auto;
    padding: 40px 20px;
  `;

  const headerStyles = `
    text-align: center;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 2px solid #d4a574;
  `;

  const buttonStyles = `
    display: inline-block;
    background-color: #d4a574;
    color: white;
    padding: 14px 28px;
    text-decoration: none;
    border-radius: 6px;
    font-weight: bold;
    margin: 20px 0;
  `;

  switch (emailType) {
    case "payment_request":
      return {
        subject: "Payment Request for Your Custom Pottery Order - Basho by Shivangi",
        html: `
          <div style="${baseStyles}">
            <div style="${headerStyles}">
              <h1 style="color: #8b7355; margin: 0;">Basho by Shivangi</h1>
              <p style="color: #666; margin-top: 5px;">Handcrafted Pottery</p>
            </div>
            
            <h2>Dear ${customerName},</h2>
            
            <p>Thank you for your custom pottery order! We're excited to bring your vision to life.</p>
            
            <p>After reviewing your requirements, the estimated price for your custom piece is:</p>
            
            <div style="background: #f8f5f0; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
              <p style="font-size: 28px; font-weight: bold; color: #8b7355; margin: 0;">
                ₹${estimatedPrice?.toLocaleString() || "—"}
              </p>
            </div>
            
            <p>To proceed with your order, please complete the payment using the button below:</p>
            
            <div style="text-align: center;">
              <a href="${paymentLink}" style="${buttonStyles}">Complete Payment</a>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              Once payment is confirmed, we'll begin crafting your unique piece with care and attention to detail.
            </p>
            
            <p>With warmth,<br><strong>Shivangi</strong><br>Basho by Shivangi</p>
          </div>
        `,
      };

    case "payment_confirmed":
      return {
        subject: "Payment Confirmed - Your Custom Pottery is Now Being Crafted!",
        html: `
          <div style="${baseStyles}">
            <div style="${headerStyles}">
              <h1 style="color: #8b7355; margin: 0;">Basho by Shivangi</h1>
              <p style="color: #666; margin-top: 5px;">Handcrafted Pottery</p>
            </div>
            
            <h2>Dear ${customerName},</h2>
            
            <p>Great news! Your payment has been confirmed, and your custom pottery piece is now in the making.</p>
            
            <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <p style="color: #2e7d32; font-weight: bold; margin: 0;">✓ Payment Confirmed</p>
              <p style="color: #666; margin-top: 10px;">Your piece is now being lovingly crafted by our artisans</p>
            </div>
            
            <p>Every custom piece goes through a careful process of shaping, drying, firing, and glazing. We'll keep you updated on the progress.</p>
            
            <p>With warmth,<br><strong>Shivangi</strong><br>Basho by Shivangi</p>
          </div>
        `,
      };

    case "in_delivery":
      return {
        subject: "Your Custom Pottery is Ready and On Its Way!",
        html: `
          <div style="${baseStyles}">
            <div style="${headerStyles}">
              <h1 style="color: #8b7355; margin: 0;">Basho by Shivangi</h1>
              <p style="color: #666; margin-top: 5px;">Handcrafted Pottery</p>
            </div>
            
            <h2>Dear ${customerName},</h2>
            
            <p>Wonderful news! Your custom pottery piece has been completed and is now on its way to you.</p>
            
            <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <p style="color: #1565c0; font-weight: bold; margin: 0;">🚚 Out for Delivery</p>
              <p style="color: #666; margin-top: 10px;">Your handcrafted piece will arrive soon!</p>
            </div>
            
            <p>We've carefully packaged your piece to ensure it arrives safely. You can track your order status in your account.</p>
            
            <p>With warmth,<br><strong>Shivangi</strong><br>Basho by Shivangi</p>
          </div>
        `,
      };

    case "delivered":
      return {
        subject: "Your Custom Pottery Has Been Delivered!",
        html: `
          <div style="${baseStyles}">
            <div style="${headerStyles}">
              <h1 style="color: #8b7355; margin: 0;">Basho by Shivangi</h1>
              <p style="color: #666; margin-top: 5px;">Handcrafted Pottery</p>
            </div>
            
            <h2>Dear ${customerName},</h2>
            
            <p>Your custom pottery piece has been delivered! We hope it brings joy and beauty to your home.</p>
            
            <div style="background: #f3e5f5; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <p style="color: #7b1fa2; font-weight: bold; margin: 0;">📦 Delivered</p>
              <p style="color: #666; margin-top: 10px;">Thank you for choosing Basho by Shivangi!</p>
            </div>
            
            <p>If you have any questions about caring for your new piece, or if you'd like to share photos of it in its new home, we'd love to hear from you!</p>
            
            <p>With warmth,<br><strong>Shivangi</strong><br>Basho by Shivangi</p>
          </div>
        `,
      };

    case "custom":
      return {
        subject: "Update on Your Custom Pottery Order - Basho by Shivangi",
        html: `
          <div style="${baseStyles}">
            <div style="${headerStyles}">
              <h1 style="color: #8b7355; margin: 0;">Basho by Shivangi</h1>
              <p style="color: #666; margin-top: 5px;">Handcrafted Pottery</p>
            </div>
            
            <h2>Dear ${customerName},</h2>
            
            <div style="background: #f8f5f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; white-space: pre-wrap;">${customMessage || ""}</p>
            </div>
            
            <p>With warmth,<br><strong>Shivangi</strong><br>Basho by Shivangi</p>
          </div>
        `,
      };

    default:
      throw new Error("Invalid email type");
  }
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verify the user is an admin
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if user is admin using service role
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);
    const { data: roleData } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { customOrderId, emailType, customMessage, paymentAmount }: EmailRequest = await req.json();

    // Fetch the custom order
    const { data: order, error: orderError } = await adminClient
      .from("custom_order_requests")
      .select("*")
      .eq("id", customOrderId)
      .single();

    if (orderError || !order) {
      console.error("Order not found:", orderError);
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate payment link for payment_request emails
    let paymentLink = "";
    if (emailType === "payment_request" && (paymentAmount || order.estimated_price)) {
      // Create the payment link that directs to the custom order payment page
      const siteUrl = Deno.env.get("SITE_URL") || "https://grdolasawzsrwuqhpheu.lovableproject.com";
      paymentLink = `${siteUrl}/custom-order-payment/${customOrderId}`;
    }

    // Get email content
    const { subject, html } = getEmailContent(
      emailType,
      order.name,
      paymentAmount || order.estimated_price,
      customMessage,
      paymentLink
    );

    // Send email - Note: Change the "from" address to use your verified domain
    // e.g., "Basho by Shivangi <hello@yourdomain.com>"
    const emailResponse = await resend.emails.send({
      from: "Basho by Shivangi <onboarding@resend.dev>",
      to: [order.email],
      subject,
      html,
    });

    // Check if Resend returned an error
    if (emailResponse.error) {
      console.error("Resend error:", emailResponse.error);
      return new Response(
        JSON.stringify({ 
          error: emailResponse.error.message,
          hint: "You may need to verify a domain at resend.com/domains to send emails to customers."
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Email sent successfully:", emailResponse.data);

    // Update the order status based on email type
    let newStatus = order.status;
    switch (emailType) {
      case "payment_request":
        newStatus = "payment_pending";
        break;
      case "payment_confirmed":
        newStatus = "in_progress";
        break;
      case "in_delivery":
        newStatus = "in_delivery";
        break;
      case "delivered":
        newStatus = "delivered";
        break;
    }

    if (newStatus !== order.status) {
      await adminClient
        .from("custom_order_requests")
        .update({ status: newStatus })
        .eq("id", customOrderId);
    }

    return new Response(
      JSON.stringify({ success: true, emailId: emailResponse.data?.id }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    console.error("Error in send-custom-order-email:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
