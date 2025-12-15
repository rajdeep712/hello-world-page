import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AuthEmailPayload {
  user: {
    email: string;
    user_metadata?: {
      full_name?: string;
    };
  };
  email_data: {
    token: string;
    token_hash: string;
    redirect_to: string;
    email_action_type: string;
  };
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: AuthEmailPayload = await req.json();
    
    console.log("Received auth email request:", {
      email: payload.user.email,
      action_type: payload.email_data.email_action_type,
    });

    const { user, email_data } = payload;
    const { token, email_action_type } = email_data;
    const customerName = user.user_metadata?.full_name || "there";

    let subject = "";
    let heading = "";
    let message = "";

    switch (email_action_type) {
      case "signup":
      case "email_signup":
        subject = "Verify Your Email - Bosco By Shivangi";
        heading = "Welcome to Bosco By Shivangi!";
        message = "Thank you for joining our pottery community. Please use the verification code below to complete your registration:";
        break;
      case "recovery":
      case "reset_password":
        subject = "Reset Your Password - Bosco By Shivangi";
        heading = "Password Reset Request";
        message = "We received a request to reset your password. Use the code below to proceed:";
        break;
      case "email_change":
        subject = "Confirm Email Change - Bosco By Shivangi";
        heading = "Email Change Confirmation";
        message = "Please confirm your new email address using the code below:";
        break;
      default:
        subject = "Your Verification Code - Bosco By Shivangi";
        heading = "Verification Required";
        message = "Please use the code below to verify your request:";
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="font-family: 'Georgia', serif; background-color: #faf9f7; margin: 0; padding: 20px;">
        <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <div style="background-color: #292524; padding: 40px 32px; text-align: center;">
            <h1 style="font-family: 'Georgia', serif; color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 2px;">
              Bosco By Shivangi
            </h1>
            <p style="color: #a8a29e; margin: 8px 0 0 0; font-size: 12px; letter-spacing: 3px; text-transform: uppercase;">
              Handcrafted Pottery
            </p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 32px; text-align: center;">
            <h2 style="color: #292524; margin: 0 0 16px 0; font-size: 24px; font-weight: normal;">
              ${heading}
            </h2>
            
            <p style="color: #78716c; margin: 0 0 32px 0; font-size: 16px; line-height: 1.6;">
              Hi ${customerName},<br><br>
              ${message}
            </p>
            
            <!-- OTP Code Box -->
            <div style="background: linear-gradient(135deg, #f5f5f4 0%, #e7e5e4 100%); border-radius: 12px; padding: 24px; margin: 0 0 32px 0;">
              <p style="color: #78716c; margin: 0 0 12px 0; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">
                Your Verification Code
              </p>
              <div style="font-family: 'Courier New', monospace; font-size: 36px; font-weight: bold; color: #292524; letter-spacing: 8px;">
                ${token}
              </div>
            </div>
            
            <p style="color: #a8a29e; margin: 0; font-size: 14px; line-height: 1.5;">
              This code will expire in 1 hour.<br>
              If you didn't request this, please ignore this email.
            </p>
          </div>
          
          <!-- Divider -->
          <div style="padding: 0 32px;">
            <div style="height: 1px; background: linear-gradient(to right, transparent, #d6d3d1, transparent);"></div>
          </div>
          
          <!-- Footer -->
          <div style="padding: 32px; text-align: center;">
            <p style="color: #78716c; margin: 0 0 8px 0; font-size: 14px;">
              Made with love in our pottery studio
            </p>
            <p style="color: #a8a29e; margin: 0; font-size: 12px;">
              © ${new Date().getFullYear()} Bosco By Shivangi. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Note: Change this to your verified domain email once you verify a domain in Resend
    // e.g., "Bosco By Shivangi <noreply@yourdomain.com>"
    const fromEmail = Deno.env.get("RESEND_FROM_EMAIL") || "Bosco By Shivangi <onboarding@resend.dev>";
    
    const emailResponse = await resend.emails.send({
      from: fromEmail,
      to: [user.email],
      subject: subject,
      html: emailHtml,
    });

    if (emailResponse.error) {
      console.error("Email sending failed:", emailResponse.error);
      // Return 200 with empty body to let Supabase fall back to default email
      // This prevents the hook from failing completely
      return new Response(JSON.stringify({}), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log("Auth email sent successfully:", emailResponse.data);

    return new Response(JSON.stringify({}), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: unknown) {
    console.error("Error in send-auth-email function:", error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        error: { 
          http_code: 500, 
          message 
        } 
      }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
