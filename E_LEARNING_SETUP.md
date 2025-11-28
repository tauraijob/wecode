# E-Learning System for WeCodeZW

This document outlines the e-learning system implementation for WeCodeZW, including all features, API endpoints, and usage instructions.

## Overview

The e-learning system provides a complete learning management system with:
- Course catalog and enrollment
- Video-based lessons with progress tracking
- AI-generated practice quizzes
- Final exams with certification
- Admin course management
- Certificate generation and customization

## Database Schema

The system uses the following Prisma models:

- **Course**: Main course entity with name, description, price, status
- **Topic**: Course topics/sections
- **Lesson**: Individual video lessons within topics
- **Enrollment**: Student course enrollments
- **LessonProgress**: Tracks lesson completion
- **PracticeQuizTemplate**: Quiz configuration for lessons
- **PracticeQuizAttempt**: Student quiz attempts
- **FinalExamTemplate**: Final exam configuration
- **FinalExamAttempt**: Student exam attempts
- **CertificateTemplate**: Certificate design templates
- **Certificate**: Generated certificates

## API Endpoints

### Course Management

- `GET /api/courses` - List all published courses (public)
- `GET /api/courses/:id` - Get course details
- `POST /api/courses` - Create course (admin only)
- `PUT /api/courses/:id` - Update course (admin only)
- `DELETE /api/courses/:id` - Delete course (admin only)
- `POST /api/courses/:id/topics` - Add topic to course (admin only)
- `POST /api/courses/:id/topics/:topicId/lessons` - Add lesson to topic (admin only)

### Enrollment

- `POST /api/courses/:id/enroll` - Enroll in a course (creates invoice)
- `GET /api/enrollments` - Get user's enrollments
- `POST /api/enrollments/:id/complete` - Mark enrollment as complete

### Learning Progress

- `POST /api/lessons/:id/complete` - Mark lesson as complete
- `POST /api/lessons/:id/quiz/generate` - Generate practice quiz
- `POST /api/lessons/:id/quiz/submit` - Submit quiz answers

### Final Exam

- `POST /api/courses/:id/exam/start` - Start final exam
- `POST /api/courses/:id/exam/submit` - Submit final exam

### Certificates

- `GET /api/certificates/:id/download` - Download certificate PDF

### Admin Endpoints

- `GET /api/admin/courses` - List all courses (admin)
- `GET /api/admin/courses/analytics` - Course analytics (admin)
- `GET /api/admin/certificates/templates` - List certificate templates
- `POST /api/admin/certificates/templates` - Create certificate template

### Payment Webhook

- `POST /api/payments/course-webhook` - Payment confirmation webhook

## Frontend Pages

### Student Pages

- `/courses` - Course catalog
- `/courses/:id` - Course details and enrollment
- `/dashboard/learn` - My courses dashboard
- `/dashboard/learn/:id` - Course learning interface

### Admin Pages

- `/admin/courses` - Course management

## Setup Instructions

### 1. Database Migration

Run Prisma migration to create the new tables:

```bash
npm run prisma:migrate
```

### 2. Environment Variables

Ensure these are set:
- `DATABASE_URL` - MySQL database connection
- `PAYNOW_INTEGRATION_ID` - PayNow integration ID
- `PAYNOW_INTEGRATION_KEY` - PayNow integration key
- `SITE_URL` - Your site URL for payment callbacks

### 3. AI Quiz Generation

The AI quiz generation utility (`server/utils/ai-quiz.ts`) currently uses a placeholder implementation. To enable actual AI quiz generation:

1. Integrate with an AI service (OpenAI, Anthropic, etc.)
2. Update the `generateQuizQuestions` function in `server/utils/ai-quiz.ts`
3. Add API key to environment variables

### 4. Certificate Storage

Currently, certificates are generated on-demand. For production:

1. Set up file storage (S3, Cloudinary, etc.)
2. Upload generated PDFs to storage
3. Update `pdfUrl` in certificate records
4. Modify download endpoint to serve from storage

## User Flow

### Student Journey

1. **Browse Courses**: Visit `/courses` to see available courses
2. **View Course Details**: Click on a course to see topics, lessons, and price
3. **Enroll**: Click "Enroll Now" (requires login)
4. **Payment**: Redirected to payment page, complete payment via PayNow
5. **Access Course**: After payment, access course from `/dashboard/learn/:id`
6. **Watch Lessons**: Watch video lessons and mark as complete
7. **Take Practice Quiz**: After each lesson, take AI-generated quiz
8. **Complete Course**: Finish all lessons
9. **Take Final Exam**: Complete final exam to earn certificate
10. **Download Certificate**: Download PDF certificate upon passing

### Admin Journey

1. **Create Course**: Go to `/admin/courses`, click "Create Course"
2. **Add Topics**: Edit course, add topics
3. **Add Lessons**: Add lessons to topics with video URLs and transcripts
4. **Configure Exam**: Set exam parameters (questions, duration, passing score)
5. **Customize Certificate**: Create certificate templates with custom design
6. **Monitor Analytics**: View enrollment stats, completion rates, exam scores

## Features

### AI-Generated Quizzes

- Automatically generates 10 questions per lesson
- Questions based on lesson transcript/notes
- Supports multiple-choice and true/false questions
- Can be retaken multiple times with new questions

### Progress Tracking

- Automatic progress calculation based on completed lessons
- Visual progress bars
- Completion percentage tracking

### Certificate Generation

- PDF certificate generation using pdf-lib
- Customizable templates (colors, fonts, layout)
- Dynamic data insertion (student name, course title, date)
- Unique certificate numbers

### Payment Integration

- Integrated with PayNow payment gateway
- Automatic enrollment activation after payment
- Invoice generation for course purchases

## Next Steps

1. **AI Integration**: Connect to actual AI service for quiz generation
2. **Video Hosting**: Set up video hosting (Vimeo, AWS S3, etc.)
3. **File Storage**: Implement certificate PDF storage
4. **Email Notifications**: Send enrollment confirmations, certificate emails
5. **Analytics Dashboard**: Enhanced admin analytics with charts
6. **Mobile Responsiveness**: Ensure all pages are mobile-friendly
7. **Video Player**: Enhanced video player with progress tracking
8. **Discussion Forums**: Add course discussion features

## Notes

- The system currently allows enrollment before payment (creates invoice)
- Payment webhook activates enrollment after successful payment
- Certificates are generated on-demand when exam is passed
- Quiz generation requires lesson transcripts/notes for best results

