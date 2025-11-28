<template>
  <section class="mx-auto max-w-7xl px-3 sm:px-4 py-8">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h1 class="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-navy-200 to-navy-400 bg-clip-text text-transparent">
            Certificates
          </h1>
          <p class="mt-2 text-navy-300">Manage certificates and certificate templates</p>
        </div>
        <div class="flex gap-2">
          <NuxtLink
            to="/admin/courses"
            class="rounded-lg border border-navy-600 bg-navy-800/50 px-4 py-2 text-sm font-medium text-navy-200 hover:bg-navy-700/50 transition-all"
          >
            ← Back to Courses
          </NuxtLink>
          <button
            @click="showTemplateModal = true"
            class="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2 text-sm font-medium text-white hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Create Template
          </button>
        </div>
      </div>
    </div>

    <!-- Issued Certificates -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold text-white mb-4">Issued Certificates</h2>
      <div v-if="certificatesLoading" class="flex items-center justify-center py-20">
        <div class="text-center">
          <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-navy-400 border-r-transparent"></div>
          <p class="mt-4 text-navy-300">Loading certificates...</p>
        </div>
      </div>
      <div v-else-if="certificates.length === 0" class="rounded-2xl border border-navy-700/50 bg-gradient-to-br from-navy-900/80 to-navy-800/40 p-12 text-center">
        <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-navy-800/50">
          <svg class="h-8 w-8 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-white mb-2">No certificates issued yet</h3>
        <p class="text-navy-300">Certificates will appear here once students complete courses and pass exams</p>
      </div>
      <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="cert in certificates"
          :key="cert.id"
          class="group relative overflow-hidden rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6 transition-all hover:border-navy-600 hover:shadow-xl"
        >
          <div class="mb-4 flex items-center justify-between">
            <div class="rounded-lg bg-amber-500/20 p-2 border border-amber-500/30">
              <svg class="h-6 w-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
          </div>
          <h3 class="text-lg font-semibold text-white mb-2">{{ cert.course.name }}</h3>
          <div class="space-y-2 text-sm text-navy-300 mb-4">
            <div class="flex items-center gap-2">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {{ cert.user.name }}
            </div>
            <div class="flex items-center gap-2">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
              #{{ cert.certificateNumber }}
            </div>
            <div class="flex items-center gap-2">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {{ new Date(cert.issuedAt).toLocaleDateString() }}
            </div>
          </div>
          <a
            :href="`/api/certificates/${cert.id}/download`"
            target="_blank"
            class="flex w-full items-center justify-center gap-2 rounded-lg border border-navy-600 bg-navy-800/50 px-4 py-2 text-sm font-medium text-navy-200 hover:bg-navy-700/50 transition-all"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </a>
        </div>
      </div>
    </div>

    <!-- Certificate Templates -->
    <div>
      <h2 class="text-xl font-semibold text-white mb-4">Certificate Templates</h2>
      <div v-if="templatesLoading" class="flex items-center justify-center py-20">
        <div class="text-center">
          <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-navy-400 border-r-transparent"></div>
          <p class="mt-4 text-navy-300">Loading templates...</p>
        </div>
      </div>
      <div v-else-if="templates.length === 0" class="rounded-2xl border border-navy-700/50 bg-gradient-to-br from-navy-900/80 to-navy-800/40 p-12 text-center">
        <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-navy-800/50">
          <svg class="h-8 w-8 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-white mb-2">No templates yet</h3>
        <p class="text-navy-300 mb-6">Create a template to customize certificate designs</p>
        <button
          @click="showTemplateModal = true"
          class="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
        >
          Create Template
        </button>
      </div>
      <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="template in templates"
          :key="template.id"
          class="group relative overflow-hidden rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6 transition-all hover:border-navy-600 hover:shadow-xl"
        >
          <div class="mb-4 flex items-center justify-between">
            <div class="rounded-lg bg-blue-500/20 p-2 border border-blue-500/30">
              <svg class="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <h3 class="text-lg font-semibold text-white mb-2">{{ template.name }}</h3>
          <p v-if="template.course" class="text-sm text-navy-300 mb-4">
            Course: {{ template.course.name }}
          </p>
          <p v-else class="text-sm text-navy-300 mb-4">All Courses</p>
          <div class="flex gap-2">
            <button
              @click="editTemplate(template)"
              class="flex-1 rounded-lg border border-navy-600 bg-navy-800/50 px-4 py-2 text-sm font-medium text-navy-200 hover:bg-navy-700/50 transition-all"
            >
              Edit
            </button>
            <button
              @click="deleteTemplate(template.id)"
              class="rounded-lg border border-red-700/50 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-all"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Template Modal -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showTemplateModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        @click.self="showTemplateModal = false"
      >
        <div class="w-full max-w-2xl rounded-2xl border border-navy-700/50 bg-gradient-to-br from-navy-900/95 to-navy-800/95 p-6 shadow-2xl">
          <div class="mb-6 flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold text-white">Create Certificate Template</h2>
              <p class="mt-1 text-sm text-navy-300">Configure a new certificate template</p>
            </div>
            <button
              @click="showTemplateModal = false"
              class="rounded-lg p-2 hover:bg-navy-800/50 transition-colors"
            >
              <svg class="h-5 w-5 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="saveTemplate" class="space-y-5">
            <div>
              <label class="mb-2 block text-sm font-medium text-navy-200">Template Name *</label>
              <input
                v-model="templateForm.name"
                type="text"
                required
                placeholder="e.g., Standard Certificate"
                class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
              />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-navy-200">Course (optional)</label>
              <select
                v-model="templateForm.courseId"
                class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
              >
                <option value="">All Courses</option>
                <option v-for="course in courses" :key="course.id" :value="course.id">
                  {{ course.name }}
                </option>
              </select>
            </div>
            <div class="rounded-lg border border-navy-700/50 bg-navy-800/30 p-4">
              <p class="text-sm text-navy-300">
                <strong class="text-navy-200">Note:</strong> Certificate design customization will be available in a future update.
              </p>
            </div>
            <div class="flex gap-3 justify-end pt-4 border-t border-navy-700/50">
              <button
                type="button"
                @click="showTemplateModal = false"
                class="rounded-lg border border-navy-700 bg-navy-800/50 px-5 py-2.5 text-sm font-medium text-navy-200 hover:bg-navy-700/50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="savingTemplate"
                class="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <span v-if="savingTemplate" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                {{ savingTemplate ? 'Creating...' : 'Create Template' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
