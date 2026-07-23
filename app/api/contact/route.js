import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { email, message } = await request.json();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Help Center Support" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Support Issue from ${email}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e4e4e7; border-radius: 12px;">
          <h2 style="color: #4f46e5; margin-top: 0;">New Support Issue Received</h2>
          <p style="color: #52525b;"><strong>From User Email:</strong> ${email}</p>
          <p style="color: #52525b; margin-bottom: 5px;"><strong>Message:</strong></p>
          <div style="background: #f4f4f5; padding: 15px; border-radius: 8px; color: #18181b; line-height: 1.5;">
            ${message}
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}