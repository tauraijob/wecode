/**
 * Frontend notification template composable
 * Provides rich formatting and styling for notifications
 */

export interface NotificationTemplate {
  icon: string
  color: string
  bgColor: string
  borderColor: string
  iconBgColor: string
}

const notificationTemplates: Record<string, NotificationTemplate> = {
  // User Registration
  USER_REGISTERED: {
    icon: '👤',
    color: 'blue',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/50',
    iconBgColor: 'bg-blue-500/20'
  },

  // Course Notifications
  COURSE_CREATED: {
    icon: '📚',
    color: 'purple',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/50',
    iconBgColor: 'bg-purple-500/20'
  },

  COURSE_SUBMITTED: {
    icon: '📝',
    color: 'blue',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/50',
    iconBgColor: 'bg-blue-500/20'
  },

  COURSE_APPROVED: {
    icon: '✅',
    color: 'green',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/50',
    iconBgColor: 'bg-green-500/20'
  },

  COURSE_REJECTED: {
    icon: '❌',
    color: 'red',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/50',
    iconBgColor: 'bg-red-500/20'
  },

  // Enrollment Notifications
  ENROLLMENT_CREATED: {
    icon: '🎓',
    color: 'green',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/50',
    iconBgColor: 'bg-green-500/20'
  },

  ENROLLMENT_CANCELLED: {
    icon: '🚫',
    color: 'orange',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/50',
    iconBgColor: 'bg-orange-500/20'
  },

  // Invoice Notifications
  INVOICE_CREATED: {
    icon: '🧾',
    color: 'blue',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/50',
    iconBgColor: 'bg-blue-500/20'
  },

  // Payment Notifications
  PAYMENT_SUCCESS: {
    icon: '💳',
    color: 'green',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/50',
    iconBgColor: 'bg-green-500/20'
  },

  // Payout Notifications
  PAYOUT_REQUESTED: {
    icon: '💰',
    color: 'purple',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/50',
    iconBgColor: 'bg-purple-500/20'
  },

  PAYOUT_COMPLETED: {
    icon: '✅',
    color: 'green',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/50',
    iconBgColor: 'bg-green-500/20'
  }
}

export function useNotificationTemplates() {
  function getTemplate(type: string): NotificationTemplate {
    return notificationTemplates[type] || {
      icon: '🔔',
      color: 'gray',
      bgColor: 'bg-gray-500/10',
      borderColor: 'border-gray-500/50',
      iconBgColor: 'bg-gray-500/20'
    }
  }

  function formatMessage(message: string): string {
    // Convert markdown-style formatting to HTML
    return message
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>')
  }

  function getActionUrl(notification: any): string | null {
    const meta = notification.metadata || {}
    
    switch (notification.type) {
      case 'USER_REGISTERED':
        return meta.userId ? `/admin/users?userId=${meta.userId}` : null
      case 'COURSE_CREATED':
      case 'COURSE_SUBMITTED':
        return meta.courseId ? `/admin/courses/${meta.courseId}` : null
      case 'COURSE_APPROVED':
      case 'COURSE_REJECTED':
        return meta.courseId ? `/instructor/courses/${meta.courseId}` : null
      case 'ENROLLMENT_CREATED':
        if (meta.isFreeCourse && meta.courseId) {
          return `/dashboard/learn/${meta.courseId}`
        }
        if (meta.invoiceNumber) {
          return `/pay/${meta.invoiceNumber}`
        }
        return meta.enrollmentId ? `/admin/courses/enrollments?enrollmentId=${meta.enrollmentId}` : null
      case 'ENROLLMENT_CANCELLED':
        return meta.enrollmentId ? `/admin/courses/enrollments?enrollmentId=${meta.enrollmentId}` : '/courses'
      case 'INVOICE_CREATED':
        return meta.invoiceNumber ? `/admin/invoices?invoiceNumber=${meta.invoiceNumber}` : null
      case 'PAYMENT_SUCCESS':
        if (meta.courseId) {
          return `/dashboard/learn/${meta.courseId}`
        }
        if (meta.invoiceId) {
          return `/admin/invoices?invoiceId=${meta.invoiceId}`
        }
        return '/instructor/earnings'
      case 'PAYOUT_REQUESTED':
        return meta.payoutId ? `/admin/payouts?payoutId=${meta.payoutId}` : '/admin/payouts'
      case 'PAYOUT_COMPLETED':
        return '/instructor/payouts'
      default:
        return null
    }
  }

  function getActionText(notification: any): string | null {
    const meta = notification.metadata || {}
    
    switch (notification.type) {
      case 'USER_REGISTERED':
        return 'View User'
      case 'COURSE_CREATED':
      case 'COURSE_SUBMITTED':
        return 'View Course'
      case 'COURSE_APPROVED':
      case 'COURSE_REJECTED':
        return 'View Course'
      case 'ENROLLMENT_CREATED':
        return meta.isFreeCourse ? 'Start Learning' : 'Complete Payment'
      case 'ENROLLMENT_CANCELLED':
        return 'View Details'
      case 'INVOICE_CREATED':
        return 'View Invoice'
      case 'PAYMENT_SUCCESS':
        return meta.courseId ? 'Start Learning' : 'View Details'
      case 'PAYOUT_REQUESTED':
        return 'Process Payout'
      case 'PAYOUT_COMPLETED':
        return 'View History'
      default:
        return null
    }
  }

  return {
    getTemplate,
    formatMessage,
    getActionUrl,
    getActionText
  }
}

