import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { saveInquiry } from "../../../lib/content-db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: "All fields (name, email, phone, message) are required." },
        { status: 400 }
      );
    }

    // 1. Persist the client message in database for Admin Panel retrieval
    const savedRecord = await saveInquiry({ name, email, phone, message });

    const ownerEmail = process.env.OWNER_EMAIL || "powerlensmedia@gmail.com";
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || `Power Lens <${smtpUser || ownerEmail}>`;

    console.log(`[CONTACT FORM SUBMISSION] Saved ID: ${savedRecord?.id || "N/A"} From: ${name} (${email}, ${phone})`);
    console.log(`[MESSAGE CONTENT]: ${message}`);

    const hasSmtp = Boolean(smtpUser && smtpPass);

    if (hasSmtp) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      // 1. Email to Portfolio Owner
      const ownerMailOptions = {
        from: smtpFrom,
        to: ownerEmail,
        replyTo: email,
        subject: `⚡ New Portfolio Inquiry from ${name}`,
        html: `
          <div style="background-color: #0e0e0e; color: #e5e2e1; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px 20px; max-width: 600px; margin: 0 auto; border: 1px solid #262626; border-radius: 8px;">
            <div style="border-bottom: 1px solid #333333; padding-bottom: 20px; margin-bottom: 24px;">
              <span style="font-family: monospace; font-size: 11px; letter-spacing: 2px; color: #a3a3a3; text-transform: uppercase;">POWER LENS • INCOMING INQUIRY</span>
              <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 12px 0 4px 0; text-transform: uppercase;">New Client Message</h1>
              <p style="color: #888888; font-size: 13px; margin: 0;">Received at ${new Date().toLocaleString("en-US", { timeZone: "Africa/Lagos" })} (UTC+1)</p>
            </div>
            
            <div style="background-color: #171717; padding: 20px; border-radius: 6px; border: 1px solid #262626; margin-bottom: 24px;">
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                  <td style="padding: 8px 0; color: #888888; font-family: monospace; text-transform: uppercase; width: 110px;">Client Name:</td>
                  <td style="padding: 8px 0; color: #ffffff; font-weight: 600;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #888888; font-family: monospace; text-transform: uppercase;">Email:</td>
                  <td style="padding: 8px 0; color: #ffffff;"><a href="mailto:${email}" style="color: #ffffff; text-decoration: underline;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #888888; font-family: monospace; text-transform: uppercase;">Phone:</td>
                  <td style="padding: 8px 0; color: #ffffff;"><a href="tel:${phone}" style="color: #ffffff; text-decoration: underline;">${phone}</a></td>
                </tr>
              </table>
            </div>

            <div style="margin-bottom: 30px;">
              <span style="font-family: monospace; font-size: 11px; color: #888888; text-transform: uppercase; letter-spacing: 1px;">Message Payload:</span>
              <div style="background-color: #1c1c1c; padding: 20px; border-left: 3px solid #ffffff; color: #e5e2e1; font-size: 15px; line-height: 1.6; margin-top: 8px; white-space: pre-wrap;">${message}</div>
            </div>

            <div style="border-top: 1px solid #262626; pt: 20px; font-size: 12px; color: #666666; font-family: monospace; text-align: center; margin-top: 30px; padding-top: 20px;">
              Power Lens Media Portfolio System • Lagos, Nigeria
            </div>
          </div>
        `,
      };

      // 2. Confirmation Email to Client
      const clientMailOptions = {
        from: smtpFrom,
        to: email,
        subject: `Message Received — Power Lens Photography`,
        html: `
          <div style="background-color: #0e0e0e; color: #e5e2e1; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px 20px; max-width: 600px; margin: 0 auto; border: 1px solid #262626; border-radius: 8px;">
            <div style="border-bottom: 1px solid #333333; padding-bottom: 20px; margin-bottom: 24px;">
              <span style="font-family: monospace; font-size: 11px; letter-spacing: 2px; color: #a3a3a3; text-transform: uppercase;">POWER LENS • EDWARDS GODSPOWER</span>
              <h1 style="color: #ffffff; font-size: 22px; font-weight: 700; margin: 12px 0 4px 0;">Thank you for your message!</h1>
            </div>
            
            <p style="font-size: 15px; line-height: 1.6; color: #d4d4d4;">Hello <strong>${name}</strong>,</p>
            
            <p style="font-size: 15px; line-height: 1.6; color: #d4d4d4;">
              We have received your message regarding photography services / project inquiries. Edwards Godspower will review your request and get back to you shortly (typically within 24 hours).
            </p>

            <div style="background-color: #171717; padding: 18px; border-radius: 6px; border: 1px solid #262626; margin: 24px 0;">
              <span style="font-family: monospace; font-size: 11px; color: #888888; text-transform: uppercase; display: block; margin-bottom: 8px;">Summary of Your Submission:</span>
              <p style="font-size: 13px; color: #aaaaaa; margin: 4px 0;"><strong>Phone:</strong> ${phone}</p>
              <p style="font-size: 13px; color: #aaaaaa; margin: 4px 0;"><strong>Message:</strong> "${message}"</p>
            </div>

            <p style="font-size: 14px; line-height: 1.6; color: #a3a3a3;">
              If your request is urgent, feel free to connect directly on Instagram at <a href="https://www.instagram.com/gpoweredward" style="color: #ffffff; text-decoration: underline;">@gpoweredward</a>.
            </p>

            <div style="border-top: 1px solid #262626; margin-top: 32px; padding-top: 20px; font-size: 12px; color: #666666; font-family: monospace; text-align: center;">
              © ${new Date().getFullYear()} Power Lens Media. All rights reserved.
            </div>
          </div>
        `,
      };

      await Promise.all([
        transporter.sendMail(ownerMailOptions),
        transporter.sendMail(clientMailOptions),
      ]);
    }

    return NextResponse.json({
      success: true,
      message: "Your message has been sent successfully! We will get back to you shortly.",
      inquiryId: savedRecord?.id,
      smtpDispatched: hasSmtp,
    });
  } catch (error: unknown) {
    console.error("Error sending contact email:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again or reach out directly via email." },
      { status: 500 }
    );
  }
}
