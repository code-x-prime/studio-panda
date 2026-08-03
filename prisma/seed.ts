import { PrismaClient, Role, MediaType, NoticeCategory } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // 1. Seed Admin User
  const email = 'admin@studiopanda.in'
  const password = 'AdminSecurePassword123!'
  const name = 'Studio Panda Admin'
  const hashedPassword = await bcrypt.hash(password, 12)

  const adminUser = await prisma.user.upsert({
    where: { email },
    update: { password: hashedPassword, name },
    create: {
      email,
      password: hashedPassword,
      name,
      role: Role.ADMIN,
    },
  })
  console.log(`✅ Admin user seeded: ${adminUser.email}`)

  // 2. Seed Programs
  const programsData = [
    {
      title: 'Robotics & AI Masterclass',
      slug: 'robotics-ai-masterclass',
      description: 'Comprehensive hands-on training in robotics, microcontrollers, IoT, and foundational Artificial Intelligence for young innovators.',
      category: 'STEM & Robotics',
      duration: '6 Months',
      targetAudience: 'Grades 6 - 12',
      features: ['Hands-on Hardware Kits', 'AI & Machine Learning Basics', 'Project Building', 'Certificate of Completion'],
      imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800',
      price: '₹14,999',
      isFeatured: true,
      showOnHome: true,
      isActive: true,
      position: 1,
    },
    {
      title: 'Young Innovators Coding Bootcamp',
      slug: 'young-innovators-coding-bootcamp',
      description: 'Learn logic, problem solving, Python programming, and web development fundamentals through interactive games and projects.',
      category: 'Coding & Web Dev',
      duration: '3 Months',
      targetAudience: 'Grades 4 - 10',
      features: ['Python Basics', 'Web Development (HTML/CSS/JS)', '1-on-1 Mentorship', 'Hackathon Participation'],
      imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800',
      price: '₹9,999',
      isFeatured: true,
      showOnHome: true,
      isActive: true,
      position: 2,
    },
    {
      title: 'Creative Media & Game Design',
      slug: 'creative-media-game-design',
      description: 'Unlock your creativity with 2D/3D game design, digital art, UI/UX prototyping, and interactive storytelling.',
      category: 'Design & Media',
      duration: '4 Months',
      targetAudience: 'Grades 7 - 12',
      features: ['Unity 2D Game Dev', 'UI/UX Prototyping', '3D Modeling Intro', 'Portfolio Creation'],
      imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800',
      price: '₹11,999',
      isFeatured: false,
      showOnHome: true,
      isActive: true,
      position: 3,
    },
  ]

  for (const prog of programsData) {
    await prisma.program.upsert({
      where: { slug: prog.slug },
      update: prog,
      create: prog,
    })
  }
  console.log(`✅ ${programsData.length} Programs seeded.`)

  // 3. Seed Collaborations
  await prisma.collaboration.deleteMany({})
  const collaborationsData = [
    {
      title: 'Innovation Lab Partner',
      partnerName: 'TechCorp Academy',
      partnerLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200',
      imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800',
      description: 'Partnering to bring state-of-the-art AI labs to partner schools.',
      websiteUrl: 'https://example.com/techcorp',
      type: 'Academic Partner',
      date: '2025 - Present',
      isFeatured: true,
      showOnHome: true,
      isActive: true,
      position: 1,
    },
    {
      title: 'STEM Curriculum Alliance',
      partnerName: 'GlobalEdu Foundation',
      partnerLogo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=200',
      imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800',
      description: 'Collaborating on international STEM certification programs for students.',
      websiteUrl: 'https://example.com/globaledu',
      type: 'Curriculum Partner',
      date: '2024 - Present',
      isFeatured: true,
      showOnHome: true,
      isActive: true,
      position: 2,
    },
  ]

  for (const collab of collaborationsData) {
    await prisma.collaboration.create({ data: collab })
  }
  console.log(`✅ ${collaborationsData.length} Collaborations seeded.`)

  // 4. Seed Notices
  await prisma.notice.deleteMany({})
  const noticesData = [
    {
      title: 'Admissions Open for National Robotics Challenge 2026',
      category: NoticeCategory.ANNOUNCEMENT,
      content: 'Registration is now open for students across grades 6 to 12. Submit your innovation project proposals by August 30, 2026.',
      isPinned: true,
      showOnHome: true,
      isActive: true,
      position: 1,
      publishDate: new Date(),
    },
    {
      title: 'Upcoming Workshop: Artificial Intelligence in Everyday Life',
      category: NoticeCategory.UPDATE,
      content: 'Join our weekend live interactive workshop on how AI is shaping the future. Open for all registered students.',
      isPinned: true,
      showOnHome: true,
      isActive: true,
      position: 2,
      publishDate: new Date(),
    },
    {
      title: 'Studio Panda Annual Innovation Exhibition Announced',
      category: NoticeCategory.NOTICE,
      content: 'Save the date! Studio Panda will showcase student projects in December 2026.',
      isPinned: false,
      showOnHome: true,
      isActive: true,
      position: 3,
      publishDate: new Date(),
    },
  ]

  for (const notice of noticesData) {
    await prisma.notice.create({ data: notice })
  }
  console.log(`✅ ${noticesData.length} Notices seeded.`)

  // 5. Seed Gallery Items
  await prisma.galleryItem.deleteMany({})
  const galleryData = [
    {
      title: 'Annual Robotics Exhibition 2025',
      type: MediaType.IMAGE,
      url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800',
      fileKey: 'gallery/robotics-exhibition.jpg',
      category: 'Events',
      isActive: true,
      showOnHome: true,
      position: 1,
    },
    {
      title: 'Students Building Autonomous Rovers',
      type: MediaType.IMAGE,
      url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800',
      fileKey: 'gallery/students-rovers.jpg',
      category: 'Workshops',
      isActive: true,
      showOnHome: true,
      position: 2,
    },
    {
      title: 'Coding Hackathon Ceremony',
      type: MediaType.IMAGE,
      url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800',
      fileKey: 'gallery/hackathon-ceremony.jpg',
      category: 'Awards',
      isActive: true,
      showOnHome: true,
      position: 3,
    },
  ]

  for (const gallery of galleryData) {
    await prisma.galleryItem.create({ data: gallery })
  }
  console.log(`✅ ${galleryData.length} Gallery items seeded.`)

  // 6. Seed Site Config
  const configs = [
    { key: 'site_name', value: 'Studio Panda', label: 'Site Name', group: 'general' },
    { key: 'contact_email', value: 'info@studiopanda.in', label: 'Contact Email', group: 'contact' },
    { key: 'contact_phone', value: '+91 98765 43210', label: 'Contact Phone', group: 'contact' },
    { key: 'hero_title', value: 'Empowering Young Minds through Robotics & AI', label: 'Hero Title', group: 'homepage' },
  ]

  for (const conf of configs) {
    await prisma.siteConfig.upsert({
      where: { key: conf.key },
      update: conf,
      create: conf,
    })
  }
  console.log(`✅ Site Configuration seeded.`)

  console.log('-----------------------------------')
  console.log('🎉 Seeding completed successfully!')
  console.log('🔑 Admin Credentials:')
  console.log(`Email:    ${email}`)
  console.log(`Password: ${password}`)
  console.log('-----------------------------------')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

