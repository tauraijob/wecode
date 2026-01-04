<template>
  <section class="mx-auto max-w-7xl px-3 sm:px-4 py-8">
    <div class="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-navy-200 to-navy-400 bg-clip-text text-transparent">
          Notifications
        </h1>
        <p class="mt-1 sm:mt-2 text-sm sm:text-base text-navy-300">View and manage all your notifications</p>
      </div>
      <button
        v-if="unreadCount > 0"
        @click="markAllAsRead"
        :disabled="markingAll"
        class="rounded-lg border border-navy-600 bg-navy-800/50 px-4 py-2 text-sm font-medium text-white hover:bg-navy-700/50 transition-colors disabled:opacity-50 self-start sm:self-auto"
      >
        {{ markingAll ? 'Marking...' : 'Mark All as Read' }}
      </button>
    </div>

    <div v-if="loading" class="text-center py-20">
      <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-navy-400 border-r-transparent"></div>
    </div>

    <div v-else-if="notifications.length === 0" class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-12 text-center">
      <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-navy-800/50">
        <svg class="h-8 w-8 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-white mb-2">No notifications</h3>
      <p class="text-navy-300">You're all caught up!</p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        @click="handleNotificationClick(notification)"
        :class="[
          !notification.read ? getTemplate(notification.type).borderColor : 'border-navy-700/50',
          !notification.read ? getTemplate(notification.type).bgColor : 'bg-navy-800/60'
        ]"
        class="rounded-xl border p-6 cursor-pointer hover:bg-navy-800/80 transition-all shadow-lg hover:shadow-xl"
      >
        <div class="flex items-start gap-4">
          <div
            :class="getTemplate(notification.type).iconBgColor"
            class="rounded-lg p-3 text-2xl flex-shrink-0"
          >
            {{ getTemplate(notification.type).icon }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1">
                <h3 :class="{ 'font-semibold': !notification.read, 'font-medium': notification.read }" class="text-lg text-white mb-2">
                  {{ notification.title }}
                </h3>
                <div class="mt-2 text-sm text-navy-300 whitespace-pre-wrap leading-relaxed" v-html="formatMessage(notification.message)"></div>
                <div v-if="getActionUrl(notification)" class="mt-4">
                  <NuxtLink
                    :to="getActionUrl(notification)!"
                    @click.stop
                    class="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-accent-500 to-emerald-600 px-4 py-2 text-sm font-medium text-white hover:from-accent-600 hover:to-emerald-700 transition-all"
                  >
                    <span>{{ getActionText(notification) || 'View Details' }}</span>
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </NuxtLink>
                </div>
                <p class="mt-4 text-xs text-navy-500">
                  {{ formatTime(notification.createdAt) }}
                </p>
              </div>
              <div v-if="!notification.read" class="h-3 w-3 rounded-full bg-blue-500 flex-shrink-0 mt-1"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const { getTemplate, formatMessage, getActionUrl, getActionText } = useNotificationTemplates()

const { data: notificationsData, refresh, pending: loading } = await useFetch('/api/admin/notifications')
const notifications = computed(() => notificationsData.value?.notifications || [])
const unreadCount = computed(() => notificationsData.value?.unreadCount || 0)
const markingAll = ref(false)

function formatTime(date: string | Date) {
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`
  return d.toLocaleDateString()
}

async function handleNotificationClick(notification: any) {
  if (!notification.read) {
    try {
      await $fetch(`/api/admin/notifications/${notification.id}/read`, {
        method: 'POST'
      })
      await refresh()
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  // Navigate based on action URL if available
  const actionUrl = getActionUrl(notification)
  if (actionUrl) {
    await navigateTo(actionUrl)
  }
}

async function markAllAsRead() {
  try {
    markingAll.value = true
    await $fetch('/api/admin/notifications/read-all', {
      method: 'POST'
    })
    await refresh()
  } catch (error) {
    console.error('Failed to mark all as read:', error)
    alert('Failed to mark all notifications as read')
  } finally {
    markingAll.value = false
  }
}
</script>



