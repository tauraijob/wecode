import { PDFDocument, StandardFonts, rgb, PDFPage } from 'pdf-lib'
import { Decimal } from '~~/server/utils/db'
import prisma from './db'

export interface CertificateData {
  studentName: string
  courseTitle: string
  dateOfCompletion: string
  certificateNumber: string
}

/**
 * Generate a PDF certificate for a completed course enrollment
 */
export async function generateCertificate(enrollment: any): Promise<any> {
  if (!prisma) {
    throw new Error('Database not available')
  }

  // Get certificate template
  const template = await prisma.certificateTemplate.findFirst({
    where: {
      courseId: enrollment.courseId
    }
  })

  if (!template) {
    // Create premium default template if none exists
    const defaultTemplate = await prisma.certificateTemplate.create({
      data: {
        name: 'Premium Certificate Template',
        courseId: enrollment.courseId,
        design: {
          backgroundColor: '#fcf9f2', // Cream
          textColor: '#1a3a5c', // Navy
          titleFont: 'Helvetica-Bold',
          titleSize: 36,
          bodyFont: 'Helvetica',
          bodySize: 16,
          logoUrl: null,
          borderColor: '#d9a520', // Gold
          borderWidth: 8,
          style: 'premium'
        },
        variables: {
          studentName: '$student_name$',
          courseTitle: '$course_title$',
          dateOfCompletion: '$date_of_completion$',
          certificateNumber: '$certificate_number$'
        }
      }
    })
    return generateCertificateWithTemplate(enrollment, defaultTemplate)
  }

  return generateCertificateWithTemplate(enrollment, template)
}

