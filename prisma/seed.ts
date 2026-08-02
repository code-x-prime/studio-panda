import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@studiopanda.in'
  const password = 'AdminSecurePassword123!'
  const name = 'Studio Panda Admin'

  const hashedPassword = await bcrypt.hash(password, 12)

  const existing = await prisma.user.findUnique({ where: { email } })

  if (existing) {
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword, name },
    })
    console.log(`Admin updated: ${email}`)
  } else {
    await prisma.user.create({
      data: { email, password: hashedPassword, name, role: 'ADMIN' },
    })
    console.log(`Admin created: ${email}`)
  }

  console.log('---')
  console.log('Login credentials:')
  console.log(`Email:    ${email}`)
  console.log(`Password: ${password}`)
  console.log('Admin panel: http://localhost:3000/admin/login')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
