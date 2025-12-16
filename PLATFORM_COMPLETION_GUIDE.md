# Platform Completion Implementation Guide

This document provides a comprehensive roadmap for implementing all remaining features to complete the WeCodeZW e-learning platform.

## Table of Contents

1. [High Priority Features](#high-priority-features)
2. [Medium Priority Features](#medium-priority-features)
3. [Nice to Have Features](#nice-to-have-features)
4. [Implementation Order](#implementation-order)

---

## High Priority Features

### 1. Password Reset Functionality

**Description:** Allow users to reset their password via email if forgotten.

**Database Schema Changes:**
```prisma
// No new models needed - reuse MagicLink model
// Add passwordResetToken field or use existing MagicLink with type field
```

**API Endpoints to Create:**
- `POST /api/auth/forgot-password` - Request password reset
- `GET /api/auth/reset-password?token=xxx` - Verify reset token
- `POST /api/auth/reset-password` - Submit new password

**Frontend Pages/Components:**
- `pages/auth/forgot-password.vue` - Request reset form
- `pages/auth/reset-password.vue` - New password form

**Implementation Steps:**
1. Create forgot password API endpoint that:
   - Validates email exists
   - Creates MagicLink with type='PASSWORD_RESET'
   - Sends email with reset link
2. Create reset password verification endpoint
3. Create reset password submission endpoint
4. Build forgot password page
5. Build reset password page
6. Add "Forgot Password?" link to login page

**Files to Create/Modify:**
- `server/api/auth/forgot-password.post.ts` (NEW)
- `server/api/auth/reset-password.post.ts` (NEW)
- `server/api/auth/reset-password.get.ts` (NEW)
- `pages/auth/forgot-password.vue` (NEW)
- `pages/auth/reset-password.vue` (NEW)
- `pages/auth/login.vue` (MODIFY - add forgot password link)

---

### 2. Student Course Reviews and Ratings

**Description:** Allow students to rate and review courses after enrollment.

**Database Schema Changes:**
```prisma
model CourseRating {
  id          String   @id @default(cuid())
  rating      Int      // 1-5 stars
  review      String?  @db.Text
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId String
  course Course @relation(fields: [courseId], references: [id], onDelete: Cascade)
  courseId String

  @@unique([userId, courseId])
}

// Update Course model
model Course {
  // ... existing fields
  ratings CourseRating[]
  
  // Add computed fields (via API):
  // averageRating: Decimal
  // totalRatings: Int
}
```

**API Endpoints to Create:**
- `POST /api/courses/[id]/rating` - Submit rating/review
- `GET /api/courses/[id]/ratings` - Get all ratings for a course
- `PUT /api/courses/[id]/rating` - Update own rating
- `DELETE /api/courses/[id]/rating` - Delete own rating

**Frontend Pages/Components:**
- `components/courses/RatingStars.vue` - Star rating component
- `components/courses/CourseReviews.vue` - Reviews list component
- `components/courses/ReviewForm.vue` - Submit review form
- Update `pages/courses/[id].vue` - Add ratings section
- Update `pages/courses/index.vue` - Show average rating on cards

**Implementation Steps:**
1. Run Prisma migration to add CourseRating model
2. Create rating submission API
3. Create ratings retrieval API
4. Build star rating component
5. Build reviews display component
6. Build review form component
7. Integrate into course detail page
8. Add average rating to course cards
9. Add rating filter to course catalog

**Files to Create/Modify:**
- `prisma/schema.prisma` (MODIFY)
- `server/api/courses/[id]/rating.post.ts` (NEW)
- `server/api/courses/[id]/rating.put.ts` (NEW)
- `server/api/courses/[id]/rating.delete.ts` (NEW)
- `server/api/courses/[id]/ratings.get.ts` (NEW)
- `components/courses/RatingStars.vue` (NEW)
- `components/courses/CourseReviews.vue` (NEW)
- `components/courses/ReviewForm.vue` (NEW)
- `pages/courses/[id].vue` (MODIFY)
- `pages/courses/index.vue` (MODIFY)
- `server/api/courses/index.get.ts` (MODIFY - include avg rating)

---

### 3. Instructor Earnings and Payouts

**Description:** Track instructor earnings and manage payouts.

**Database Schema Changes:**
```prisma
model InstructorEarning {
  id              String   @id @default(cuid())
  amount          Decimal  @db.Decimal(10, 2)
  currency        String   @default("USD")
  commissionRate Decimal   @db.Decimal(5, 2) // Instructor's percentage
  status          String   @default("PENDING") // PENDING, PAID, CANCELLED
  earnedAt        DateTime @default(now())
  paidAt          DateTime?
  
  enrollment Enrollment @relation(fields: [enrollmentId], references: [id])
  enrollmentId String
  course      Course    @relation(fields: [courseId], references: [id])
  courseId    String
  instructor  User      @relation(fields: [instructorId], references: [id])
  instructorId String
  payout      Payout?   @relation(fields: [payoutId], references: [id])
  payoutId    String?
}

model Payout {
  id          String   @id @default(cuid())
  amount      Decimal  @db.Decimal(10, 2)
  currency    String   @default("USD")
  status      String   @default("PENDING") // PENDING, PROCESSING, COMPLETED, FAILED
  requestedAt DateTime @default(now())
  processedAt DateTime?
  method      String?  // BANK_TRANSFER, PAYPAL, etc.
  reference   String?  // Transaction reference
  
  instructor User              @relation(fields: [instructorId], references: [id])
  instructorId String
  earnings   InstructorEarning[]
}

// Update User model
model User {
  // ... existing fields
  instructorEarnings InstructorEarning[]
  payouts            Payout[]
}

// Update Enrollment model
model Enrollment {
  // ... existing fields
  instructorEarning InstructorEarning?
}
```

**API Endpoints to Create:**
- `GET /api/instructor/earnings` - Get instructor earnings summary
- `GET /api/instructor/earnings/history` - Get earnings history
- `POST /api/instructor/payouts/request` - Request payout
- `GET /api/instructor/payouts` - Get payout history
- `GET /api/admin/instructor-earnings` - Admin view all instructor earnings
- `POST /api/admin/payouts/[id]/process` - Process payout
- `POST /api/admin/payouts/[id]/complete` - Mark payout as completed

**Frontend Pages/Components:**
- `pages/instructor/earnings.vue` - Earnings dashboard
- `pages/instructor/payouts.vue` - Payout requests
- `pages/admin/instructors/earnings.vue` - Admin earnings view
- `pages/admin/instructors/payouts.vue` - Admin payout management

**Implementation Steps:**
1. Run Prisma migration for new models
2. Update enrollment creation to calculate and create InstructorEarning
3. Create instructor earnings API endpoints
4. Create payout request API
5. Create admin payout management APIs
6. Build instructor earnings dashboard
7. Build payout request interface
8. Build admin payout management interface
9. Add earnings calculation on payment webhook

**Files to Create/Modify:**
- `prisma/schema.prisma` (MODIFY)
- `server/api/instructor/earnings.get.ts` (NEW)
- `server/api/instructor/earnings/history.get.ts` (NEW)
- `server/api/instructor/payouts/request.post.ts` (NEW)
- `server/api/instructor/payouts.get.ts` (NEW)
- `server/api/admin/instructor-earnings.get.ts` (NEW)
- `server/api/admin/payouts/[id]/process.post.ts` (NEW)
- `server/api/admin/payouts/[id]/complete.post.ts` (NEW)
- `server/api/payments/course-webhook.post.ts` (MODIFY - add earning creation)
- `pages/instructor/earnings.vue` (NEW)
- `pages/instructor/payouts.vue` (NEW)
- `pages/admin/instructors/earnings.vue` (NEW)
- `pages/admin/instructors/payouts.vue` (NEW)
- `layouts/instructor.vue` (MODIFY - add earnings link)

---

### 4. Course Search and Advanced Filtering

**Description:** Enhanced search and filtering for course catalog.

**Database Schema Changes:**
```prisma
// No schema changes needed - use existing Course fields
// Add indexes for better search performance
```

**API Endpoints to Modify:**
- `GET /api/courses` - Enhance with search, filters, sorting

**Query Parameters:**
- `search` - Search term (name, description)
- `category` - Filter by category
- `instructor` - Filter by instructor ID
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `minRating` - Minimum average rating
- `sortBy` - Sort by: newest, oldest, price_asc, price_desc, rating, enrollments
- `page` - Page number
- `limit` - Results per page

**Frontend Pages/Components:**
- Update `pages/courses/index.vue` - Add filters sidebar
- `components/courses/CourseFilters.vue` - Filter component
- `components/courses/CourseSearch.vue` - Search component

**Implementation Steps:**
1. Enhance courses API with search and filtering
2. Add pagination support
3. Build filter sidebar component
4. Build search component
5. Integrate into course catalog page
6. Add URL query parameter sync
7. Add loading states

**Files to Create/Modify:**
- `server/api/courses/index.get.ts` (MODIFY)
- `components/courses/CourseFilters.vue` (NEW)
- `components/courses/CourseSearch.vue` (NEW)
- `pages/courses/index.vue` (MODIFY)

---

### 5. Certificate Storage (Cloud Upload)

**Description:** Upload generated certificates to cloud storage instead of storing as base64.

**Database Schema Changes:**
```prisma
// Certificate model already has pdfUrl field - no changes needed
```

**API Endpoints to Modify:**
- `server/utils/certificate.ts` - Add cloud upload functionality
- `server/api/certificates/[id]/download.get.ts` - Update to serve from cloud

**Cloud Storage Options:**
- AWS S3
- Cloudinary
- Google Cloud Storage
- Azure Blob Storage

**Implementation Steps:**
1. Choose cloud storage provider
2. Install storage SDK (e.g., @aws-sdk/client-s3, cloudinary)
3. Create storage utility function
4. Update certificate generation to upload PDF
5. Update certificate download endpoint
6. Add environment variables for storage config
7. Test upload and download flow

**Files to Create/Modify:**
- `server/utils/storage.ts` (NEW)
- `server/utils/certificate.ts` (MODIFY)
- `server/api/certificates/[id]/download.get.ts` (MODIFY)
- `.env.example` (MODIFY - add storage config)

---

## Medium Priority Features

### 6. Discussion Forums / Q&A

**Description:** Per-course Q&A where students can ask questions and instructors respond.

**Database Schema Changes:**
```prisma
model CourseQuestion {
  id          String   @id @default(cuid())
  question    String   @db.Text
  answer      String?  @db.Text
  answeredAt  DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  upvotes     Int      @default(0)
  
  course   Course @relation(fields: [courseId], references: [id], onDelete: Cascade)
  courseId String
  user     User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId   String
  answeredBy User? @relation("QuestionAnswerer", fields: [answeredById], references: [id])
  answeredById String?
}

// Update Course model
model Course {
  // ... existing fields
  questions CourseQuestion[]
}

// Update User model
model User {
  // ... existing fields
  questions     CourseQuestion[]
  answeredQuestions CourseQuestion[] @relation("QuestionAnswerer")
}
```

**API Endpoints to Create:**
- `GET /api/courses/[id]/questions` - Get all questions for a course
- `POST /api/courses/[id]/questions` - Ask a question
- `PUT /api/courses/[id]/questions/[questionId]` - Update question
- `POST /api/courses/[id]/questions/[questionId]/answer` - Answer a question
- `POST /api/courses/[id]/questions/[questionId]/upvote` - Upvote question
- `DELETE /api/courses/[id]/questions/[questionId]` - Delete question

**Frontend Pages/Components:**
- `components/courses/CourseQuestions.vue` - Questions list
- `components/courses/QuestionForm.vue` - Ask question form
- `components/courses/AnswerForm.vue` - Answer form
- Update `pages/courses/[id].vue` - Add Q&A tab
- Update `pages/dashboard/learn/[id].vue` - Add Q&A section

**Implementation Steps:**
1. Run Prisma migration
2. Create question API endpoints
3. Create answer API endpoints
4. Build questions display component
5. Build question form component
6. Build answer form component
7. Integrate into course pages
8. Add notifications for new questions

**Files to Create/Modify:**
- `prisma/schema.prisma` (MODIFY)
- `server/api/courses/[id]/questions.get.ts` (NEW)
- `server/api/courses/[id]/questions.post.ts` (NEW)
- `server/api/courses/[id]/questions/[questionId].put.ts` (NEW)
- `server/api/courses/[id]/questions/[questionId]/answer.post.ts` (NEW)
- `server/api/courses/[id]/questions/[questionId]/upvote.post.ts` (NEW)
- `components/courses/CourseQuestions.vue` (NEW)
- `components/courses/QuestionForm.vue` (NEW)
- `components/courses/AnswerForm.vue` (NEW)
- `pages/courses/[id].vue` (MODIFY)

---

### 7. Course Categories

**Description:** Organize courses by categories for better discovery.

**Database Schema Changes:**
```prisma
model Category {
  id          String   @id @default(cuid())
  name        String   @unique
  slug        String   @unique
  description String?  @db.Text
  icon        String?  // Icon name or URL
  color       String?  // Hex color
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  courses Course[]
}

// Update Course model
model Course {
  // ... existing fields
  category   Category? @relation(fields: [categoryId], references: [id])
  categoryId String?
}
```

**API Endpoints to Create:**
- `GET /api/categories` - Get all categories
- `GET /api/categories/[id]` - Get category with courses
- `POST /api/admin/categories` - Create category (admin)
- `PUT /api/admin/categories/[id]` - Update category (admin)
- `DELETE /api/admin/categories/[id]` - Delete category (admin)

**Frontend Pages/Components:**
- `pages/categories/index.vue` - Categories listing
- `pages/categories/[slug].vue` - Category page with courses
- Update `pages/courses/index.vue` - Add category filter
- Update `pages/admin/courses/create.vue` - Add category selector

**Implementation Steps:**
1. Run Prisma migration
2. Create category API endpoints
3. Create admin category management
4. Build categories listing page
5. Build category detail page
6. Add category selector to course creation
7. Update course catalog with category filters
8. Seed default categories

**Files to Create/Modify:**
- `prisma/schema.prisma` (MODIFY)
- `server/api/categories.get.ts` (NEW)
- `server/api/categories/[id].get.ts` (NEW)
- `server/api/admin/categories.post.ts` (NEW)
- `server/api/admin/categories/[id].put.ts` (NEW)
- `server/api/admin/categories/[id].delete.ts` (NEW)
- `pages/categories/index.vue` (NEW)
- `pages/categories/[slug].vue` (NEW)
- `pages/courses/index.vue` (MODIFY)
- `prisma/seed.ts` (MODIFY - add categories)

---

### 8. Video Progress Tracking

**Description:** Track video watch time and resume from last position.

**Database Schema Changes:**
```prisma
// Update LessonProgress model
model LessonProgress {
  // ... existing fields
  watchTime      Int?     // Seconds watched
  lastPosition    Decimal? @db.Decimal(10, 2) // Last position in seconds
  completedAt     DateTime?
}
```

**API Endpoints to Create/Modify:**
- `POST /api/lessons/[id]/progress` - Update watch progress
- `GET /api/lessons/[id]/progress` - Get progress for lesson

**Frontend Components:**
- Update `components/VideoPlayer.vue` - Add progress tracking
- Update `pages/dashboard/learn/[id].vue` - Resume from last position

**Implementation Steps:**
1. Update LessonProgress model
2. Create progress update API
3. Update video player to track position
4. Save progress periodically (every 5-10 seconds)
5. Load last position on video load
6. Update progress bar display

**Files to Create/Modify:**
- `prisma/schema.prisma` (MODIFY)
- `server/api/lessons/[id]/progress.post.ts` (NEW)
- `server/api/lessons/[id]/progress.get.ts` (NEW)
- `components/VideoPlayer.vue` (MODIFY)
- `pages/dashboard/learn/[id].vue` (MODIFY)

---

### 9. Refund System

**Description:** Allow students to request refunds for courses.

**Database Schema Changes:**
```prisma
enum RefundStatus {
  PENDING
  APPROVED
  REJECTED
  PROCESSED
}

model Refund {
  id          String       @id @default(cuid())
  reason      String       @db.Text
  status      RefundStatus @default(PENDING)
  amount      Decimal      @db.Decimal(10, 2)
  currency    String       @default("USD")
  requestedAt DateTime     @default(now())
  processedAt DateTime?
  rejectionReason String?  @db.Text
  
  enrollment Enrollment @relation(fields: [enrollmentId], references: [id])
  enrollmentId String
  user        User       @relation(fields: [userId], references: [id])
  userId      String
  processedBy User?      @relation("RefundProcessor", fields: [processedById], references: [id])
  processedById String?
}

// Update Enrollment model
model Enrollment {
  // ... existing fields
  refund Refund?
}

// Update User model
model User {
  // ... existing fields
  refunds         Refund[]
  processedRefunds Refund[] @relation("RefundProcessor")
}
```

**API Endpoints to Create:**
- `POST /api/enrollments/[id]/refund` - Request refund
- `GET /api/enrollments/[id]/refund` - Get refund status
- `GET /api/admin/refunds` - Get all refund requests
- `POST /api/admin/refunds/[id]/approve` - Approve refund
- `POST /api/admin/refunds/[id]/reject` - Reject refund
- `POST /api/admin/refunds/[id]/process` - Process refund payment

**Frontend Pages/Components:**
- `pages/dashboard/refunds.vue` - User refund requests
- `pages/admin/refunds.vue` - Admin refund management
- Update `pages/dashboard/learn/index.vue` - Add refund button

**Implementation Steps:**
1. Run Prisma migration
2. Create refund request API
3. Create admin refund management APIs
4. Build refund request form
5. Build admin refund management interface
6. Add refund button to enrolled courses
7. Integrate with payment gateway for refund processing
8. Add email notifications

**Files to Create/Modify:**
- `prisma/schema.prisma` (MODIFY)
- `server/api/enrollments/[id]/refund.post.ts` (NEW)
- `server/api/enrollments/[id]/refund.get.ts` (NEW)
- `server/api/admin/refunds.get.ts` (NEW)
- `server/api/admin/refunds/[id]/approve.post.ts` (NEW)
- `server/api/admin/refunds/[id]/reject.post.ts` (NEW)
- `server/api/admin/refunds/[id]/process.post.ts` (NEW)
- `pages/dashboard/refunds.vue` (NEW)
- `pages/admin/refunds.vue` (NEW)
- `pages/dashboard/learn/index.vue` (MODIFY)

---

### 10. Course Coupons/Discounts

**Description:** Discount codes for courses with expiration and usage limits.

**Database Schema Changes:**
```prisma
model Coupon {
  id            String   @id @default(cuid())
  code          String   @unique
  discountType  String   // PERCENTAGE or FIXED
  discountValue Decimal  @db.Decimal(10, 2)
  maxUses       Int?     // null = unlimited
  usedCount     Int      @default(0)
  expiresAt     DateTime?
  active        Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  course   Course?  @relation(fields: [courseId], references: [id])
  courseId String?  // null = applies to all courses
  enrollments Enrollment[]
}

// Update Enrollment model
model Enrollment {
  // ... existing fields
  coupon   Coupon?  @relation(fields: [couponId], references: [id])
  couponId String?
  discountAmount Decimal? @db.Decimal(10, 2)
}
```

**API Endpoints to Create:**
- `POST /api/admin/coupons` - Create coupon (admin)
- `GET /api/admin/coupons` - List all coupons (admin)
- `PUT /api/admin/coupons/[id]` - Update coupon (admin)
- `DELETE /api/admin/coupons/[id]` - Delete coupon (admin)
- `POST /api/coupons/validate` - Validate coupon code
- Update `POST /api/courses/[id]/enroll` - Apply coupon

**Frontend Pages/Components:**
- `pages/admin/coupons/index.vue` - Coupon management
- `pages/admin/coupons/create.vue` - Create coupon
- Update `pages/checkout/[courseId].vue` - Add coupon input

**Implementation Steps:**
1. Run Prisma migration
2. Create coupon management APIs
3. Create coupon validation API
4. Update enrollment API to apply coupon
5. Build admin coupon management interface
6. Add coupon input to checkout
7. Calculate discounted price
8. Add coupon usage tracking

**Files to Create/Modify:**
- `prisma/schema.prisma` (MODIFY)
- `server/api/admin/coupons.post.ts` (NEW)
- `server/api/admin/coupons.get.ts` (NEW)
- `server/api/admin/coupons/[id].put.ts` (NEW)
- `server/api/admin/coupons/[id].delete.ts` (NEW)
- `server/api/coupons/validate.post.ts` (NEW)
- `server/api/courses/[id]/enroll.post.ts` (MODIFY)
- `pages/admin/coupons/index.vue` (NEW)
- `pages/admin/coupons/create.vue` (NEW)
- `pages/checkout/[courseId].vue` (MODIFY)

---

## Nice to Have Features

### 11. Wishlist / Favorites

**Database Schema:**
```prisma
model Wishlist {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId String
  course Course @relation(fields: [courseId], references: [id], onDelete: Cascade)
  courseId String
  
  @@unique([userId, courseId])
}
```

**API Endpoints:**
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist/[courseId]` - Add to wishlist
- `DELETE /api/wishlist/[courseId]` - Remove from wishlist

**Files:**
- `server/api/wishlist.get.ts`
- `server/api/wishlist/[courseId].post.ts`
- `server/api/wishlist/[courseId].delete.ts`
- `pages/dashboard/wishlist.vue`
- Update course cards with wishlist button

---

### 12. Learning Paths / Course Bundles

**Database Schema:**
```prisma
model LearningPath {
  id          String   @id @default(cuid())
  name        String
  description String   @db.Text
  price       Decimal? @db.Decimal(10, 2) // null = sum of courses
  createdAt   DateTime @default(now())
  
  courses LearningPathCourse[]
}

model LearningPathCourse {
  id            String       @id @default(cuid())
  order         Int
  learningPath  LearningPath @relation(fields: [learningPathId], references: [id])
  learningPathId String
  course        Course       @relation(fields: [courseId], references: [id])
  courseId      String
}
```

**Files:**
- `server/api/learning-paths.get.ts`
- `server/api/learning-paths/[id].get.ts`
- `pages/learning-paths/index.vue`
- `pages/learning-paths/[id].vue`

---

### 13. Social Sharing

**Implementation:**
- Add share buttons to course pages
- Generate shareable links with referral tracking
- Social media meta tags
- Share to WhatsApp, Facebook, Twitter

**Files:**
- `components/courses/ShareButtons.vue`
- `composables/useShare.ts`
- Update course pages with share buttons

---

### 14. Mobile PWA

**Implementation:**
- Add PWA manifest
- Service worker for offline support
- Install prompt
- Push notifications setup

**Files:**
- `public/manifest.json` (UPDATE)
- `public/sw.js` (NEW)
- `nuxt.config.ts` (MODIFY - add PWA module)

---

### 15. Multi-language Support

**Implementation:**
- Use Nuxt i18n module
- Create translation files
- Add language switcher
- Support course content in multiple languages

**Files:**
- `locales/en.json`
- `locales/zu.json` (Zulu)
- `nuxt.config.ts` (MODIFY - add i18n)

---

## Implementation Order

### Phase 1: Critical Features (Weeks 1-2)
1. Password Reset
2. Course Search & Filtering
3. Certificate Storage

### Phase 2: User Engagement (Weeks 3-4)
4. Course Reviews & Ratings
5. Discussion Forums
6. Video Progress Tracking

### Phase 3: Monetization (Weeks 5-6)
7. Instructor Earnings
8. Course Coupons
9. Refund System

### Phase 4: Organization (Week 7)
10. Course Categories
11. Wishlist

### Phase 5: Advanced Features (Weeks 8+)
12. Learning Paths
13. Social Sharing
14. PWA
15. Multi-language

---

## General Implementation Guidelines

### Database Migrations
```bash
# Always create migrations for schema changes
npx prisma migrate dev --name feature_name
npx prisma generate
```

### API Endpoint Structure
- Use RESTful conventions
- Include authentication checks
- Validate input with Zod
- Return consistent error formats
- Include pagination for list endpoints

### Frontend Components
- Use shadcn-nuxt components where possible
- Follow existing design patterns
- Add loading states
- Handle errors gracefully
- Make responsive

### Testing Checklist
- [ ] Database migration runs successfully
- [ ] API endpoints work correctly
- [ ] Frontend displays correctly
- [ ] Authentication/authorization works
- [ ] Error handling works
- [ ] Mobile responsive
- [ ] Loading states work
- [ ] Edge cases handled

### Environment Variables
Add new variables to `.env.example`:
```env
# Example
STORAGE_PROVIDER=s3
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_BUCKET_NAME=xxx
```

---

## Notes

- Always test migrations on a development database first
- Keep API responses consistent with existing patterns
- Follow existing code style and conventions
- Update documentation as you implement features
- Consider backward compatibility when modifying existing APIs
- Add proper error handling and validation
- Include loading and error states in UI
- Test on multiple browsers and devices

---

## Quick Reference: File Structure

```
server/
  api/
    auth/           # Authentication endpoints
    courses/        # Course-related endpoints
    instructor/     # Instructor-specific endpoints
    admin/          # Admin-only endpoints
    enrollments/    # Enrollment endpoints
    payments/       # Payment endpoints

pages/
  auth/            # Authentication pages
  courses/         # Course pages
  dashboard/       # User dashboard
  instructor/      # Instructor dashboard
  admin/           # Admin dashboard

components/
  courses/         # Course-related components
  ui/              # Reusable UI components

prisma/
  schema.prisma    # Database schema
  seed.ts          # Database seeding
```

---

**Last Updated:** 2024
**Version:** 1.0



