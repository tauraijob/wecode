import prismaModule, { Decimal } from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'
import { Paynow } from 'paynow'
import { notifyAdmins, createNotification } from '~~/server/utils/notifications'

export default defineEventHandler(async (event) => {
  const prisma = await prismaModule
  if (!prisma) {
    throw createError({ statusCode: 503, statusMessage: 'Database not available' })
  }

  const token = getCookie(event, 'token')
  const auth = token ? verifyJwt(token) : null
  if (!auth) {
    throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
  }

  const courseId = getRouterParam(event, 'id')
  if (!courseId) {
    throw createError({ statusCode: 400, statusMessage: 'Course ID required' })
  }

  // Check if already enrolled (only count active/completed enrollments, not pending or cancelled)
  const existing = await prisma.enrollment.findFirst({
    where: {
      userId: auth.userId,
      courseId,
      status: {
        in: ['ACTIVE', 'COMPLETED']
      }
    }
  })

  if (existing) {
    throw createError({ statusCode: 409, statusMessage: 'Already enrolled in this course' })
  }
  
  // Get course details
  const course = await prisma.course.findUnique({
    where: { id: courseId }
  })

  if (!course) {
    throw createError({ statusCode: 404, statusMessage: 'Course not found' })
  }

  if (course.status !== 'PUBLISHED') {
    throw createError({ statusCode: 400, statusMessage: 'Course is not available for enrollment' })
  }

  // Check if there's an existing enrollment (cancelled or pending) that we should update
  const existingEnrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: auth.userId,
        courseId
      }
    }
  })

  // Determine initial enrollment status based on course price
  // Free courses (price = 0) are activated immediately, paid courses are PENDING until payment
  const isFreeCourse = Number(course.price) === 0
  const initialStatus = isFreeCourse ? 'ACTIVE' : 'PENDING'

  let invoice
  let enrollment

  // If there's an existing enrollment (cancelled or pending), update it
  if (existingEnrollment && (existingEnrollment.status === 'CANCELLED' || existingEnrollment.status === 'PENDING')) {
    // Check if there's an existing unpaid invoice for this enrollment
    if (existingEnrollment.invoiceId) {
      const existingInvoice = await prisma.invoice.findUnique({
        where: { id: existingEnrollment.invoiceId }
      })
      
      // Use existing invoice if it's not paid, otherwise create a new one
      if (existingInvoice && existingInvoice.status !== 'PAID') {
        invoice = existingInvoice
      } else {
        // Create new invoice for payment
        const invoiceNumber = `COURSE-${Date.now()}`
        invoice = await prisma.invoice.create({
          data: {
            number: invoiceNumber,
            currency: course.currency || 'USD',
            amountUsd: new Decimal(Number(course.price).toFixed(2)),
            status: 'SENT',
            userId: auth.userId
          }
        })
      }
    } else {
      // Create new invoice for payment
      const invoiceNumber = `COURSE-${Date.now()}`
      invoice = await prisma.invoice.create({
        data: {
          number: invoiceNumber,
          currency: course.currency || 'USD',
          amountUsd: new Decimal(Number(course.price).toFixed(2)),
          status: 'SENT',
          userId: auth.userId
        }
      })
    }

    enrollment = await prisma.enrollment.update({
      where: { id: existingEnrollment.id },
      data: {
        invoiceId: invoice.id,
        status: initialStatus,
        enrolledAt: new Date(), // Reset enrollment date
        progressPercent: new Decimal(0), // Reset progress
        completedAt: null
      },
      include: {
        course: {
          select: {
            id: true,
            name: true,
            price: true,
            currency: true
          }
        }
      }
    })
  } else {
    // Create new invoice for payment
    const invoiceNumber = `COURSE-${Date.now()}`
    console.log('Creating invoice:', { invoiceNumber, userId: auth.userId, amount: course.price, currency: course.currency })
    
    invoice = await prisma.invoice.create({
      data: {
        number: invoiceNumber,
        currency: course.currency || 'USD',
        amountUsd: new Decimal(Number(course.price).toFixed(2)),
        status: 'SENT',
        userId: auth.userId
      }
    })
    
    console.log('Invoice created:', { id: invoice.id, number: invoice.number, userId: invoice.userId })
    
    // Immediately verify the invoice exists and is queryable
    const verifiedInvoice = await prisma.invoice.findUnique({
      where: { number: invoice.number },
      select: { id: true, number: true, userId: true }
    })
    
    if (!verifiedInvoice) {
      console.error('Invoice not found immediately after creation!', { invoiceNumber: invoice.number, invoiceId: invoice.id })
      // Retry after a brief moment
      await new Promise(resolve => setTimeout(resolve, 100))
      const retryInvoice = await prisma.invoice.findUnique({
        where: { number: invoice.number },
        select: { id: true, number: true, userId: true }
      })
      if (!retryInvoice) {
        throw createError({ statusCode: 500, statusMessage: 'Invoice was created but could not be verified. Please try again.' })
      }
      console.log('Invoice verified on retry:', retryInvoice)
    } else {
      console.log('Invoice verified immediately:', verifiedInvoice)
    }

    // Create new enrollment (linked to invoice, will be activated after payment for paid courses)
    enrollment = await prisma.enrollment.create({
      data: {
        userId: auth.userId,
        courseId,
        invoiceId: invoice.id,
        status: initialStatus // PENDING for paid courses, ACTIVE for free courses
      },
      include: {
        course: {
          select: {
            id: true,
            name: true,
            price: true,
            currency: true
          }
        }
      }
    })
  }

  // For free courses, mark invoice as paid immediately
  if (isFreeCourse) {
    await prisma.invoice.update({
      where: { id: invoice.id },
      data: { status: 'PAID' }
    })
  }

  // Verify invoice was created successfully
  if (!invoice || !invoice.number) {
    console.error('Invoice creation failed', { invoice, courseId, userId: auth.userId })
    throw createError({ statusCode: 500, statusMessage: 'Failed to create invoice. Please try again.' })
  }

  // Re-fetch invoice to ensure it's fully committed to database
  const verifiedInvoice = await prisma.invoice.findUnique({
    where: { id: invoice.id },
    select: { id: true, number: true, userId: true }
  })

  if (!verifiedInvoice) {
    console.error('Invoice not found after creation', { invoiceId: invoice.id, invoiceNumber: invoice.number })
    throw createError({ statusCode: 500, statusMessage: 'Invoice was created but could not be verified. Please try again.' })
  }

  // Also verify by number to ensure it's queryable
  const invoiceByNumber = await prisma.invoice.findUnique({
    where: { number: verifiedInvoice.number },
    select: { id: true, number: true, userId: true }
  })

  if (!invoiceByNumber) {
    console.error('Invoice not found by number after creation', { invoiceNumber: verifiedInvoice.number })
    throw createError({ statusCode: 500, statusMessage: 'Invoice was created but could not be found by number. Please try again.' })
  }

  console.log('Invoice created and verified successfully:', {
    id: verifiedInvoice.id,
    number: verifiedInvoice.number,
    userId: verifiedInvoice.userId
  })

  // Get user info for notifications (fetch early for free courses, or later for paid)
  let user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: { email: true, name: true }
  })

  // Notify admins about new enrollment
  await notifyAdmins({
    type: 'ENROLLMENT_CREATED',
    title: 'New Course Enrollment',
    message: `${user?.name || 'A user'} has enrolled in course "${course.name}".`,
    metadata: { 
      enrollmentId: enrollment.id, 
      courseId: course.id, 
      courseName: course.name,
      userId: auth.userId,
      userName: user?.name,
      isFreeCourse
    }
  })

  // Notify instructor if course has one
  if (course.instructorId) {
    await createNotification({
      userId: course.instructorId,
      type: 'ENROLLMENT_CREATED',
      title: 'New Student Enrollment',
      message: `${user?.name || 'A student'} has enrolled in your course "${course.name}".`,
      metadata: { 
        enrollmentId: enrollment.id, 
        courseId: course.id, 
        courseName: course.name,
        userId: auth.userId
      }
    })
  }

  // Notify user about enrollment
  await createNotification({
    userId: auth.userId,
    type: 'ENROLLMENT_CREATED',
    title: isFreeCourse ? 'Enrollment Successful' : 'Enrollment Pending Payment',
    message: isFreeCourse 
      ? `You have successfully enrolled in "${course.name}". Start learning now!`
      : `You have enrolled in "${course.name}". Please complete payment to access the course.`,
    metadata: { 
      enrollmentId: enrollment.id, 
      courseId: course.id, 
      courseName: course.name,
      invoiceId: verifiedInvoice.id,
      invoiceNumber: verifiedInvoice.number
    }
  })

  // Notify admins about invoice creation
  await notifyAdmins({
    type: 'INVOICE_CREATED',
    title: 'New Invoice Created',
    message: `Invoice ${verifiedInvoice.number} created for ${user?.name || 'a user'} - ${course.name} (${Number(course.price).toFixed(2)} ${course.currency || 'USD'}).`,
    metadata: { 
      invoiceId: verifiedInvoice.id, 
      invoiceNumber: verifiedInvoice.number,
      courseId: course.id,
      courseName: course.name,
      userId: auth.userId,
      amount: Number(course.price),
      currency: course.currency || 'USD'
    }
  })

  // For free courses, return success immediately
  if (isFreeCourse) {
    return {
      enrollment,
      invoice: {
        id: verifiedInvoice.id,
        number: verifiedInvoice.number,
        amount: course.price,
        currency: course.currency || 'USD'
      },
      redirectUrl: null // No payment needed
    }
  }

  // For paid courses, initiate Paynow payment immediately
  const integrationId = process.env.PAYNOW_INTEGRATION_ID
  const integrationKey = process.env.PAYNOW_INTEGRATION_KEY
  
  // Determine site URL - prioritize SITE_URL env var, then check if we're in development
  // Default to production domain (wecode.co.zw) for safety
  const isDevelopment = process.env.NODE_ENV === 'development'
  let siteUrl = process.env.SITE_URL
  
  // If SITE_URL is not set, determine based on environment
  if (!siteUrl) {
    // Only use localhost if explicitly in development mode
    siteUrl = isDevelopment ? 'http://localhost:3000' : 'https://wecode.co.zw'
  }
  
  // CRITICAL: In production, NEVER allow localhost URLs (even if SITE_URL is incorrectly set)
  if (!isDevelopment && siteUrl.includes('localhost')) {
    console.warn(`Warning: SITE_URL contains localhost in production. Forcing https://wecode.co.zw`)
    siteUrl = 'https://wecode.co.zw'
  }
  
  // Ensure URL has protocol
  if (!siteUrl.startsWith('http://') && !siteUrl.startsWith('https://')) {
    // Default to https for production domains, http for localhost
    siteUrl = siteUrl.includes('localhost') ? `http://${siteUrl}` : `https://${siteUrl}`
  }
  
  // Force production domain if not localhost (safety check)
  if (!isDevelopment && !siteUrl.includes('localhost') && !siteUrl.includes('wecode.co.zw')) {
    console.warn(`Warning: SITE_URL (${siteUrl}) doesn't match production domain. Using https://wecode.co.zw`)
    siteUrl = 'https://wecode.co.zw'
  }

  if (!integrationId || !integrationKey) {
    // If Paynow not configured, return invoice info (fallback to manual payment)
    return {
      enrollment,
      invoice: {
        id: verifiedInvoice.id,
        number: verifiedInvoice.number,
        amount: course.price,
        currency: course.currency || 'USD'
      },
      redirectUrl: null
    }
  }

  try {
    // User info already fetched above, just get email if needed
    if (!user) {
      user = await prisma.user.findUnique({
        where: { id: auth.userId },
        select: { email: true, name: true }
      })
    }

    // Ensure URLs are properly formatted (remove trailing slashes)
    const resultUrl = `${siteUrl.replace(/\/$/, '')}/api/paynow/result`
    const returnUrl = `${siteUrl.replace(/\/$/, '')}/dashboard/learn` // Redirect to "My Courses" page after payment
    
    // Log for debugging
    console.log('PayNow Configuration:', {
      SITE_URL: process.env.SITE_URL,
      NODE_ENV: process.env.NODE_ENV,
      computedSiteUrl: siteUrl,
      resultUrl,
      returnUrl
    })

    // In production, use the user's email. In test mode, Paynow requires the email 
    // to match the merchant's registered email, so use PAYNOW_TEST_EMAIL if set
    // For live payments, always use the user's actual email
    const paymentEmail = process.env.PAYNOW_TEST_EMAIL || user?.email || 'info@wecode.co.zw'

    // Paynow constructor requires resultUrl and returnUrl as parameters
    const paynow = new Paynow(integrationId, integrationKey, resultUrl, returnUrl)
    const payment = paynow.createPayment(verifiedInvoice.number, paymentEmail)
    payment.add(course.name, Number(course.price))

    const response = await paynow.send(payment)
    
    if (response.success && response.redirectUrl) {
      console.log('Paynow payment initiated successfully:', { redirectUrl: response.redirectUrl })
      return {
        enrollment,
        invoice: {
          id: verifiedInvoice.id,
          number: verifiedInvoice.number,
          amount: course.price,
          currency: course.currency || 'USD'
        },
        redirectUrl: response.redirectUrl // Redirect to Paynow payment page
      }
    } else {
      console.error('Paynow payment initiation failed:', response)
      const errorMessage = response.error || 'Payment initiation failed'
      
      // Check if it's the test email error
      if (errorMessage.includes('authemail') || errorMessage.includes('registered email')) {
        console.error('Paynow test mode email error. Please set PAYNOW_TEST_EMAIL in .env file to match your merchant registered email.')
        throw createError({ 
          statusCode: 400, 
          statusMessage: 'Paynow test mode requires PAYNOW_TEST_EMAIL to be set in .env file. Please check your Paynow dashboard for the registered email address and add it to your .env file as PAYNOW_TEST_EMAIL=your-email@example.com' 
        })
      }
      
      // Return invoice info as fallback for other errors
      return {
        enrollment,
        invoice: {
          id: verifiedInvoice.id,
          number: verifiedInvoice.number,
          amount: course.price,
          currency: course.currency || 'USD'
        },
        redirectUrl: null
      }
    }
  } catch (error: any) {
    console.error('Error initiating Paynow payment:', error)
    
    // If it's already a createError, re-throw it
    if (error.statusCode) {
      throw error
    }
    
    // Return invoice info as fallback for other errors
    return {
      enrollment,
      invoice: {
        id: verifiedInvoice.id,
        number: verifiedInvoice.number,
        amount: course.price,
        currency: course.currency || 'USD'
      },
      redirectUrl: null
    }
  }
})

