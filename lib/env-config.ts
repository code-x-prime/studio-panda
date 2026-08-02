export const envConfig = {
  databaseUrl: process.env.DATABASE_URL || '',
  nextAuthSecret: process.env.NEXTAUTH_SECRET || '04PnZeQn8j2wB/iXf/lMbTS+QtPaWH9O11kAcuGV5ho=',
  nextAuthUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@studiopanda.in',
  adminPassword: process.env.ADMIN_PASSWORD || 'AdminSecurePassword123!',

  // Cloudflare R2 Config
  r2: {
    accountId: process.env.R2_ACCOUNT_ID || '',
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    bucketName: process.env.R2_BUCKET_NAME || 'studio-panda-assets',
    publicUrl: process.env.R2_PUBLIC_URL || 'https://pub-studio-panda.r2.dev',
  },

  // Nodemailer SMTP Config
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || 'Studio Panda <noreply@studiopanda.in>',
  },
  contactEmail: process.env.CONTACT_EMAIL || 'contact@studiopanda.in',

  // Session / Cookie config
  sessionMaxAge: 7 * 24 * 60 * 60, // 7 days in seconds
}
