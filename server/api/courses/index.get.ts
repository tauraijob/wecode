import prismaModule from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  // Await the Prisma instance (it's a proxy that may need initialization)
  const prisma = await prismaModule
  if (!prisma) {
    throw createError({ statusCode: 503, statusMessage: 'Database not available' })
  }

  const query = getQuery(event)
  const status = query.status as string | undefined
  const userId = query.userId as string | undefined
  const search = query.search as string | undefined
  const category = query.category as string | undefined
  const instructor = query.instructor as string | undefined
  const minPrice = query.minPrice ? parseFloat(query.minPrice as string) : undefined
  const maxPrice = query.maxPrice ? parseFloat(query.maxPrice as string) : undefined
  const minRating = query.minRating ? parseFloat(query.minRating as string) : undefined
  const sortBy = query.sortBy as string | undefined || 'newest'
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 12
  const skip = (page - 1) * limit

  // Check if user is authenticated (optional for public catalog)
  const token = getCookie(event, 'token')
  const auth = token ? verifyJwt(token) : null

  const where: any = {}
  if (status) {
    where.status = status
  } else {
    // Public endpoint shows only published courses
    where.status = 'PUBLISHED'
  }

  // Search filter
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ]
  }

  // Category filter (when categories are implemented)
  // if (category) {
  //   where.categoryId = category
  // }

  // Instructor filter
  if (instructor) {
    where.instructorId = instructor
  }

  // Price range filter
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {}
    if (minPrice !== undefined) {
      where.price.gte = minPrice
    }
    if (maxPrice !== undefined) {
      where.price.lte = maxPrice
    }
  }

  // Build orderBy clause
  let orderBy: any = { createdAt: 'desc' }
  if (sortBy === 'oldest') {
    orderBy = { createdAt: 'asc' }
  } else if (sortBy === 'name') {
    orderBy = { name: 'asc' }
  } else if (sortBy === 'price_asc') {
    orderBy = { price: 'asc' }
  } else if (sortBy === 'price_desc') {
    orderBy = { price: 'desc' }
  } else if (sortBy === 'enrollments') {
    orderBy = { enrollments: { _count: 'desc' } }
  }

  // Get total count for pagination
  const total = await prisma.course.count({ where })

  const courses = await prisma.course.findMany({
    where,
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      topics: {
        include: {
          lessons: {
            select: {
              id: true,
              title: true,
              order: true,
              videoDuration: true
            },
            orderBy: { order: 'asc' }
          }
        },
        orderBy: { order: 'asc' }
      },
      _count: {
        select: {
          enrollments: true,
          ratings: true
        }
      },
      ratings: {
        select: {
          rating: true
        }
      }
    },
    orderBy,
    skip,
    take: limit
  })

  // Calculate average rating for each course
  const coursesWithRatings = courses.map(course => {
    const ratings = course.ratings || []
    const avgRating = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0
    
    const { ratings: _, ...courseWithoutRatings } = course
    
    return {
      ...courseWithoutRatings,
      averageRating: Number(avgRating.toFixed(2)),
      totalRatings: course._count.ratings
    }
  })

  // Filter by minimum rating if specified
  let filteredCourses = coursesWithRatings
  if (minRating !== undefined) {
    filteredCourses = coursesWithRatings.filter(course => course.averageRating >= minRating)
  }

  // If userId is provided, include enrollment status
  if (userId && auth?.userId === userId) {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      select: { courseId: true, status: true, progressPercent: true }
    })
    const enrollmentMap = new Map(enrollments.map(e => [e.courseId, e]))
    
    const coursesWithEnrollment = filteredCourses.map(course => ({
      ...course,
      enrollment: enrollmentMap.get(course.id) || null
    }))

    return {
      courses: coursesWithEnrollment,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  return {
    courses: filteredCourses,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }
})

