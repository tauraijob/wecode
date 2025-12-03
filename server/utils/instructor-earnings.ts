import prismaModule, { Decimal } from '~~/server/utils/db'

/**
 * Create instructor earning when enrollment payment is successful
 */
export async function createInstructorEarning(enrollmentId: string) {
  const prisma = await prismaModule
  if (!prisma) {
    throw new Error('Database not available')
  }

  // Get enrollment with course and instructor
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      course: {
        include: {
          instructor: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      },
      invoice: {
        select: {
          amountUsd: true,
          currency: true
        }
      }
    }
  })

  if (!enrollment) {
    throw new Error('Enrollment not found')
  }

  // Check if course has an instructor
  if (!enrollment.course.instructorId || !enrollment.course.instructor) {
    console.log('Course has no instructor, skipping earning creation', { courseId: enrollment.courseId })
    return null
  }

  // Check if earning already exists
  const existingEarning = await prisma.instructorEarning.findUnique({
    where: { enrollmentId }
  })

  if (existingEarning) {
    console.log('Earning already exists for this enrollment', { enrollmentId, earningId: existingEarning.id })
    return existingEarning
  }

  // Calculate instructor's share
  // Platform commission is stored as percentage (e.g., 30 means 30%)
  const platformCommission = Number(enrollment.course.platformCommissionPercentage) || 30
  const instructorShare = 100 - platformCommission // e.g., 70% for instructor

  const coursePrice = Number(enrollment.course.price)
  const instructorAmount = (coursePrice * instructorShare) / 100

  // Create earning record
  const earning = await prisma.instructorEarning.create({
    data: {
      amount: new Decimal(instructorAmount.toFixed(2)),
      currency: enrollment.course.currency || 'USD',
      commissionRate: new Decimal(instructorShare.toFixed(2)),
      status: 'PENDING',
      enrollmentId: enrollment.id,
      courseId: enrollment.courseId,
      instructorId: enrollment.course.instructorId
    },
    include: {
      course: {
        select: {
          name: true
        }
      },
      instructor: {
        select: {
          name: true,
          email: true
        }
      }
    }
  })

  console.log('Instructor earning created:', {
    earningId: earning.id,
    instructorId: earning.instructorId,
    amount: instructorAmount,
    courseName: earning.course.name
  })

  return earning
}

/**
 * Get instructor earnings summary
 */
export async function getInstructorEarningsSummary(instructorId: string) {
  const prisma = await prismaModule
  if (!prisma) {
    throw new Error('Database not available')
  }

  // Get earnings aggregates
  const [totalEarnings, pendingEarnings, paidEarnings] = await Promise.all([
    prisma.instructorEarning.aggregate({
      where: { instructorId },
      _sum: { amount: true },
      _count: true
    }),
    prisma.instructorEarning.aggregate({
      where: { 
        instructorId,
        status: 'PENDING'
      },
      _sum: { amount: true },
      _count: true
    }),
    prisma.instructorEarning.aggregate({
      where: { 
        instructorId,
        status: 'PAID'
      },
      _sum: { amount: true },
      _count: true
    })
  ])

  // Get payouts aggregate separately (to avoid esbuild parsing issues)
  const totalPayouts = await prisma.payout.aggregate({
    where: { instructorId },
    _sum: { amount: true }
  })

  const totalEarned = totalEarnings._sum.amount ? Number(totalEarnings._sum.amount) : 0
  const pendingAmount = pendingEarnings._sum.amount ? Number(pendingEarnings._sum.amount) : 0
  const paidAmount = paidEarnings._sum.amount ? Number(paidEarnings._sum.amount) : 0
  const totalPayoutAmount = totalPayouts._sum.amount ? Number(totalPayouts._sum.amount) : 0
  const availableForPayout = pendingAmount

  return {
    totalEarned,
    pendingAmount,
    paidAmount,
    totalPayoutAmount,
    availableForPayout,
    totalEarnings: totalEarnings._count,
    pendingCount: pendingEarnings._count,
    paidCount: paidEarnings._count
  }
}
