import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

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

    const year = new Date().getFullYear();
    
    const emailHtml = [
      '<!DOCTYPE html>',
      '<html>',
      '<head>',
      '<meta charset="utf-8">',
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
      '</head>',
      '<body style="margin:0;padding:0;background-color:#faf9f7;">',
      '<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#faf9f7;padding:20px;">',
      '<tr><td align="center">',
      '<table width="500" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;">',
      
      // Header
      '<tr><td style="background-color:#292524;padding:40px 32px;text-align:center;">',
      '<h1 style="font-family:Georgia,serif;color:#ffffff;margin:0;font-size:28px;letter-spacing:2px;">',
      'Bosco By Shivangi</h1>',
      '<p style="color:#a8a29e;margin:8px 0 0 0;font-size:12px;letter-spacing:3px;text-transform:uppercase;">',
      'Handcrafted Pottery</p>',
      '</td></tr>',
      
      // Content
      '<tr><td style="padding:40px 32px;text-align:center;">',
      `<h2 style="color:#292524;margin:0 0 16px 0;font-size:24px;font-weight:normal;">${heading}</h2>`,
      `<p style="color:#78716c;margin:0 0 32px 0;font-size:16px;line-height:1.6;">`,
      `Hi ${customerName},<br><br>${message}</p>`,
      
      // OTP Box
      '<table width="100%" cellpadding="0" cellspacing="0">',
      '<tr><td style="background-color:#f5f5f4;border-radius:12px;padding:24px;text-align:center;">',
      '<p style="color:#78716c;margin:0 0 12px 0;font-size:12px;letter-spacing:2px;text-transform:uppercase;">',
      'Your Verification Code</p>',
      `<div style="font-family:Courier New,monospace;font-size:36px;font-weight:bold;color:#292524;letter-spacing:8px;">`,
      `${token}</div>`,
      '</td></tr>',
      '</table>',
      
      '<p style="color:#a8a29e;margin:32px 0 0 0;font-size:14px;line-height:1.5;">',
      'This code will expire in 1 hour.<br>',
      'If you did not request this, please ignore this email.</p>',
      '</td></tr>',
      
      // Divider
      '<tr><td style="padding:0 32px;">',
      '<div style="height:1px;background-color:#d6d3d1;"></div>',
      '</td></tr>',
      
      // Footer
      '<tr><td style="padding:32px;text-align:center;">',
      '<p style="color:#78716c;margin:0 0 8px 0;font-size:14px;">Made with love in our pottery studio</p>',
      `<p style="color:#a8a29e;margin:0;font-size:12px;">&copy; ${year} Bosco By Shivangi. All rights reserved.</p>`,
      '</td></tr>',
      
      '</table>',
      '</td></tr>',
      '</table>',
      '</body>',
      '</html>'
    ].join('\n');

    const gmailUser = Deno.env.get("GMAIL_USER");
    const gmailAppPassword = Deno.env.get("GMAIL_APP_PASSWORD");

    if (!gmailUser || !gmailAppPassword) {
      console.error("Gmail credentials not configured");
      return new Response(JSON.stringify({}), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const sendEmailViaGmail = async () => {
      const client = new SMTPClient({
        connection: {
          hostname: "smtp.gmail.com",
          port: 465,
          tls: true,
          auth: {
            username: gmailUser,
            password: gmailAppPassword,
          },
        },
      });

      try {
        await client.send({
          from: `Bosco By Shivangi <${gmailUser}>`,
          to: user.email,
          subject,
          html: emailHtml,
        });

        console.log("Auth email sent successfully via Gmail to:", user.email);
      } catch (smtpError) {
        console.error("SMTP error:", smtpError);
      } finally {
        try {
          await client.close();
        } catch (closeError) {
          console.error("SMTP close error:", closeError);
        }
      }
    };

    // Supabase Auth hooks time out after ~5s. Respond immediately and send the email in the background.
    const edgeRuntime = (globalThis as unknown as { EdgeRuntime?: { waitUntil?: (p: Promise<unknown>) => void } }).EdgeRuntime;
    if (edgeRuntime?.waitUntil) {
      edgeRuntime.waitUntil(sendEmailViaGmail());
    } else {
      // Local/dev fallback
      await sendEmailViaGmail();
    }

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
