# WeCode Platform Documentation

## Overview

**WeCode** is a comprehensive technology education and community platform based in Zimbabwe. The platform combines educational services, a developer community forum, and a mentorship marketplace.

**Website**: https://wecode.co.zw

---

## Platform Components

### 1. Main Website (Public)

The public-facing website showcases WeCode's services and allows visitors to:

| Feature | Description |
|---------|-------------|
| **Home Page** | Overview of services, trusted brands, call-to-action |
| **Services** | Coding & Robotics Clubs, Corporate Training, Workshops |
| **Contact Form** | Inquiries from individuals, corporates, and schools |
| **Quote Generator** | Schools can get instant quotes for club programs |
| **Course Catalog** | Browse available courses and training programs |

---

### 2. Community Forum

A developer community platform where users can connect, share knowledge, and learn together.

#### User Features
- **Forum Posts**: Create and engage in discussions
- **Comments**: Reply to posts with threaded comments
- **User Profiles**: Custom username, bio, profession, experience level
- **Notifications**: Email alerts for replies and @mentions

#### Access
- **URL**: `/community`
- **Registration**: Open to all (email verification required)
- **Starting Credits**: New users receive 10 credits

---

### 3. Mentorship Marketplace

A platform connecting mentees with experienced developers for 1-on-1 sessions.

#### For Mentees
| Feature | Description |
|---------|-------------|
| Browse Mentors | View mentor profiles, skills, and hourly rates |
| Book Sessions | Schedule sessions using credits |
| Session Chat | Built-in chat for communication |
| Video Meetings | Auto-generated Google Meet links |
| Reviews | Rate mentors after sessions |

#### For Mentors
| Feature | Description |
|---------|-------------|
| Mentor Dashboard | `/mentor` - Manage sessions, track earnings |
| Session Management | Accept/decline/complete bookings |
| Earnings Tracking | View total earnings and withdrawable balance |
| Payout Requests | Cash out earnings via EcoCash, Bank, etc. |
| Payout History | Track all payout requests |

#### Session Flow
1. Mentee browses mentors at `/community/mentors`
2. Mentee books a session (credits deducted)
3. Mentor accepts/declines the booking
4. When confirmed, chat room and meeting link are auto-created
5. Session takes place (chat + video available 15 min before)
6. Either party can mark session as complete
7. Mentor receives 60% of session value as earnings

---

### 4. Credit System

Credits are the platform's currency for booking mentorship sessions.

#### Pricing
- **1 Credit = $0.10 USD**
- Packages available: 50, 100, 200, 500 credits
- Multi-currency support: USD and ZWG

#### Earning Credits (Mentors)
- Mentors earn 60% of session credits
- Platform keeps 40% as commission
- Example: 100-credit session → Mentor earns 60 credits ($6)

#### Top-Up Methods
- PayNow (Zimbabwe)
- Mobile Money integration

---

### 5. Admin Dashboards

#### Main Website Admin (`/admin`)
- Manage courses, enrollments, certificates
- View quotes, invoices, requests
- User management
- **Admin Email**: info@wecode.co.zw

#### Community Admin (`/admin/community`)
| Page | Function |
|------|----------|
| Dashboard | Stats overview, pending items |
| Users | All registered users, verification status |
| Mentors | Approve/reject mentor applications |
| Payouts | Process mentor payout requests |

- **Admin Email**: wecodezw@gmail.com
- **Credentials**: wecodezw@gmail.com / DevTeam24.$.$

---

## Email Notifications

The platform sends automated emails for various events:

### User Emails
- Welcome + Email Verification
- Mentor Application Status (Pending/Approved/Rejected)
- Forum Reply Notifications
- @Mention Notifications
- Payout Request Confirmations

### Admin Alerts
- New User Registrations
- Mentor Applications
- Payout Requests
- Quote Requests
- Contact Form Submissions

---

## Technical Stack

| Component | Technology |
|-----------|------------|
| Framework | Nuxt 4 (Vue 3) |
| Database | MySQL + Prisma ORM |
| Styling | TailwindCSS |
| Authentication | JWT + Cookies |
| Email | Brevo SMTP |
| Payments | PayNow Zimbabwe |
| AI Features | Groq (Llama) |
| Hosting | VPS |

---

## User Roles

| Role | Access Level |
|------|--------------|
| INDIVIDUAL | Basic community access |
| STUDENT | Course enrollments |
| MENTOR | Mentorship dashboard, can accept bookings |
| INSTRUCTOR | Course creation |
| ADMIN | Full platform access |
| CORPORATE | Corporate training features |

---

## Key URLs

| URL | Description |
|-----|-------------|
| `/` | Homepage |
| `/community` | Forum feed |
| `/community/mentors` | Browse mentors |
| `/community/bookings` | My bookings |
| `/community/settings` | Profile settings |
| `/mentor` | Mentor dashboard |
| `/mentor/sessions` | Manage sessions |
| `/mentor/earnings` | Earnings & payouts |
| `/mentor/payouts` | Payout history |
| `/login` | User login |
| `/community/register` | Community registration |
| `/admin` | Main admin panel |
| `/admin/community` | Community admin |

---

## Security Features

- JWT-based authentication
- HTTP-only cookies
- Email verification required
- Password hashing (bcrypt)
- Admin-only routes protected
- Mentor approval workflow

---

## Contact

- **Email**: info@wecode.co.zw
- **Community Admin**: wecodezw@gmail.com
- **WhatsApp**: +263 778 456 168
- **Website**: https://wecode.co.zw

---

*Document Version: 1.0*  
*Last Updated: January 2026*
