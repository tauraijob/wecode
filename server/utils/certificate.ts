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
    // Create default template if none exists
    const defaultTemplate = await prisma.certificateTemplate.create({
      data: {
        name: 'Default Certificate',
        courseId: enrollment.courseId,
        design: {
          backgroundColor: '#ffffff',
          textColor: '#000000',
          titleFont: 'Helvetica-Bold',
          titleSize: 24,
          bodyFont: 'Helvetica',
          bodySize: 14,
          logoUrl: null,
          borderColor: '#1a3a5c',
          borderWidth: 3
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
          name: true
        }
      }
    }
  })

  if (!fullEnrollment) {
    throw new Error('Enrollment not found')
  }

  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([612, 792]) // Letter size

  const design = template.design as any
  const variables = template.variables as any

  // Set background color
  if (design.backgroundColor) {
    page.drawRectangle({
      x: 0,
      y: 0,
      width: page.getWidth(),
      height: page.getHeight(),
      color: rgb(
        hexToRgb(design.backgroundColor).r,
        hexToRgb(design.backgroundColor).g,
        hexToRgb(design.backgroundColor).b
      )
    })
  }

  // Load fonts
  const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const bodyFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

  // Draw border if specified
  if (design.borderColor && design.borderWidth) {
    const borderColor = hexToRgb(design.borderColor)
    page.drawRectangle({
      x: design.borderWidth,
      y: design.borderWidth,
      width: page.getWidth() - (design.borderWidth * 2),
      height: page.getHeight() - (design.borderWidth * 2),
      borderColor: rgb(borderColor.r, borderColor.g, borderColor.b),
      borderWidth: design.borderWidth
    })
  }

  // Certificate title
  const titleText = 'Certificate of Completion'
  const titleSize = design.titleSize || 24
  const titleWidth = titleFont.widthOfTextAtSize(titleText, titleSize)
  page.drawText(titleText, {
    x: (page.getWidth() - titleWidth) / 2,
    y: page.getHeight() - 100,
    size: titleSize,
    font: titleFont,
    color: rgb(0.13, 0.24, 0.43)
  })

  // Certificate body
  const bodySize = design.bodySize || 14
  const bodyY = page.getHeight() - 200

  // Student name
  const studentName = fullEnrollment.user?.name || 'Student'
  const nameText = `This is to certify that ${studentName}`
  const nameWidth = bodyFont.widthOfTextAtSize(nameText, bodySize)
  page.drawText(nameText, {
    x: (page.getWidth() - nameWidth) / 2,
    y: bodyY,
    size: bodySize,
    font: bodyFont
  })

  // Course title
  const courseTitle = fullEnrollment.course?.name || 'Course'
  const courseText = `has successfully completed the course: ${courseTitle}`
  const courseWidth = bodyFont.widthOfTextAtSize(courseText, bodySize)
  page.drawText(courseText, {
    x: (page.getWidth() - courseWidth) / 2,
    y: bodyY - 40,
    size: bodySize,
    font: bodyFont
  })

  // Date
  const completionDate = fullEnrollment.completedAt || new Date()
  const dateText = `Date of Completion: ${completionDate.toLocaleDateString()}`
  const dateWidth = bodyFont.widthOfTextAtSize(dateText, bodySize)
  page.drawText(dateText, {
    x: (page.getWidth() - dateWidth) / 2,
    y: bodyY - 80,
    size: bodySize,
    font: bodyFont
  })

  // Certificate number
  const certNumber = `CERT-${Date.now()}`
  const certText = `Certificate Number: ${certNumber}`
  const certWidth = bodyFont.widthOfTextAtSize(certText, bodySize - 2)
  page.drawText(certText, {
    x: (page.getWidth() - certWidth) / 2,
    y: bodyY - 120,
    size: bodySize - 2,
    font: bodyFont,
    color: rgb(0.5, 0.5, 0.5)
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