async function generateCertificateWithTemplate(enrollment: any, template: any) {
  // Fetch full enrollment data with user and course
  const fullEnrollment = await prisma.enrollment.findUnique({
    where: { id: enrollment.id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      course: {
        select: {
          id: true,
          name: true,
          description: true
        }
      }
    }
  })

  if (!fullEnrollment) {
    throw new Error('Enrollment not found')
  }

  const pdfDoc = await PDFDocument.create()
  // Use A4 size (595 x 842 points) for better proportions
  const page = pdfDoc.addPage([595, 842])

  // Premium color scheme
  const goldColor = rgb(0.85, 0.65, 0.13) // Gold accent
  const navyBlue = rgb(0.1, 0.23, 0.36) // #1a3a5c
  const darkGray = rgb(0.2, 0.2, 0.2)
  const lightGray = rgb(0.6, 0.6, 0.6)
  const creamColor = rgb(0.99, 0.98, 0.95) // Cream background

  // Load fonts
  const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const bodyFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique)

  // Draw cream background
  page.drawRectangle({
    x: 0,
    y: 0,
    width: page.getWidth(),
    height: page.getHeight(),
    color: creamColor
  })

  // Premium decorative border - outer gold border
  const borderWidth = 8
  const borderMargin = 40
  
  // Outer gold border
  page.drawRectangle({
    x: borderMargin,
    y: borderMargin,
    width: page.getWidth() - (borderMargin * 2),
    height: page.getHeight() - (borderMargin * 2),
    borderColor: goldColor,
    borderWidth: borderWidth
  })

  // Inner navy border
  const innerMargin = borderMargin + borderWidth + 5
  page.drawRectangle({
    x: innerMargin,
    y: innerMargin,
    width: page.getWidth() - (innerMargin * 2),
    height: page.getHeight() - (innerMargin * 2),
    borderColor: navyBlue,
    borderWidth: 3
  })

  // Decorative corner elements
  const cornerSize = 30
  const cornerThickness = 2
  
  // Top-left corner
  page.drawLine({
    start: { x: innerMargin + 20, y: innerMargin + 20 },
    end: { x: innerMargin + 20 + cornerSize, y: innerMargin + 20 },
    thickness: cornerThickness,
    color: goldColor
  })
  page.drawLine({
    start: { x: innerMargin + 20, y: innerMargin + 20 },
    end: { x: innerMargin + 20, y: innerMargin + 20 + cornerSize },
    thickness: cornerThickness,
    color: goldColor
  })

  // Top-right corner
  page.drawLine({
    start: { x: page.getWidth() - innerMargin - 20, y: innerMargin + 20 },
    end: { x: page.getWidth() - innerMargin - 20 - cornerSize, y: innerMargin + 20 },
    thickness: cornerThickness,
    color: goldColor
  })
  page.drawLine({
    start: { x: page.getWidth() - innerMargin - 20, y: innerMargin + 20 },
    end: { x: page.getWidth() - innerMargin - 20, y: innerMargin + 20 + cornerSize },
    thickness: cornerThickness,
    color: goldColor
  })

  // Bottom-left corner
  page.drawLine({
    start: { x: innerMargin + 20, y: page.getHeight() - innerMargin - 20 },
    end: { x: innerMargin + 20 + cornerSize, y: page.getHeight() - innerMargin - 20 },
    thickness: cornerThickness,
    color: goldColor
  })
  page.drawLine({
    start: { x: innerMargin + 20, y: page.getHeight() - innerMargin - 20 },
    end: { x: innerMargin + 20, y: page.getHeight() - innerMargin - 20 - cornerSize },
    thickness: cornerThickness,
    color: goldColor
  })

  // Bottom-right corner
  page.drawLine({
    start: { x: page.getWidth() - innerMargin - 20, y: page.getHeight() - innerMargin - 20 },
    end: { x: page.getWidth() - innerMargin - 20 - cornerSize, y: page.getHeight() - innerMargin - 20 },
    thickness: cornerThickness,
    color: goldColor
  })
  page.drawLine({
    start: { x: page.getWidth() - innerMargin - 20, y: page.getHeight() - innerMargin - 20 },
    end: { x: page.getWidth() - innerMargin - 20, y: page.getHeight() - innerMargin - 20 - cornerSize },
    thickness: cornerThickness,
    color: goldColor
  })

  // Decorative line under header
  const headerY = page.getHeight() - 120
  page.drawLine({
    start: { x: innerMargin + 50, y: headerY },
    end: { x: page.getWidth() - innerMargin - 50, y: headerY },
    thickness: 1,
    color: goldColor
  })

  // Certificate Title - Large and elegant
  const titleText = 'CERTIFICATE OF COMPLETION'
  const titleSize = 36
  const titleWidth = titleFont.widthOfTextAtSize(titleText, titleSize)
  page.drawText(titleText, {
    x: (page.getWidth() - titleWidth) / 2,
    y: page.getHeight() - 100,
    size: titleSize,
    font: titleFont,
    color: navyBlue
  })

  // Subtitle
  const subtitleText = 'This is to certify that'
  const subtitleSize = 14
  const subtitleWidth = italicFont.widthOfTextAtSize(subtitleText, subtitleSize)
  page.drawText(subtitleText, {
    x: (page.getWidth() - subtitleWidth) / 2,
    y: page.getHeight() - 180,
    size: subtitleSize,
    font: italicFont,
    color: darkGray
  })

  // Student Name - Prominently displayed
  const studentName = fullEnrollment.user?.name || 'Student'
  const nameSize = 28
  const nameWidth = titleFont.widthOfTextAtSize(studentName, nameSize)
  page.drawText(studentName, {
    x: (page.getWidth() - nameWidth) / 2,
    y: page.getHeight() - 240,
    size: nameSize,
    font: titleFont,
    color: navyBlue
  })

  // Decorative line under name
  page.drawLine({
    start: { x: (page.getWidth() - nameWidth) / 2 - 20, y: page.getHeight() - 260 },
    end: { x: (page.getWidth() + nameWidth) / 2 + 20, y: page.getHeight() - 260 },
    thickness: 2,
    color: goldColor
  })

  // Course completion text
  const courseTitle = fullEnrollment.course?.name || 'Course'
  const bodyText = `has successfully completed the course`
  const bodySize = 16
  const bodyWidth = bodyFont.widthOfTextAtSize(bodyText, bodySize)
  page.drawText(bodyText, {
    x: (page.getWidth() - bodyWidth) / 2,
    y: page.getHeight() - 310,
    size: bodySize,
    font: bodyFont,
    color: darkGray
  })

  // Course Title - Highlighted
  const courseSize = 20
  const courseWidth = titleFont.widthOfTextAtSize(courseTitle, courseSize)
  page.drawText(courseTitle, {
    x: (page.getWidth() - courseWidth) / 2,
    y: page.getHeight() - 350,
    size: courseSize,
    font: titleFont,
    color: navyBlue
  })

  // Date section
  const completionDate = fullEnrollment.completedAt || new Date()
  const formattedDate = completionDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
  const dateText = `Completed on ${formattedDate}`
  const dateSize = 14
  const dateWidth = bodyFont.widthOfTextAtSize(dateText, dateSize)
  page.drawText(dateText, {
    x: (page.getWidth() - dateWidth) / 2,
    y: page.getHeight() - 420,
    size: dateSize,
    font: bodyFont,
    color: darkGray
  })

  // Certificate number - smaller, at bottom
  const certNumber = `CERT-${fullEnrollment.id.substring(0, 8).toUpperCase()}-${Date.now().toString().slice(-6)}`
  const certText = `Certificate Number: ${certNumber}`
  const certSize = 10
  const certWidth = bodyFont.widthOfTextAtSize(certText, certSize)
  page.drawText(certText, {
    x: (page.getWidth() - certWidth) / 2,
    y: page.getHeight() - 500,
    size: certSize,
    font: bodyFont,
    color: lightGray
  })

  // Company branding section at bottom
  const companyY = 150
  
  // Company name
  const companyName = 'WeCodeZW'
  const companySize = 18
  const companyWidth = titleFont.widthOfTextAtSize(companyName, companySize)
  page.drawText(companyName, {
    x: (page.getWidth() - companyWidth) / 2,
    y: companyY,
    size: companySize,
    font: titleFont,
    color: navyBlue
  })

  // Company details
  const companyDetails = '194 Baines Ave, Harare | +263 778 456 168 | info@wecode.co.zw'
  const detailsSize = 9
  const detailsWidth = bodyFont.widthOfTextAtSize(companyDetails, detailsSize)
  page.drawText(companyDetails, {
    x: (page.getWidth() - detailsWidth) / 2,
    y: companyY - 25,
    size: detailsSize,
    font: bodyFont,
    color: lightGray
  })

  // Signature lines
  const signatureY = 220
  const signatureWidth = 150
  
  // Left signature (Instructor/Issuer)
  page.drawLine({
    start: { x: innerMargin + 80, y: signatureY },
    end: { x: innerMargin + 80 + signatureWidth, y: signatureY },
    thickness: 1,
    color: darkGray
  })
  page.drawText('Authorized Signature', {
    x: innerMargin + 80 + (signatureWidth / 2) - 60,
    y: signatureY - 15,
    size: 9,
    font: bodyFont,
    color: lightGray
  })

  // Right signature (Date)
  page.drawLine({
    start: { x: page.getWidth() - innerMargin - 80 - signatureWidth, y: signatureY },
    end: { x: page.getWidth() - innerMargin - 80, y: signatureY },
    thickness: 1,
    color: darkGray
  })
  page.drawText('Date', {
    x: page.getWidth() - innerMargin - 80 - (signatureWidth / 2) - 15,
    y: signatureY - 15,
    size: 9,
    font: bodyFont,
    color: lightGray
  })

  // Decorative seal/emblem area (diamond shape for elegance)
  const sealCenterX = page.getWidth() / 2
  const sealCenterY = 350
  const sealSize = 50
  
  // Draw diamond shape using lines
  const diamondPoints = [
    { x: sealCenterX, y: sealCenterY + sealSize / 2 }, // Top
    { x: sealCenterX + sealSize / 2, y: sealCenterY }, // Right
    { x: sealCenterX, y: sealCenterY - sealSize / 2 }, // Bottom
    { x: sealCenterX - sealSize / 2, y: sealCenterY }  // Left
  ]
  
  // Outer diamond
  page.drawLine({
    start: diamondPoints[0],
    end: diamondPoints[1],
    thickness: 2,
    color: goldColor
  })
  page.drawLine({
    start: diamondPoints[1],
    end: diamondPoints[2],
    thickness: 2,
    color: goldColor
  })
  page.drawLine({
    start: diamondPoints[2],
    end: diamondPoints[3],
    thickness: 2,
    color: goldColor
  })
  page.drawLine({
    start: diamondPoints[3],
    end: diamondPoints[0],
    thickness: 2,
    color: goldColor
  })
  
  // Inner diamond
  const innerSize = sealSize - 15
  const innerDiamondPoints = [
    { x: sealCenterX, y: sealCenterY + innerSize / 2 },
    { x: sealCenterX + innerSize / 2, y: sealCenterY },
    { x: sealCenterX, y: sealCenterY - innerSize / 2 },
    { x: sealCenterX - innerSize / 2, y: sealCenterY }
  ]
  
  page.drawLine({
    start: innerDiamondPoints[0],
    end: innerDiamondPoints[1],
    thickness: 1,
    color: navyBlue
  })
  page.drawLine({
    start: innerDiamondPoints[1],
    end: innerDiamondPoints[2],
    thickness: 1,
    color: navyBlue
  })
  page.drawLine({
    start: innerDiamondPoints[2],
    end: innerDiamondPoints[3],
    thickness: 1,
    color: navyBlue
  })
  page.drawLine({
    start: innerDiamondPoints[3],
    end: innerDiamondPoints[0],
    thickness: 1,
    color: navyBlue
  })

  // Seal text
  const sealText = 'SEAL'
  const sealTextSize = 9
  const sealTextWidth = titleFont.widthOfTextAtSize(sealText, sealTextSize)
  page.drawText(sealText, {
    x: sealCenterX - (sealTextWidth / 2),
    y: sealCenterY - 4,
    size: sealTextSize,
    font: titleFont,
    color: navyBlue
  })

  // Save PDF
  const pdfBytes = await pdfDoc.save()

  // Save certificate record
  const certificate = await prisma.certificate.create({
    data: {
      enrollmentId: fullEnrollment.id,
      userId: fullEnrollment.userId,
      courseId: fullEnrollment.courseId,
      templateId: template.id,
      certificateNumber: certNumber,
      pdfUrl: null // In production, upload to storage and save URL
    }
  })

  return {
    certificate,
    pdfBytes: Buffer.from(pdfBytes).toString('base64'),
    certificateNumber: certNumber
  }
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255
      }
    : { r: 0, g: 0, b: 0 }
}

