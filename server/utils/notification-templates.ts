/**
 * Notification Templates
 * Provides rich, formatted notification templates with icons and structured content
 */

export interface NotificationTemplate {
  icon: string
  color: string
  bgColor: string
  borderColor: string
  title: string
  message: string
  actionText?: string
  actionUrl?: string
}

/**
 * Get notification template based on type and metadata
 */
export function getNotificationTemplate(
  type: string,
  metadata: any = {},
  defaultTitle: string = '',
  defaultMessage: string = ''
): NotificationTemplate {
  const templates: Record<string, (metadata: any) => NotificationTemplate> = {
    // User Registration
    USER_REGISTERED: (meta) => ({
      icon: '👤',
      color: 'blue',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/50',
      title: 'New User Registration',
      message: `🎉 A new user has joined the platform!\n\n👤 **${meta.userName || 'User'}**\n📧 ${meta.email || 'N/A'}\n🎭 Role: ${meta.role || 'INDIVIDUAL'}\n\nWelcome them to the platform!`,
      actionText: 'View User',
      actionUrl: meta.userId ? `/admin/users?userId=${meta.userId}` : undefined
    }),

    // Course Notifications
    COURSE_CREATED: (meta) => ({
      icon: '📚',
      color: 'purple',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/50',
      title: 'New Course Created',
      message: `📚 A new course has been created!\n\n**Course:** ${meta.courseName || 'Unknown'}\n**Created by:** ${meta.createdBy || 'Admin'}\n\nReview and publish when ready.`,
      actionText: 'View Course',
      actionUrl: meta.courseId ? `/admin/courses/${meta.courseId}` : undefined
    }),

    COURSE_SUBMITTED: (meta) => ({
      icon: '📝',
      color: 'blue',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/50',
      title: 'Course Submitted for Review',
      message: meta.userId 
        ? `📝 Your course has been submitted!\n\n**Course:** ${meta.courseName || 'Unknown'}\n\n⏳ Please wait while our team reviews it. You'll be notified once it's approved.`
        : `📝 A new course is awaiting review!\n\n**Course:** ${meta.courseName || 'Unknown'}\n**Instructor:** ${meta.instructorId || 'N/A'}\n\nPlease review and approve or reject.`,
      actionText: meta.userId ? 'View Course' : 'Review Course',
      actionUrl: meta.courseId ? (meta.userId ? `/instructor/courses/${meta.courseId}` : `/admin/courses/${meta.courseId}`) : undefined
    }),

    COURSE_APPROVED: (meta) => ({
      icon: '✅',
      color: 'green',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/50',
      title: 'Course Approved',
      message: `✅ Great news! Your course has been approved!\n\n**Course:** ${meta.courseName || 'Unknown'}\n\n🎉 Your course is now live and available for enrollment!`,
      actionText: 'View Course',
      actionUrl: meta.courseId ? `/instructor/courses/${meta.courseId}` : undefined
    }),

    COURSE_REJECTED: (meta) => ({
      icon: '❌',
      color: 'red',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/50',
      title: 'Course Rejected',
      message: `❌ Your course submission was not approved.\n\n**Course:** ${meta.courseName || 'Unknown'}\n\nPlease review the feedback and resubmit.`,
      actionText: 'View Course',
      actionUrl: meta.courseId ? `/instructor/courses/${meta.courseId}` : undefined
    }),

    // Enrollment Notifications
    ENROLLMENT_CREATED: (meta) => ({
      icon: '🎓',
      color: 'green',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/50',
      title: meta.isFreeCourse ? 'Enrollment Successful!' : 'Enrollment Pending Payment',
      message: meta.isFreeCourse
        ? `🎓 You've successfully enrolled!\n\n**Course:** ${meta.courseName || 'Unknown'}\n\n🚀 Start learning now!`
        : meta.userId
        ? `🎓 You've enrolled in a course!\n\n**Course:** ${meta.courseName || 'Unknown'}\n**Invoice:** ${meta.invoiceNumber || 'N/A'}\n\n💳 Please complete payment to access the course.`
        : `🎓 New student enrollment!\n\n**Student:** ${meta.userName || 'User'}\n**Course:** ${meta.courseName || 'Unknown'}\n\nTrack their progress in the dashboard.`,
      actionText: meta.userId 
        ? (meta.isFreeCourse ? 'Start Learning' : 'Complete Payment')
        : 'View Enrollment',
      actionUrl: meta.userId
        ? (meta.isFreeCourse ? `/dashboard/learn/${meta.courseId}` : `/pay/${meta.invoiceNumber}`)
        : (meta.enrollmentId ? `/admin/courses/enrollments?enrollmentId=${meta.enrollmentId}` : undefined)
    }),

    ENROLLMENT_CANCELLED: (meta) => ({
      icon: '🚫',
      color: 'orange',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/50',
      title: 'Enrollment Cancelled',
      message: meta.userId
        ? `🚫 Your enrollment has been cancelled.\n\n**Course:** ${meta.courseName || 'Unknown'}\n\nIf this was a mistake, you can enroll again.`
        : `🚫 An enrollment has been cancelled.\n\n**Student:** ${meta.userName || 'User'}\n**Course:** ${meta.courseName || 'Unknown'}\n\nReview the cancellation details.`,
      actionText: meta.userId ? 'Browse Courses' : 'View Details',
      actionUrl: meta.userId ? '/courses' : (meta.enrollmentId ? `/admin/courses/enrollments?enrollmentId=${meta.enrollmentId}` : undefined)
    }),

    // Invoice Notifications
    INVOICE_CREATED: (meta) => ({
      icon: '🧾',
      color: 'blue',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/50',
      title: 'New Invoice Created',
      message: `🧾 A new invoice has been generated!\n\n**Invoice #:** ${meta.invoiceNumber || 'N/A'}\n**Course:** ${meta.courseName || 'Unknown'}\n**Amount:** ${meta.currency || 'USD'} ${meta.amount?.toFixed(2) || '0.00'}\n**Student:** ${meta.userName || 'User'}\n\nTrack payment status.`,
      actionText: 'View Invoice',
      actionUrl: meta.invoiceNumber ? `/admin/invoices?invoiceNumber=${meta.invoiceNumber}` : undefined
    }),

    // Payment Notifications
    PAYMENT_SUCCESS: (meta) => ({
      icon: '💳',
      color: 'green',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/50',
      title: 'Payment Successful',
      message: meta.userId
        ? `💳 Payment received!\n\n**Amount:** ${meta.currency || 'USD'} ${meta.amount?.toFixed(2) || '0.00'}\n**Course:** ${meta.courseName || 'Unknown'}\n**Invoice:** ${meta.invoiceNumber || 'N/A'}\n\n✅ You now have full access to the course!`
        : meta.instructorId
        ? `💳 Student payment received!\n\n**Student:** ${meta.userName || 'User'}\n**Course:** ${meta.courseName || 'Unknown'}\n**Amount:** ${meta.currency || 'USD'} ${meta.amount?.toFixed(2) || '0.00'}\n\n💰 Your earnings have been updated.`
        : `💳 Payment received!\n\n**Student:** ${meta.userName || 'User'}\n**Course:** ${meta.courseName || 'Unknown'}\n**Amount:** ${meta.currency || 'USD'} ${meta.amount?.toFixed(2) || '0.00'}\n**Invoice:** ${meta.invoiceNumber || 'N/A'}\n\nTrack in payment dashboard.`,
      actionText: meta.userId 
        ? 'Start Learning'
        : meta.instructorId
        ? 'View Earnings'
        : 'View Payment',
      actionUrl: meta.userId
        ? `/dashboard/learn/${meta.courseId}`
        : meta.instructorId
        ? '/instructor/earnings'
        : (meta.invoiceId ? `/admin/invoices?invoiceId=${meta.invoiceId}` : undefined)
    }),

    // Payout Notifications
    PAYOUT_REQUESTED: (meta) => ({
      icon: '💰',
      color: 'purple',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/50',
      title: 'Payout Request',
      message: `💰 New payout request received!\n\n**Instructor:** ${meta.instructorName || 'Instructor'}\n**Amount:** ${meta.currency || 'USD'} ${meta.amount?.toFixed(2) || '0.00'}\n**Method:** ${meta.method || 'BANK_TRANSFER'}\n\nPlease process the payout.`,
      actionText: 'Process Payout',
      actionUrl: meta.payoutId ? `/admin/payouts?payoutId=${meta.payoutId}` : '/admin/payouts'
    }),

    PAYOUT_COMPLETED: (meta) => ({
      icon: '✅',
      color: 'green',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/50',
      title: 'Payout Completed',
      message: `✅ Your payout has been processed!\n\n**Amount:** ${meta.currency || 'USD'} ${meta.amount?.toFixed(2) || '0.00'}\n**Reference:** ${meta.reference || 'N/A'}\n\n💰 The funds should arrive in your account soon.`,
      actionText: 'View Payout History',
      actionUrl: '/instructor/payouts'
    }),

    // Default template
    DEFAULT: () => ({
      icon: '🔔',
      color: 'gray',
      bgColor: 'bg-gray-500/10',
      borderColor: 'border-gray-500/50',
      title: 'Notification',
      message: 'You have a new notification.',
      actionText: undefined,
      actionUrl: undefined
    })
  }

  const templateFn = templates[type] || templates.DEFAULT
  return templateFn(metadata)
}

/**
 * Format notification message with rich content
 */
export function formatNotificationMessage(
  type: string,
  metadata: any = {},
  defaultTitle: string = '',
  defaultMessage: string = ''
): { title: string; message: string; template: NotificationTemplate } {
  const template = getNotificationTemplate(type, metadata, defaultTitle, defaultMessage)
  
  return {
    title: template.title,
    message: template.message,
    template
  }
}

