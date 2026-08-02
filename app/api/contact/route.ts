import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import nodemailer from 'nodemailer'
import { envConfig } from '@/lib/env-config'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, subject, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 })
    }

    // Save to database
    const contactMsg = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject: subject || null,
        message,
      },
    })

    // Send email notification if SMTP is configured
    if (envConfig.smtp.user && envConfig.smtp.pass) {
      try {
        const transporter = nodemailer.createTransport({
          host: envConfig.smtp.host,
          port: envConfig.smtp.port,
          secure: envConfig.smtp.port === 465,
          auth: {
            user: envConfig.smtp.user,
            pass: envConfig.smtp.pass,
          },
        })

        await transporter.sendMail({
          from: envConfig.smtp.from,
          to: envConfig.contactEmail,
          replyTo: email,
          subject: `[Studio Panda Contact] ${subject || 'New Contact Form Submission'}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #F97316;">New Contact Form Submission</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Name</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${name}</td></tr>
                <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Email</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${email}</td></tr>
                ${phone ? `<tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Phone</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${phone}</td></tr>` : ''}
                ${subject ? `<tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Subject</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${subject}</td></tr>` : ''}
              </table>
              <div style="margin-top: 16px; padding: 16px; background: #f9f9f9; border-radius: 8px;">
                <p style="margin: 0; white-space: pre-wrap;">${message}</p>
              </div>
              <p style="margin-top: 16px; font-size: 12px; color: #999;">This message was sent via the Studio Panda contact form.</p>
            </div>
          `,
        })
      } catch (emailError) {
        console.error('Email send failed (saved to DB):', emailError)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Your message has been received. We will get back to you soon!',
      id: contactMsg.id,
    }, { status: 201 })
  } catch (error) {
    console.error('Error processing contact form:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
