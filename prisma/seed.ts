import { PrismaClient, Prisma } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create admin user for E-LEARNING PLATFORM (different from general website)
  const adminEmail = 'elearning-admin@wecode.co.zw'
  const adminPassword = 'ElearningAdmin@2024'
  
  const hashedPassword = await bcrypt.hash(adminPassword, 10)

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'E-Learning Admin',
      role: 'ADMIN',
      hashedPassword: hashedPassword,
      phone: '+263 778 456 168'
    }
  })

  console.log('✅ E-Learning Admin user created:', {
    email: adminUser.email,
    name: adminUser.name,
    role: adminUser.role
  })

  // Create a regular user for courses (E-LEARNING PLATFORM)
  const userEmail = 'elearning-student@wecode.co.zw'
  const userPassword = 'ElearningStudent@2024'
  
  const userHashedPassword = await bcrypt.hash(userPassword, 10)

  const regularUser = await prisma.user.upsert({
    where: { email: userEmail },
    update: {},
    create: {
      email: userEmail,
      name: 'E-Learning Student',
      role: 'STUDENT',
      hashedPassword: userHashedPassword,
      phone: '+263 777 123 456'
    }
  })

  console.log('✅ E-Learning Student user created:', {
    email: regularUser.email,
    name: regularUser.name,
    role: regularUser.role
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
  console.log('   Email:    elearning-admin@wecode.co.zw')
  console.log('   Password: ElearningAdmin@2024')
  console.log('   Role:     ADMIN')
  console.log('   Access:   Full admin dashboard, course management')
  console.log('   Note:     Different from general website admin')
  console.log('')
  console.log('👤 E-LEARNING STUDENT ACCOUNT:')
  console.log('   Email:    elearning-student@wecode.co.zw')
  console.log('   Password: ElearningStudent@2024')
  console.log('   Role:     STUDENT')
  console.log('   Access:   Course catalog, enrollment, learning progress')
  console.log('   Note:     Different from general website user')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('\n📚 Created Courses:')
  console.log('   1. Introduction to Web Development - $99.99')
  console.log('   2. Advanced React Development - $149.99')
  console.log('   3. Python for Data Science - $129.99')
  console.log('\n💡 You can now login and explore the courses!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