const { data: certificates, refresh: refreshCertificates, pending: certificatesLoading } = await useFetch('/api/admin/certificates')
const { data: templates, refresh: refreshTemplates, pending: templatesLoading } = await useFetch('/api/admin/certificates/templates')
const { data: courses } = await useFetch('/api/admin/courses')

const showTemplateModal = ref(false)
const savingTemplate = ref(false)

const templateForm = ref({
  name: '',
  courseId: '',
  design: {},
  variables: {}
})

const saveTemplate = async () => {
  try {
    savingTemplate.value = true
    await $fetch('/api/admin/certificates/templates', {
      method: 'POST',
      body: templateForm.value
    })
    showTemplateModal.value = false
    templateForm.value = { name: '', courseId: '', design: {}, variables: {} }
    await refreshTemplates()
  } catch (error: any) {
    alert(error.data?.message || 'Failed to create template')
  } finally {
    savingTemplate.value = false
  }
}

const editTemplate = (template: any) => {
  alert('Template editing will be available in a future update')
}

const deleteTemplate = async (id: string) => {
  if (!confirm('Are you sure you want to delete this template?')) return
  try {
    await $fetch(`/api/admin/certificates/templates/${id}`, {
      method: 'DELETE'
    })
    await refreshTemplates()
  } catch (error: any) {
    alert(error.data?.message || 'Failed to delete template')
  }
}
</script>
