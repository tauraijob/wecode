import { PrismaClient, Prisma } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create admin user for E-LEARNING PLATFORM (different from general website)
  const adminEmail = 'taujob1111@gmail.com'
  const adminPassword = 'ElearningAdmin@2024'

  const hashedPassword = await bcrypt.hash(adminPassword, 10)

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      emailVerified: true
    },
    create: {
      email: adminEmail,
      name: 'E-Learning Admin',
      role: 'ADMIN',
      hashedPassword: hashedPassword,
      phone: '+263 778 456 168',
      emailVerified: true
    }
  })

  console.log('✅ E-Learning Admin user created:', {
    email: adminUser.email,
    name: adminUser.name,
    role: adminUser.role
  })

  // Create a regular user for courses (E-LEARNING PLATFORM)
  const userEmail = 'info@wecode.co.zw'
  const userPassword = 'ElearningStudent@2024'

  const userHashedPassword = await bcrypt.hash(userPassword, 10)

  const regularUser = await prisma.user.upsert({
    where: { email: userEmail },
    update: {
      emailVerified: true
    },
    create: {
      email: userEmail,
      name: 'E-Learning Student',
      role: 'STUDENT',
      hashedPassword: userHashedPassword,
      phone: '+263 777 123 456',
      emailVerified: true
    }
  })

  console.log('✅ E-Learning Student user created:', {
    email: regularUser.email,
    name: regularUser.name,
    role: regularUser.role
  })

  // Create instructor user for E-LEARNING PLATFORM
  const instructorEmail = 'mtauraij@gmail.com'
  const instructorPassword = 'ElearningInstructor@2024'

  const instructorHashedPassword = await bcrypt.hash(instructorPassword, 10)

  const instructorUser = await prisma.user.upsert({
    where: { email: instructorEmail },
    update: {
      emailVerified: true
    },
    create: {
      email: instructorEmail,
      name: 'E-Learning Instructor',
      role: 'INSTRUCTOR',
      hashedPassword: instructorHashedPassword,
      phone: '+263 777 789 012',
      emailVerified: true
    }
  })

  console.log('✅ E-Learning Instructor user created:', {
    email: instructorUser.email,
    name: instructorUser.name,
    role: instructorUser.role
  })

  // Create dummy courses with topics and lessons
  const courses = [
    {
      name: 'Introduction to Web Development',
      description: 'Learn the fundamentals of web development including HTML, CSS, and JavaScript. This course is perfect for beginners who want to start their journey in web development.',
      price: new Prisma.Decimal('99.99'),
      currency: 'USD',
      status: 'PUBLISHED' as const,
      thumbnailUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=450&fit=crop&auto=format',
      previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      prerequisites: 'No prior experience required. Basic computer skills recommended.',
      examConfig: {
        questionCount: 20,
        duration: 60,
        passingScore: 70
      },
      topics: [
        {
          name: 'HTML Basics',
          description: 'Learn the structure and syntax of HTML',
          order: 1,
          lessons: [
            {
              title: 'Introduction to HTML',
              description: 'Understanding HTML structure and basic tags',
              videoUrl: 'https://example.com/videos/html-intro.mp4',
              videoDuration: 600,
              transcript: 'HTML stands for HyperText Markup Language. It is the standard markup language for creating web pages.',
              notes: 'Key concepts: elements, tags, attributes, document structure',
              order: 1
            },
            {
              title: 'HTML Forms and Input',
              description: 'Creating forms and handling user input',
              videoUrl: 'https://example.com/videos/html-forms.mp4',
              videoDuration: 720,
              transcript: 'Forms are essential for collecting user data. Learn about input types, validation, and form submission.',
              notes: 'Input types: text, email, password, checkbox, radio, submit',
              order: 2
            }
          ]
        },
        {
          name: 'CSS Styling',
          description: 'Master CSS to style your web pages beautifully',
          order: 2,
          lessons: [
            {
              title: 'CSS Fundamentals',
              description: 'Introduction to CSS selectors and properties',
              videoUrl: 'https://example.com/videos/css-fundamentals.mp4',
              videoDuration: 900,
              transcript: 'CSS allows you to style HTML elements. Learn about selectors, properties, and values.',
              notes: 'Selectors: element, class, ID, attribute, pseudo-classes',
              order: 1
            },
            {
              title: 'CSS Layout with Flexbox',
              description: 'Create responsive layouts using Flexbox',
              videoUrl: 'https://example.com/videos/css-flexbox.mp4',
              videoDuration: 1080,
              transcript: 'Flexbox is a powerful layout system for creating flexible and responsive designs.',
              notes: 'Key properties: display, flex-direction, justify-content, align-items',
              order: 2
            }
          ]
        },
        {
          name: 'JavaScript Basics',
          description: 'Learn programming fundamentals with JavaScript',
          order: 3,
          lessons: [
            {
              title: 'JavaScript Variables and Data Types',
              description: 'Understanding variables, constants, and data types in JavaScript',
              videoUrl: 'https://example.com/videos/js-variables.mp4',
              videoDuration: 840,
              transcript: 'JavaScript is a dynamic programming language. Learn about variables, data types, and type coercion.',
              notes: 'Data types: string, number, boolean, null, undefined, object, symbol',
              order: 1
            },
            {
              title: 'JavaScript Functions',
              description: 'Creating and using functions in JavaScript',
              videoUrl: 'https://example.com/videos/js-functions.mp4',
              videoDuration: 960,
              transcript: 'Functions are reusable blocks of code. Learn about function declarations, expressions, and arrow functions.',
              notes: 'Function types: declaration, expression, arrow, IIFE',
              order: 2
            }
          ]
        }
      ]
    },
    {
      name: 'Advanced React Development',
      description: 'Master React and build modern, interactive web applications. Learn hooks, state management, and best practices.',
      price: new Prisma.Decimal('149.99'),
      currency: 'USD',
      status: 'PUBLISHED' as const,
      thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop&auto=format',
      previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      prerequisites: 'Basic knowledge of JavaScript and HTML required.',
      examConfig: {
        questionCount: 25,
        duration: 90,
        passingScore: 75
      },
      topics: [
        {
          name: 'React Fundamentals',
          description: 'Understanding React components and JSX',
          order: 1,
          lessons: [
            {
              title: 'Introduction to React',
              description: 'What is React and why use it?',
              videoUrl: 'https://example.com/videos/react-intro.mp4',
              videoDuration: 600,
              transcript: 'React is a JavaScript library for building user interfaces. Learn about components, props, and JSX.',
              notes: 'Key concepts: components, props, JSX, virtual DOM',
              order: 1
            },
            {
              title: 'React Components and Props',
              description: 'Creating reusable components',
              videoUrl: 'https://example.com/videos/react-components.mp4',
              videoDuration: 900,
              transcript: 'Components are the building blocks of React applications. Learn how to create and use them.',
              notes: 'Component types: functional, class, composition patterns',
              order: 2
            }
          ]
        },
        {
          name: 'React Hooks',
          description: 'Modern React with Hooks',
          order: 2,
          lessons: [
            {
              title: 'useState Hook',
              description: 'Managing component state with useState',
              videoUrl: 'https://example.com/videos/react-usestate.mp4',
              videoDuration: 720,
              transcript: 'useState is a React Hook that lets you add state to functional components.',
              notes: 'State updates, functional updates, object state',
              order: 1
            },
            {
              title: 'useEffect Hook',
              description: 'Handling side effects in React',
              videoUrl: 'https://example.com/videos/react-useeffect.mp4',
              videoDuration: 840,
              transcript: 'useEffect lets you perform side effects in functional components.',
              notes: 'Dependencies, cleanup, async effects',
              order: 2
            }
          ]
        }
      ]
    },
    {
      name: 'Python for Data Science',
      description: 'Learn Python programming and data analysis with pandas, numpy, and matplotlib. Perfect for aspiring data scientists.',
      price: new Prisma.Decimal('129.99'),
      currency: 'USD',
      status: 'PUBLISHED' as const,
      thumbnailUrl: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=450&fit=crop&auto=format',
      previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      prerequisites: 'Basic programming knowledge helpful but not required.',
      examConfig: {
        questionCount: 30,
        duration: 120,
        passingScore: 70
      },
      topics: [
        {
          name: 'Python Basics',
          description: 'Python programming fundamentals',
          order: 1,
          lessons: [
            {
              title: 'Python Syntax and Variables',
              description: 'Getting started with Python',
              videoUrl: 'https://example.com/videos/python-syntax.mp4',
              videoDuration: 600,
              transcript: 'Python is a high-level programming language known for its simplicity and readability.',
              notes: 'Syntax, indentation, variables, naming conventions',
              order: 1
            },
            {
              title: 'Python Data Structures',
              description: 'Lists, dictionaries, tuples, and sets',
              videoUrl: 'https://example.com/videos/python-data-structures.mp4',
              videoDuration: 1080,
              transcript: 'Python provides powerful built-in data structures for organizing and manipulating data.',
              notes: 'Lists, dicts, tuples, sets, comprehensions',
              order: 2
            }
          ]
        },
        {
          name: 'Data Analysis with Pandas',
          description: 'Working with data using pandas library',
          order: 2,
          lessons: [
            {
              title: 'Introduction to Pandas',
              description: 'DataFrames and Series basics',
              videoUrl: 'https://example.com/videos/pandas-intro.mp4',
              videoDuration: 900,
              transcript: 'Pandas is a powerful library for data manipulation and analysis in Python.',
              notes: 'DataFrames, Series, reading CSV, basic operations',
              order: 1
            },
            {
              title: 'Data Cleaning and Transformation',
              description: 'Cleaning and preparing data for analysis',
              videoUrl: 'https://example.com/videos/pandas-cleaning.mp4',
              videoDuration: 1200,
              transcript: 'Data cleaning is a crucial step in data analysis. Learn how to handle missing values and transform data.',
              notes: 'Missing data, filtering, grouping, aggregations',
              order: 2
            }
          ]
        }
      ]
    }
  ]

  for (const courseData of courses) {
    const { topics, ...courseInfo } = courseData

    // Check if course already exists
    const existingCourse = await prisma.course.findFirst({
      where: { name: courseData.name }
    })

    if (existingCourse) {
      console.log(`⏭️  Course already exists: ${courseData.name}`)
      continue
    }

    const course = await prisma.course.create({
      data: {
        ...courseInfo,
        topics: {
          create: topics.map(topic => ({
            name: topic.name,
            description: topic.description,
            order: topic.order,
            lessons: {
              create: topic.lessons.map(lesson => ({
                title: lesson.title,
                description: lesson.description,
                videoUrl: lesson.videoUrl,
                videoDuration: lesson.videoDuration,
                transcript: lesson.transcript,
                notes: lesson.notes,
                order: lesson.order
              }))
            }
          }))
        }
      },
      include: {
        topics: {
          include: {
            lessons: true
          }
        }
      }
    })

    console.log(`✅ Course created: ${course.name} (${course.topics.length} topics, ${course.topics.reduce((sum, t) => sum + t.lessons.length, 0)} lessons)`)
  }

  console.log('\n🎉 Seed completed successfully!')
  console.log('\n📋 E-LEARNING PLATFORM Login Credentials:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('👤 E-LEARNING ADMIN ACCOUNT:')
  console.log(`   Email:    ${adminEmail}`)
  console.log(`   Password: ${adminPassword}`)
  console.log('   Role:     ADMIN')
  console.log('   Access:   Full admin dashboard, course management')
  console.log('')
  console.log('👤 E-LEARNING STUDENT ACCOUNT:')
  console.log(`   Email:    ${userEmail}`)
  console.log(`   Password: ${userPassword}`)
  console.log('   Role:     STUDENT')
  console.log('   Access:   Course catalog, enrollment, learning progress')
  console.log('')
  console.log('👤 E-LEARNING INSTRUCTOR ACCOUNT:')
  console.log(`   Email:    ${instructorEmail}`)
  console.log(`   Password: ${instructorPassword}`)
  console.log('   Role:     INSTRUCTOR')
  console.log('   Access:   Create courses, manage content, submit for review')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  // Create products
  console.log('\n🛍️  Creating products...')

  const products = [
    {
      name: 'Touchpad Gel Cleaner & Protector',
      description: 'Premium gel-based cleaner specifically designed for laptop touchpads. Removes fingerprints, smudges, and maintains smooth surface. Contains anti-static properties to prevent dust accumulation. Safe for all touchpad surfaces.',
      slug: 'touchpad-gel-cleaner-protector',
      price: new Prisma.Decimal('12.99'),
      currency: 'USD',
      status: 'PUBLISHED' as const,
      stock: 50,
      sku: 'ACC-TPCL-001',
      category: 'Cleaning & Maintenance',
      tags: 'cleaner, touchpad, gel, protector, laptop',
      images: ['https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&h=800&fit=crop&auto=format'],
      featured: true,
      weight: new Prisma.Decimal('0.15'),
      dimensions: '10x5x3'
    },
    {
      name: 'Programming Sticker Pack - Developer Edition',
      description: 'Premium vinyl sticker pack featuring popular programming languages, frameworks, and developer quotes. Waterproof, fade-resistant, and perfect for laptops, water bottles, and notebooks. Includes 25 unique designs.',
      slug: 'programming-sticker-pack-developer',
      price: new Prisma.Decimal('8.99'),
      currency: 'USD',
      status: 'PUBLISHED' as const,
      stock: 100,
      sku: 'ACC-STK-001',
      category: 'Accessories',
      tags: 'stickers, programming, developer, vinyl, laptop',
      images: ['https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&h=800&fit=crop&auto=format'],
      featured: true,
      weight: new Prisma.Decimal('0.05'),
      dimensions: '15x10x1'
    },
    {
      name: 'RGB Gaming Mouse - Pro Edition',
      description: 'High-precision gaming mouse with customizable RGB lighting, 12,000 DPI sensor, and ergonomic design. Features programmable buttons, smooth gliding feet, and braided cable. Perfect for gaming and professional work.',
      slug: 'rgb-gaming-mouse-pro',
      price: new Prisma.Decimal('45.99'),
      currency: 'USD',
      status: 'PUBLISHED' as const,
      stock: 30,
      sku: 'ACC-MSE-GM-001',
      category: 'Gaming Accessories',
      tags: 'mouse, gaming, rgb, wireless, ergonomic',
      images: ['https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&h=800&fit=crop&auto=format'],
      featured: true,
      weight: new Prisma.Decimal('0.12'),
      dimensions: '12x6x4'
    },
    {
      name: 'Mechanical Keyboard Wrist Rest - Ergonomic',
      description: 'Premium memory foam wrist rest designed for mechanical keyboards. Reduces wrist strain during long coding sessions. Breathable fabric cover, non-slip base, and perfect height alignment for comfortable typing.',
      slug: 'mechanical-keyboard-wrist-rest',
      price: new Prisma.Decimal('18.99'),
      currency: 'USD',
      status: 'PUBLISHED' as const,
      stock: 40,
      sku: 'ACC-WR-KB-001',
      category: 'Ergonomic Accessories',
      tags: 'wrist rest, keyboard, ergonomic, comfort, memory foam',
      images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&h=800&fit=crop&auto=format'],
      featured: false,
      weight: new Prisma.Decimal('0.25'),
      dimensions: '35x8x3'
    },
    {
      name: 'USB-C Hub with 8 Ports',
      description: 'Multi-port USB-C hub featuring HDMI 4K, USB 3.0 ports, SD/TF card readers, and PD charging. Compact design perfect for MacBook and Windows laptops. Supports simultaneous data transfer and charging.',
      slug: 'usb-c-hub-8-ports',
      price: new Prisma.Decimal('32.99'),
      currency: 'USD',
      status: 'PUBLISHED' as const,
      stock: 25,
      sku: 'ACC-HUB-UC-001',
      category: 'Connectivity',
      tags: 'usb-c, hub, adapter, hdmi, charging',
      images: ['https://images.unsplash.com/photo-1555617766-bfa3f9822c4d?w=800&h=800&fit=crop&auto=format'],
      featured: true,
      weight: new Prisma.Decimal('0.08'),
      dimensions: '10x3x1'
    },
    {
      name: 'Blue Light Blocking Glasses - Developer Edition',
      description: 'Stylish blue light filtering glasses designed for developers and programmers. Reduces eye strain from extended screen time. Lightweight frame, anti-glare coating, and UV protection. Available in multiple frame colors.',
      slug: 'blue-light-blocking-glasses-developer',
      price: new Prisma.Decimal('24.99'),
      currency: 'USD',
      status: 'PUBLISHED' as const,
      stock: 60,
      sku: 'ACC-GLS-BL-001',
      category: 'Eye Care',
      tags: 'glasses, blue light, eye care, developer, protection',
      images: ['https://images.unsplash.com/photo-1512314889357-e157c22f938d?w=800&h=800&fit=crop&auto=format'],
      featured: false,
      weight: new Prisma.Decimal('0.03'),
      dimensions: '15x5x2'
    },
    {
      name: 'Laptop Stand - Aluminum Adjustable',
      description: 'Premium aluminum laptop stand with adjustable height and angle. Improves ergonomics and airflow. Fits laptops from 10" to 17". Foldable design for easy portability. Non-slip rubber pads protect your device.',
      slug: 'laptop-stand-aluminum-adjustable',
      price: new Prisma.Decimal('28.99'),
      currency: 'USD',
      status: 'PUBLISHED' as const,
      stock: 35,
      sku: 'ACC-STD-LP-001',
      category: 'Ergonomic Accessories',
      tags: 'laptop stand, ergonomic, adjustable, aluminum, portable',
      images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=800&fit=crop&auto=format'],
      featured: false,
      weight: new Prisma.Decimal('0.6'),
      dimensions: '30x25x5'
    },
    {
      name: 'Cable Management Sleeve - Tech Organizer',
      description: 'Neoprene cable management sleeve to organize and protect your laptop charger and cables. Stretchable design fits various cable sizes. Keeps your workspace clean and professional. Available in multiple colors.',
      slug: 'cable-management-sleeve',
      price: new Prisma.Decimal('9.99'),
      currency: 'USD',
      status: 'PUBLISHED' as const,
      stock: 80,
      sku: 'ACC-CBL-001',
      category: 'Organization',
      tags: 'cable management, organizer, sleeve, neoprene, tidy',
      images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop&auto=format'],
      featured: false,
      weight: new Prisma.Decimal('0.05'),
      dimensions: '50x3x3'
    },
    {
      name: 'Wireless Charging Mouse Pad',
      description: 'Dual-function mouse pad with built-in wireless charging for compatible phones and earbuds. Large surface area (300x250mm), smooth tracking surface, and LED charging indicator. USB-C powered with fast charging support.',
      slug: 'wireless-charging-mouse-pad',
      price: new Prisma.Decimal('39.99'),
      currency: 'USD',
      status: 'PUBLISHED' as const,
      stock: 20,
      sku: 'ACC-MP-WC-001',
      category: 'Gaming Accessories',
      tags: 'mouse pad, wireless charging, gaming, rgb, large',
      images: ['https://images.unsplash.com/photo-1591488320449-11f2d4fdf8c6?w=800&h=800&fit=crop&auto=format'],
      featured: true,
      weight: new Prisma.Decimal('0.4'),
      dimensions: '30x25x0.5'
    },
    {
      name: 'Laptop Cooling Pad - RGB Fans',
      description: 'High-performance laptop cooling pad with dual 120mm RGB fans and adjustable height. Reduces laptop temperature by up to 15°C. USB-powered with speed control. Mesh surface for optimal airflow. Perfect for gaming and intensive tasks.',
      slug: 'laptop-cooling-pad-rgb',
      price: new Prisma.Decimal('34.99'),
      currency: 'USD',
      status: 'PUBLISHED' as const,
      stock: 28,
      sku: 'ACC-CLP-RGB-001',
      category: 'Cooling Solutions',
      tags: 'cooling pad, laptop, rgb, fans, temperature control',
      images: ['https://images.unsplash.com/photo-1591488320449-11f2d4fdf8c6?w=800&h=800&fit=crop&auto=format'],
      featured: false,
      weight: new Prisma.Decimal('0.8'),
      dimensions: '35x30x3'
    }
  ]

  for (const productData of products) {
    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: productData,
      create: productData
    })
    console.log(`   ✅ Created product: ${product.name} - $${product.price}`)
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('\n📚 Created Courses:')
  console.log('   1. Introduction to Web Development - $99.99')
  console.log('   2. Advanced React Development - $149.99')
  console.log('   3. Python for Data Science - $129.99')
  console.log('\n🛍️  Created Products:')
  console.log('   1. Touchpad Gel Cleaner & Protector - $12.99')
  console.log('   2. Programming Sticker Pack - $8.99')
  console.log('   3. RGB Gaming Mouse Pro - $45.99')
  console.log('   4. Mechanical Keyboard Wrist Rest - $18.99')
  console.log('   5. USB-C Hub 8 Ports - $32.99')
  console.log('   6. Blue Light Blocking Glasses - $24.99')
  console.log('   7. Laptop Stand Aluminum - $28.99')
  console.log('   8. Cable Management Sleeve - $9.99')
  console.log('   9. Wireless Charging Mouse Pad - $39.99')
  console.log('   10. Laptop Cooling Pad RGB - $34.99')
  console.log('\n💡 You can now login and explore the courses and shop products!')

  // ==========================================
  // Community & Mentorship Test Users
  // ==========================================
  console.log('\n🧑‍🏫 Creating Community & Mentorship test users...')

  const communityPassword = 'Community@2024'
  const communityHashedPassword = await bcrypt.hash(communityPassword, 10)

  // Create Mentor 1 - Verified, many sessions
  const mentor1 = await prisma.user.upsert({
    where: { email: 'mentor1@wecode.co.zw' },
    update: {},
    create: {
      email: 'mentor1@wecode.co.zw',
      name: 'Sarah Moyo',
      role: 'MENTOR',
      hashedPassword: communityHashedPassword,
      phone: '+263 772 111 001',
      emailVerified: true,
      credits: 500
    }
  })

  await prisma.mentorProfile.upsert({
    where: { userId: mentor1.id },
    update: {},
    create: {
      userId: mentor1.id,
      bio: 'Senior Software Engineer with 8+ years of experience in full-stack development. I specialize in React, Node.js, and cloud architecture. Passionate about helping junior developers grow their careers and build production-ready applications.',
      hourlyRate: 50,
      skills: 'React,Node.js,TypeScript,AWS,System Design,Career Coaching',
      available: true,
      verified: true,
      sessionsCount: 127
    }
  })
  console.log('   ✅ Created Mentor: Sarah Moyo (Verified, 127 sessions)')

  // Create Mentor 2 - Verified, moderate sessions
  const mentor2 = await prisma.user.upsert({
    where: { email: 'mentor2@wecode.co.zw' },
    update: {},
    create: {
      email: 'mentor2@wecode.co.zw',
      name: 'Tinashe Chigumba',
      role: 'MENTOR',
      hashedPassword: communityHashedPassword,
      phone: '+263 772 111 002',
      emailVerified: true,
      credits: 300
    }
  })

  await prisma.mentorProfile.upsert({
    where: { userId: mentor2.id },
    update: {},
    create: {
      userId: mentor2.id,
      bio: 'Data Scientist and Machine Learning Engineer. I help aspiring data professionals understand complex ML concepts and build real-world AI solutions. Former Google intern with experience in big data technologies.',
      hourlyRate: 75,
      skills: 'Python,Machine Learning,Data Science,TensorFlow,SQL,Statistics',
      available: true,
      verified: true,
      sessionsCount: 84
    }
  })
  console.log('   ✅ Created Mentor: Tinashe Chigumba (Verified, 84 sessions)')

  // Create Mentor 3 - Not verified, new mentor
  const mentor3 = await prisma.user.upsert({
    where: { email: 'mentor3@wecode.co.zw' },
    update: {},
    create: {
      email: 'mentor3@wecode.co.zw',
      name: 'Grace Dziva',
      role: 'MENTOR',
      hashedPassword: communityHashedPassword,
      phone: '+263 772 111 003',
      emailVerified: true,
      credits: 100
    }
  })

  await prisma.mentorProfile.upsert({
    where: { userId: mentor3.id },
    update: {},
    create: {
      userId: mentor3.id,
      bio: 'UI/UX Designer with a passion for creating beautiful and functional interfaces. I teach design principles, Figma, and how to bridge the gap between design and development. Self-taught designer turned professional.',
      hourlyRate: 35,
      skills: 'UI/UX Design,Figma,CSS,User Research,Prototyping',
      available: true,
      verified: false,
      sessionsCount: 12
    }
  })
  console.log('   ✅ Created Mentor: Grace Dziva (New mentor, 12 sessions)')

  // Create Community User with credits
  const communityUser = await prisma.user.upsert({
    where: { email: 'community@wecode.co.zw' },
    update: { credits: 1000 },
    create: {
      email: 'community@wecode.co.zw',
      name: 'Community Member',
      role: 'INDIVIDUAL',
      hashedPassword: communityHashedPassword,
      phone: '+263 772 111 004',
      emailVerified: true,
      credits: 1000
    }
  })
  console.log('   ✅ Created Community User with 1000 credits')

  // Create sample forum posts
  console.log('\n💬 Creating sample forum posts...')

  const post1 = await prisma.forumPost.upsert({
    where: { id: 'seed-post-1' },
    update: {},
    create: {
      id: 'seed-post-1',
      title: 'Best resources for learning React in 2024?',
      content: `Hey everyone! 👋

I'm starting my journey into React development and I'm overwhelmed by the number of resources out there. I've been coding in vanilla JavaScript for about a year now, and I feel ready to take the next step.

What resources would you recommend for someone at my level? I'm particularly interested in:
- Official documentation vs video courses
- Project-based learning
- Understanding hooks deeply

Any suggestions would be greatly appreciated! Also, if there are any mentors here who specialize in React, I'd love to hear your take on this.

Thanks in advance! 🙏`,
      authorId: communityUser.id
    }
  })

  await prisma.forumComment.upsert({
    where: { id: 'seed-comment-1' },
    update: {},
    create: {
      id: 'seed-comment-1',
      content: `Great question! I highly recommend starting with the official React documentation - it's been completely rewritten and is now interactive. The new docs at react.dev are fantastic for beginners.

For project-based learning, try building a todo app first, then move to something more complex like a weather app or a simple e-commerce site.

Feel free to book a session with me if you want personalized guidance! 🚀`,
      authorId: mentor1.id,
      postId: post1.id
    }
  })

  await prisma.forumComment.upsert({
    where: { id: 'seed-comment-2' },
    update: {},
    create: {
      id: 'seed-comment-2',
      content: `I second Sarah's recommendation! Also check out "Full Stack Open" - it's a free course from the University of Helsinki that covers React, Node.js, and GraphQL. Super comprehensive!`,
      authorId: mentor2.id,
      postId: post1.id
    }
  })

  const post2 = await prisma.forumPost.upsert({
    where: { id: 'seed-post-2' },
    update: {},
    create: {
      id: 'seed-post-2',
      title: 'Tips for transitioning from design to frontend development',
      content: `Hello fellow creators! 🎨

I've been working as a UI/UX designer for 3 years and I'm looking to transition into frontend development. I already know HTML and CSS pretty well from my design work, but JavaScript still feels intimidating.

Has anyone made this transition successfully? What was your learning path? Would love to hear your stories and any advice you might have.

Also curious about how to leverage my design background as a strength in development roles.`,
      authorId: mentor3.id
    }
  })

  await prisma.forumComment.upsert({
    where: { id: 'seed-comment-3' },
    update: {},
    create: {
      id: 'seed-comment-3',
      content: `I made this exact transition 5 years ago! Your design background is actually a HUGE advantage. You already understand user experience, which many developers struggle with.

My advice: Start with JavaScript fundamentals, then move to a framework like React. Your CSS skills will make your components look amazing from day one.

Don't be intimidated - you've already done the harder part by understanding visual hierarchy and user flows!`,
      authorId: mentor1.id,
      postId: post2.id
    }
  })

  const post3 = await prisma.forumPost.upsert({
    where: { id: 'seed-post-3' },
    update: {},
    create: {
      id: 'seed-post-3',
      title: 'How to approach system design interviews?',
      content: `I have a senior developer interview coming up that includes a system design round. I've never done one before and I'm quite nervous about it.

What topics should I focus on? How do you structure your answers? Any resources specifically for Zimbabwe's tech scene?

Would appreciate any help! 🙏`,
      authorId: communityUser.id
    }
  })

  await prisma.forumComment.upsert({
    where: { id: 'seed-comment-4' },
    update: {},
    create: {
      id: 'seed-comment-4',
      content: `System design can seem daunting but it's actually quite structured. Focus on these areas:

1. **Requirements gathering** - Always clarify functional and non-functional requirements
2. **High-level design** - Start with boxes and arrows
3. **Deep dive** - Pick one component to explain in detail
4. **Trade-offs** - Explain why you made certain choices

For resources, check out "Designing Data-Intensive Applications" and the System Design Primer on GitHub.

I offer mentorship sessions specifically for interview prep if you're interested!`,
      authorId: mentor2.id,
      postId: post3.id
    }
  })

  console.log('   ✅ Created 3 forum posts with comments')

  // Print community credentials
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🧑‍🏫 COMMUNITY & MENTORSHIP LOGIN CREDENTIALS:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('👤 MENTOR 1 (Verified - Senior):')
  console.log('   Email:    mentor1@wecode.co.zw')
  console.log(`   Password: ${communityPassword}`)
  console.log('   Name:     Sarah Moyo')
  console.log('   Rate:     50 credits/hour | Sessions: 127')
  console.log('')
  console.log('👤 MENTOR 2 (Verified - Data Science):')
  console.log('   Email:    mentor2@wecode.co.zw')
  console.log(`   Password: ${communityPassword}`)
  console.log('   Name:     Tinashe Chigumba')
  console.log('   Rate:     75 credits/hour | Sessions: 84')
  console.log('')
  console.log('👤 MENTOR 3 (New - Design):')
  console.log('   Email:    mentor3@wecode.co.zw')
  console.log(`   Password: ${communityPassword}`)
  console.log('   Name:     Grace Dziva')
  console.log('   Rate:     35 credits/hour | Sessions: 12')
  console.log('')
  console.log('👤 COMMUNITY MEMBER (Has 1000 Credits):')
  console.log('   Email:    community@wecode.co.zw')
  console.log(`   Password: ${communityPassword}`)
  console.log('   Credits:  1000')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
