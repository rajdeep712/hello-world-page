import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const experienceNames: Record<string, string> = {
  couple: "Couple Pottery Date",
  birthday: "Birthday Session",
  farm: "Farm & Garden Mini Party",
  studio: "Studio-Based Experience"
};

interface ExperienceConfirmationRequest {
  email: string;
  booking: {
    id: string;
    experience_type: string;
    booking_date: string;
    time_slot: string;
    guests: number;
    total_amount: number;
    notes?: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, booking }: ExperienceConfirmationRequest = await req.json();

    console.log("Sending experience confirmation email to:", email);

    const client = new SMTPClient({
      connection: {
        hostname: "smtp.gmail.com",
        port: 465,
        tls: true,
        auth: {
          username: Deno.env.get("GMAIL_USER")!,
          password: Deno.env.get("GMAIL_APP_PASSWORD")!,
        },
      },
    });

    const experienceName = experienceNames[booking.experience_type] || booking.experience_type;
    const formattedDate = new Date(booking.booking_date).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Georgia', serif; background-color: #FAF7F2;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="color: #3D2914; font-size: 28px; margin: 0; font-weight: normal;">
              Basho by Shivangi
            </h1>
            <p style="color: #8B7355; font-size: 14px; letter-spacing: 2px; margin-top: 8px;">
              HANDCRAFTED POTTERY
            </p>
          </div>

          <!-- Main Content -->
          <div style="background-color: #FFFFFF; border-radius: 8px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="width: 60px; height: 60px; background-color: #E8F5E9; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 30px;">✓</span>
              </div>
              <h2 style="color: #3D2914; font-size: 24px; margin: 0;">You're All Set!</h2>
              <p style="color: #6B5B4F; margin-top: 10px;">Your experience has been confirmed</p>
            </div>

            <!-- Booking Details -->
            <div style="border: 1px solid #E8E2D9; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
              <h3 style="color: #B5651D; font-size: 18px; margin: 0 0 20px 0;">${experienceName}</h3>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #E8E2D9; color: #8B7355; font-size: 14px;">Date</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #E8E2D9; color: #3D2914; font-size: 14px; text-align: right; font-weight: 500;">${formattedDate}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #E8E2D9; color: #8B7355; font-size: 14px;">Time</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #E8E2D9; color: #3D2914; font-size: 14px; text-align: right; font-weight: 500;">${booking.time_slot}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #E8E2D9; color: #8B7355; font-size: 14px;">Guests</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #E8E2D9; color: #3D2914; font-size: 14px; text-align: right; font-weight: 500;">${booking.guests} ${booking.guests === 1 ? 'person' : 'people'}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; color: #8B7355; font-size: 14px;">Amount Paid</td>
                  <td style="padding: 12px 0; color: #B5651D; font-size: 18px; text-align: right; font-weight: 600;">₹${booking.total_amount.toLocaleString('en-IN')}</td>
                </tr>
              </table>
              
              ${booking.notes ? `
              <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #E8E2D9;">
                <p style="color: #8B7355; font-size: 14px; margin: 0 0 8px 0;">Your Notes</p>
                <p style="color: #3D2914; font-size: 14px; margin: 0; font-style: italic;">"${booking.notes}"</p>
              </div>
              ` : ''}
            </div>

            <!-- What to Expect -->
            <div style="background-color: #FDF8F3; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
              <h4 style="color: #3D2914; font-size: 16px; margin: 0 0 12px 0;">What to Expect</h4>
              <ul style="color: #6B5B4F; font-size: 14px; margin: 0; padding-left: 20px; line-height: 1.8;">
                <li>Please arrive 10 minutes before your scheduled time</li>
                <li>Wear comfortable clothes that can get a little clay on them</li>
                <li>We'll provide all materials and aprons</li>
                <li>Your finished pieces will be ready for pickup in 2-3 weeks</li>
              </ul>
            </div>

            <!-- Location -->
            <div style="text-align: center; padding: 20px 0; border-top: 1px solid #E8E2D9;">
              <p style="color: #8B7355; font-size: 14px; margin: 0 0 8px 0;">STUDIO LOCATION</p>
              <p style="color: #3D2914; font-size: 14px; margin: 0;">Basho Studio, Noida</p>
              <p style="color: #6B5B4F; font-size: 14px; margin: 4px 0 0 0;">We'll send you the exact address closer to your booking date</p>
            </div>
          </div>

          <!-- Footer -->
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #8B7355; font-size: 14px; margin: 0 0 10px 0;">
              Questions? Reply to this email or call us
            </p>
            <p style="color: #6B5B4F; font-size: 12px; margin: 0;">
              Basho by Shivangi • Handcrafted with love
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    await client.send({
      from: Deno.env.get("GMAIL_USER")!,
      to: email,
      subject: `Your ${experienceName} is Confirmed! 🎨`,
      html: htmlContent,
    });

    await client.close();

    console.log("Experience confirmation email sent successfully to:", email);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending experience confirmation email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);