# Login Credentials for WeCodeZW E-Learning Platform

## 🔐 E-LEARNING PLATFORM Login Credentials

> **Note:** These credentials are specifically for the E-Learning Platform and are different from the general WeCodeZW website logins.

### 👤 E-LEARNING ADMIN ACCOUNT
- **Email:** `elearning-admin@wecode.co.zw`
- **Password:** `ElearningAdmin@2024`
- **Role:** ADMIN
- **Access:** 
  - Full admin dashboard
  - Course management (create, edit, delete courses)
  - User management
  - System settings
  - View all enrollments and statistics
- **Note:** This is different from the general website admin (`admin@wecodezw.com`)

### 👤 E-LEARNING STUDENT ACCOUNT
- **Email:** `elearning-student@wecode.co.zw`
- **Password:** `ElearningStudent@2024`
- **Role:** STUDENT
- **Access:**
  - Course catalog browsing
  - Course enrollment
  - Learning progress tracking
  - Practice quizzes
  - Final exams
  - Certificate generation
- **Note:** This is different from the general website user (`user@wecodezw.com`)

## 📚 Available Courses

The following courses have been created with topics and lessons:

### 1. Introduction to Web Development - $99.99
   - **Status:** PUBLISHED
   - **Topics:** 3
   - **Lessons:** 6
   - **Topics:**
     - HTML Basics (2 lessons)
     - CSS Styling (2 lessons)
     - JavaScript Basics (2 lessons)
   - **Prerequisites:** No prior experience required

### 2. Advanced React Development - $149.99
   - **Status:** PUBLISHED
   - **Topics:** 2
   - **Lessons:** 4
   - **Topics:**
     - React Fundamentals (2 lessons)
     - React Hooks (2 lessons)
   - **Prerequisites:** Basic knowledge of JavaScript and HTML

### 3. Python for Data Science - $129.99
   - **Status:** PUBLISHED
   - **Topics:** 2
   - **Lessons:** 4
   - **Topics:**
     - Python Basics (2 lessons)
     - Data Analysis with Pandas (2 lessons)
   - **Prerequisites:** Basic programming knowledge helpful

## 🚀 Quick Start

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Access the application:**
   - Homepage: http://localhost:3000/
   - Login: http://localhost:3000/auth/login
   - Admin Dashboard: http://localhost:3000/admin (requires admin login)
   - Student Dashboard: http://localhost:3000/dashboard (requires student login)
   - Courses: http://localhost:3000/courses

3. **Login as E-Learning Admin:**
   - Go to http://localhost:3000/auth/login
   - Use: `elearning-admin@wecode.co.zw` / `ElearningAdmin@2024`
   - You'll be redirected to the admin dashboard

4. **Login as E-Learning Student:**
   - Go to http://localhost:3000/auth/login
   - Use: `elearning-student@wecode.co.zw` / `ElearningStudent@2024`
   - You'll be redirected to the student dashboard
   - Browse and enroll in courses

## 📝 Notes

- **E-Learning Platform Logins:** These credentials (`elearning-admin@wecode.co.zw` and `elearning-student@wecode.co.zw`) are specifically for the E-Learning Platform
- **General Website Logins:** The general WeCodeZW website uses different credentials (`admin@wecodezw.com`, `user@wecodezw.com`, etc.)
- All courses are published and ready for enrollment
- Each course has a video thumbnail and preview video
- Each course has exam configuration set up
- Students can enroll in courses and track their progress
- Admin can manage all aspects of the platform
- Passwords can be changed through account settings

## 🔄 Re-seeding the Database

If you need to reset the database and re-seed:

```bash
npx prisma migrate reset
npx tsx prisma/seed.ts
```

This will:
- Reset the database
- Run all migrations
- Create admin and student users
- Create all dummy courses with topics and lessons

