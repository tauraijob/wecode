# Instructor Dashboard Implementation Summary

## Overview
This document summarizes the implementation of the Instructor Dashboard feature, which allows instructors to create courses, manage content, and submit courses for admin review.

## Database Changes

### Schema Updates (`prisma/schema.prisma`)

1. **Added INSTRUCTOR role** to the `Role` enum
2. **Added CourseReviewStatus enum**: `PENDING_REVIEW`, `APPROVED`, `REJECTED`
3. **Updated Course model** with:
   - `instructorId` (foreign key to User)
   - `reviewStatus` (CourseReviewStatus)
   - `rejectionReason` (optional text)
   - `platformCommissionPercentage` (default 30%)
   - `submittedForReviewAt` (DateTime)
   - `reviewedAt` (DateTime)
   - `reviewedById` (foreign key to User)
4. **Created Notification model** for sending notifications to users
5. **Created CourseReview model** for tracking review history

### Migration Required
Run Prisma migration to apply schema changes:
```bash
npx prisma migrate dev --name add_instructor_features
npx prisma generate
```

## Features Implemented

### 1. Instructor Account Creation
- Updated registration API to allow `INSTRUCTOR` role
- Instructors can register like other users
- File: `server/api/auth/register.post.ts`

### 2. Course Creation & Management
- **Instructors can create courses** with:
  - Name, description, price
  - Platform commission percentage (default 30%)
  - Topics and lessons
  - Exam configuration
- **Course status workflow**:
  - DRAFT → PENDING_REVIEW → APPROVED/REJECTED → PUBLISHED
- **Instructor-specific features**:
  - Courses automatically linked to instructor
  - Must submit for review before publishing
  - Can set custom platform commission
- Files:
  - `server/api/courses/index.post.ts` (updated)
  - `server/api/courses/[id]/submit-review.post.ts` (new)

### 3. Course Review System
- **Admin can review courses**:
  - View pending courses
  - Approve and publish
  - Approve without publishing
  - Reject with reason
- **Review tracking**:
  - All review actions logged in CourseReview table
  - Timestamps for submission and review
- Files:
  - `server/api/admin/courses/pending.get.ts` (new)
  - `server/api/admin/courses/[id]/approve.post.ts` (new)
  - `server/api/admin/courses/[id]/reject.post.ts` (new)
  - `pages/admin/courses/review.vue` (new)

### 4. Instructor Dashboard
- **Dashboard overview** with stats:
  - Total courses
  - Published courses
  - Pending review
  - Total enrollments
- **Course management**:
  - View all courses
  - Submit courses for review
  - View course status and review status
- Files:
  - `pages/instructor/index.vue` (new)
  - `pages/instructor/courses/index.vue` (new)
  - `server/api/instructor/courses.get.ts` (new)

### 5. Notification System
- **Automatic notifications** for:
  - Course submitted (to admins)
  - Course approved (to instructor)
  - Course rejected (to instructor)
- **Notification helper utilities**:
  - `createNotification()` - Create notification for user
  - `notifyAdmins()` - Notify all admins
- File: `server/utils/notifications.ts` (new)

### 6. Instructor Badge Display
- **Course listings show instructor name**:
  - Badge with instructor name on course cards
  - Visible in course catalog
- Files:
  - `server/api/courses/index.get.ts` (updated)
  - `pages/courses/index.vue` (updated)

### 7. Platform Commission
- **Commission tracking**:
  - Each course has `platformCommissionPercentage` field
  - Default: 30%
  - Can be customized per course
- **Note**: Commission calculation in payment system needs to be implemented (TODO)

## Navigation Updates

### Admin Layout
- Added "Course Reviews" link to admin sidebar
- File: `layouts/admin.vue` (updated)

### Dashboard Layout
- Added "Instructor Dashboard" and "My Courses" links for instructors
- File: `layouts/dashboard.vue` (updated)

## API Endpoints

### Instructor Endpoints
- `GET /api/instructor/courses` - Get instructor's courses
- `POST /api/courses` - Create course (instructor or admin)
- `POST /api/courses/[id]/submit-review` - Submit course for review

### Admin Endpoints
- `GET /api/admin/courses/pending` - Get pending courses
- `POST /api/admin/courses/[id]/approve` - Approve course
- `POST /api/admin/courses/[id]/reject` - Reject course

## Pages Created

1. `/instructor` - Instructor dashboard overview
2. `/instructor/courses` - Instructor's course list
3. `/admin/courses/review` - Admin course review page

## Workflow

### Instructor Course Creation Flow
1. Instructor creates course (status: DRAFT, reviewStatus: PENDING_REVIEW)
2. Instructor adds topics, lessons, content
3. Instructor submits for review
4. Admin receives notification
5. Admin reviews course
6. Admin approves/rejects
7. If approved, course can be published
8. Instructor receives notification

### Course Status Flow
```
DRAFT (not submitted)
  ↓
PENDING_REVIEW (submitted)
  ↓
APPROVED → PUBLISHED (admin publishes)
  or
REJECTED → DRAFT (instructor can resubmit)
```

## Remaining Tasks

1. **Platform Commission Calculation** (TODO)
   - Update payment system to calculate and track commission
   - Create commission payout system for instructors
   - File: Payment handlers need commission tracking

2. **Course Creation/Edit Page** (TODO)
   - Full course creation form for instructors
   - Topic and lesson management
   - Quiz creation interface
   - File: `pages/instructor/courses/create.vue` (needs creation)

3. **Notification Display** (TODO)
   - Notification center in dashboard
   - Mark as read functionality
   - Real-time notifications

## Testing Checklist

- [ ] Instructor can register
- [ ] Instructor can create course
- [ ] Instructor can submit course for review
- [ ] Admin receives notification
- [ ] Admin can approve course
- [ ] Admin can reject course with reason
- [ ] Instructor receives approval/rejection notification
- [ ] Instructor badge shows on course listings
- [ ] Platform commission is stored correctly

## Notes

- Default platform commission: 30%
- Instructors cannot publish courses directly (must be approved)
- Admins can create and publish courses directly
- All course actions are logged in CourseReview table
- Notifications are created for all major actions



