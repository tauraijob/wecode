<template>
  <section class="mx-auto max-w-7xl px-3 sm:px-4 py-8">
    <!-- Header -->
    <div class="mb-6 sm:mb-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h1 class="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-navy-200 to-navy-400 bg-clip-text text-transparent">
            Certificates
          </h1>
          <p class="mt-1 sm:mt-2 text-sm sm:text-base text-navy-300">Manage certificate templates and view issued certificates</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <NuxtLink
            to="/admin/courses"
            class="rounded-lg border border-navy-600 bg-navy-800/50 px-3 sm:px-4 py-2 text-sm font-medium text-navy-200 hover:bg-navy-700/50 transition-all"
          >
            ← Back
          </NuxtLink>
          <button
            @click="openIssueModal"
            class="rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 px-3 sm:px-5 py-2 text-sm font-medium text-white hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            <span class="hidden sm:inline">Issue Certificate</span>
            <span class="sm:hidden">Issue</span>
          </button>
          <button
            @click="openCreateModal"
            class="rounded-lg bg-gradient-to-r from-accent-500 to-emerald-600 px-3 sm:px-5 py-2 text-sm font-medium text-white hover:from-accent-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span class="hidden sm:inline">Create Template</span>
            <span class="sm:hidden">Create</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <div class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6">
        <div class="flex items-center gap-3 mb-2">
          <div class="rounded-lg bg-amber-500/20 p-2 border border-amber-500/30">
            <svg class="h-5 w-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <div>
            <p class="text-2xl font-bold text-white">{{ certificates?.length || 0 }}</p>
            <p class="text-sm text-navy-300">Certificates Issued</p>
          </div>
        </div>
      </div>
      <div class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6">
        <div class="flex items-center gap-3 mb-2">
          <div class="rounded-lg bg-blue-500/20 p-2 border border-blue-500/30">
            <svg class="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p class="text-2xl font-bold text-white">{{ templates?.length || 0 }}</p>
            <p class="text-sm text-navy-300">Templates</p>
          </div>
        </div>
      </div>
      <div class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6">
        <div class="flex items-center gap-3 mb-2">
          <div class="rounded-lg bg-green-500/20 p-2 border border-green-500/30">
            <svg class="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-2xl font-bold text-white">{{ courses?.length || 0 }}</p>
            <p class="text-sm text-navy-300">Courses Available</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Certificate Templates Section -->
    <div class="mb-10">
      <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <svg class="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Certificate Templates
      </h2>
      
      <div v-if="templatesLoading" class="flex items-center justify-center py-12">
        <div class="text-center">
          <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-navy-400 border-r-transparent"></div>
          <p class="mt-4 text-navy-300">Loading templates...</p>
        </div>
      </div>
      
      <div v-else-if="templates?.length === 0" class="rounded-2xl border border-navy-700/50 bg-gradient-to-br from-navy-900/80 to-navy-800/40 p-12 text-center">
        <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-navy-800/50">
          <svg class="h-8 w-8 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-white mb-2">No templates yet</h3>
        <p class="text-navy-300 mb-6">Create a certificate template to get started</p>
        <button
          @click="openCreateModal"
          class="rounded-lg bg-gradient-to-r from-accent-500 to-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:from-accent-600 hover:to-emerald-700 transition-all shadow-lg"
        >
          Create Your First Template
        </button>
      </div>
      
      <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="template in templates"
          :key="template.id"
          class="group relative overflow-hidden rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 transition-all hover:border-navy-600 hover:shadow-xl"
        >
          <!-- Preview Thumbnail -->
          <div class="p-4 border-b border-navy-700/30">
            <div class="rounded-lg overflow-hidden shadow-lg">
              <CertificatePreview
                :design="template.design || {}"
                student-name="Sample Student"
                :course-title="template.course?.name || 'Course Title'"
                :date-of-completion="new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })"
                certificate-number="CERT-SAMPLE"
              />
            </div>
          </div>
          
          <!-- Template Info -->
          <div class="p-4">
            <h3 class="text-lg font-semibold text-white mb-2">{{ template.name }}</h3>
            <p class="text-sm text-navy-300 mb-4">
              {{ template.course ? `For: ${template.course.name}` : 'All Courses' }}
            </p>
            <div class="flex gap-2">
              <button
                @click="previewTemplate(template)"
                class="flex-1 rounded-lg border border-navy-600 bg-navy-800/50 px-4 py-2 text-sm font-medium text-navy-200 hover:bg-navy-700/50 transition-all flex items-center justify-center gap-2"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Preview
              </button>
              <button
                @click="editTemplate(template)"
                class="rounded-lg border border-blue-600/50 bg-blue-500/10 px-3 py-2 text-sm font-medium text-blue-400 hover:bg-blue-500/20 transition-all"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                @click="deleteTemplate(template.id)"
                class="rounded-lg border border-red-700/50 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-all"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Issued Certificates Section -->
    <div>
      <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <svg class="h-5 w-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
        Issued Certificates ({{ certificates?.length || 0 }})
      </h2>
      
      <div v-if="certificatesLoading" class="flex items-center justify-center py-12">
        <div class="text-center">
          <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-navy-400 border-r-transparent"></div>
          <p class="mt-4 text-navy-300">Loading certificates...</p>
        </div>
      </div>
      
      <div v-else-if="certificates?.length === 0" class="rounded-2xl border border-navy-700/50 bg-gradient-to-br from-navy-900/80 to-navy-800/40 p-12 text-center">
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {{ cert.user.email }}
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
          <div class="flex gap-2">
            <button
              @click="viewCertificate(cert)"
              class="flex-1 rounded-lg border border-navy-600 bg-navy-800/50 px-4 py-2 text-sm font-medium text-navy-200 hover:bg-navy-700/50 transition-all flex items-center justify-center gap-2"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View
            </button>
            <a
              :href="`/api/certificates/${cert.id}/download`"
              target="_blank"
              class="rounded-lg border border-green-600/50 bg-green-500/10 px-3 py-2 text-sm font-medium text-green-400 hover:bg-green-500/20 transition-all flex items-center gap-1"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </a>
            <button
              @click="openDeleteCertificateModal(cert.id)"
              class="rounded-lg border border-red-700/50 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-all flex items-center gap-1"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Template Modal -->
    <Transition
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
        <div class="w-full max-w-5xl rounded-2xl border border-navy-700/50 bg-gradient-to-br from-navy-900/95 to-navy-800/95 shadow-2xl max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-navy-700/50">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-bold text-white">{{ isEditMode ? 'Edit Certificate Template' : 'Create Certificate Template' }}</h2>
                <p class="mt-1 text-sm text-navy-300">{{ isEditMode ? 'Update your certificate template design' : 'Design a beautiful certificate for your learners' }}</p>
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
          </div>

          <div class="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Form -->
            <div class="space-y-5">
              <div>
                <label class="mb-2 block text-sm font-medium text-navy-200">Template Name *</label>
                <input
                  v-model="templateForm.name"
                  type="text"
                  required
                  placeholder="e.g., Professional Certificate"
                  class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
                />
              </div>
              
              <div>
                <label class="mb-2 block text-sm font-medium text-navy-200">Assign to Course (optional)</label>
                <select
                  v-model="templateForm.courseId"
                  class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
                >
                  <option value="">All Courses (Default Template)</option>
                  <option v-for="course in courses" :key="course.id" :value="course.id">
                    {{ course.name }}
                  </option>
                </select>
              </div>

              <div class="border-t border-navy-700/50 pt-5">
                <h3 class="text-lg font-semibold text-white mb-4">Design Customization</h3>
                
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="mb-2 block text-sm font-medium text-navy-200">Border Color</label>
                    <div class="flex gap-2">
                      <input
                        v-model="templateForm.design.borderColor"
                        type="color"
                        class="h-10 w-16 rounded-lg border border-navy-700 bg-navy-800/50 cursor-pointer"
                      />
                      <input
                        v-model="templateForm.design.borderColor"
                        type="text"
                        placeholder="#b45309"
                        class="flex-1 rounded-lg border border-navy-700 bg-navy-800/50 px-3 py-2 text-sm text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label class="mb-2 block text-sm font-medium text-navy-200">Text Color</label>
                    <div class="flex gap-2">
                      <input
                        v-model="templateForm.design.textColor"
                        type="color"
                        class="h-10 w-16 rounded-lg border border-navy-700 bg-navy-800/50 cursor-pointer"
                      />
                      <input
                        v-model="templateForm.design.textColor"
                        type="text"
                        placeholder="#1e3a5f"
                        class="flex-1 rounded-lg border border-navy-700 bg-navy-800/50 px-3 py-2 text-sm text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div class="mt-4">
                  <label class="mb-2 block text-sm font-medium text-navy-200">Logo URL (optional)</label>
                  <input
                    v-model="templateForm.design.logoUrl"
                    type="url"
                    placeholder="https://example.com/logo.png"
                    class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
                  />
                </div>

                <div class="mt-4">
                  <label class="mb-2 block text-sm font-medium text-navy-200">Title Font</label>
                  <select
                    v-model="templateForm.design.titleFont"
                    class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
                  >
                    <option value="Georgia, serif">Georgia (Classic)</option>
                    <option value="'Times New Roman', serif">Times New Roman</option>
                    <option value="'Playfair Display', serif">Playfair Display</option>
                    <option value="'Merriweather', serif">Merriweather</option>
                    <option value="system-ui, sans-serif">Modern Sans</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Live Preview -->
            <div>
              <label class="mb-2 block text-sm font-medium text-navy-200">Live Preview</label>
              <div class="rounded-lg overflow-hidden shadow-2xl border border-navy-600">
                <CertificatePreview
                  :design="templateForm.design"
                  student-name="John Doe"
                  :course-title="selectedCourseName"
                  :date-of-completion="new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })"
                  certificate-number="CERT-2024-001"
                />
              </div>
              <p class="mt-2 text-xs text-navy-400 text-center">This is how the certificate will look for learners</p>
            </div>
          </div>

          <div class="p-6 border-t border-navy-700/50 flex gap-3 justify-end">
            <button
              type="button"
              @click="showTemplateModal = false"
              class="rounded-lg border border-navy-700 bg-navy-800/50 px-5 py-2.5 text-sm font-medium text-navy-200 hover:bg-navy-700/50 transition-all"
            >
              Cancel
            </button>
            <button
              @click="saveTemplate"
              :disabled="savingTemplate || !templateForm.name"
              class="rounded-lg bg-gradient-to-r from-accent-500 to-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:from-accent-600 hover:to-emerald-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span v-if="savingTemplate" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              {{ savingTemplate ? (isEditMode ? 'Saving...' : 'Creating...') : (isEditMode ? 'Save Changes' : 'Create Template') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Preview Modal -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showPreviewModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        @click.self="showPreviewModal = false"
      >
        <div class="w-full max-w-4xl">
          <div class="flex justify-between items-center mb-4">
            <button
              @click="downloadCertificatePdf"
              :disabled="isDownloading"
              class="rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg disabled:opacity-50 flex items-center gap-2"
            >
              <span v-if="isDownloading" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {{ isDownloading ? 'Generating PDF...' : 'Download PDF' }}
            </button>
            <button
              @click="showPreviewModal = false"
              class="rounded-full bg-white/10 p-2 hover:bg-white/20 transition-colors"
            >
              <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div ref="certificatePreviewRef" class="rounded-lg overflow-hidden shadow-2xl">
            <CertificatePreview
              :design="previewData.design"
              :student-name="previewData.studentName"
              :course-title="previewData.courseTitle"
              :date-of-completion="previewData.dateOfCompletion"
              :certificate-number="previewData.certificateNumber"
            />
          </div>
        </div>
      </div>
    </Transition>

    <!-- Delete Template Confirm Modal -->
    <ConfirmModal
      v-model:is-open="showDeleteModal"
      title="Delete Template"
      message="Are you sure you want to delete this template? This action cannot be undone."
      type="danger"
      confirm-text="Delete Template"
      cancel-text="Cancel"
      @confirm="confirmDeleteTemplate"
    />

    <!-- Delete Certificate Confirm Modal -->
    <ConfirmModal
      v-model:is-open="showDeleteCertificateModal"
      title="Delete Certificate"
      message="Are you sure you want to delete this certificate? The student will lose their certificate record. This action cannot be undone."
      type="danger"
      confirm-text="Delete Certificate"
      cancel-text="Cancel"
      @confirm="confirmDeleteCertificate"
    />

    <!-- Issue Certificate Modal -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showIssueModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        @click.self="showIssueModal = false"
      >
        <div class="w-full max-w-3xl rounded-2xl border border-navy-700/50 bg-gradient-to-br from-navy-900/95 to-navy-800/95 shadow-2xl max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-navy-700/50">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-bold text-white">Issue Certificates</h2>
                <p class="mt-1 text-sm text-navy-300">Manually issue certificates to students</p>
              </div>
              <button
                @click="showIssueModal = false"
                class="rounded-lg p-2 hover:bg-navy-800/50 transition-colors"
              >
                <svg class="h-5 w-5 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div class="p-6">
            <!-- Course Filter -->
            <div class="mb-4">
              <label class="mb-2 block text-sm font-medium text-navy-200">Filter by Course</label>
              <select
                v-model="issueFilter.courseId"
                class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
              >
                <option value="">All Courses</option>
                <option v-for="course in courses" :key="course.id" :value="course.id">
                  {{ course.name }}
                </option>
              </select>
            </div>

            <!-- Template Selection -->
            <div class="mb-4">
              <label class="mb-2 block text-sm font-medium text-navy-200">Certificate Template</label>
              <select
                v-model="issueForm.templateId"
                class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
              >
                <option value="">Auto-select (Default Template)</option>
                <option v-for="template in templates" :key="template.id" :value="template.id">
                  {{ template.name }} {{ template.course ? `(${template.course.name})` : '(All Courses)' }}
                </option>
              </select>
            </div>

            <!-- Enrollment Selection -->
            <div class="mb-4">
              <div class="flex items-center justify-between mb-2">
                <label class="text-sm font-medium text-navy-200">Select Enrollments</label>
                <div class="flex gap-2">
                  <button
                    @click="selectAllEnrollments"
                    class="text-xs text-blue-400 hover:text-blue-300"
                  >
                    Select All
                  </button>
                  <span class="text-navy-500">|</span>
                  <button
                    @click="clearEnrollmentSelection"
                    class="text-xs text-red-400 hover:text-red-300"
                  >
                    Clear
                  </button>
                </div>
              </div>
              
              <div v-if="eligibleEnrollmentsLoading" class="text-center py-8">
                <div class="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-navy-400 border-r-transparent"></div>
              </div>
              
              <div v-else-if="filteredEligibleEnrollments.length === 0" class="text-center py-8 text-navy-400">
                <svg class="h-12 w-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>No eligible enrollments found</p>
                <p class="text-sm mt-1">All enrollments already have certificates or no enrollments exist</p>
              </div>
              
              <div v-else class="max-h-64 overflow-y-auto rounded-lg border border-navy-700/50 bg-navy-900/40">
                <label
                  v-for="enrollment in filteredEligibleEnrollments"
                  :key="enrollment.id"
                  class="flex items-center gap-3 p-3 hover:bg-navy-800/50 cursor-pointer border-b border-navy-700/30 last:border-0"
                >
                  <input
                    type="checkbox"
                    v-model="selectedEnrollments"
                    :value="enrollment.id"
                    class="h-4 w-4 rounded border-navy-600 bg-navy-800 text-amber-500 focus:ring-amber-500"
                  />
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-white truncate">{{ enrollment.user.name }}</p>
                    <p class="text-xs text-navy-400 truncate">{{ enrollment.user.email }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-xs font-medium text-navy-200 truncate">{{ enrollment.course.name }}</p>
                    <span
                      :class="{
                        'text-green-400': enrollment.status === 'COMPLETED',
                        'text-blue-400': enrollment.status === 'ACTIVE',
                        'text-amber-400': enrollment.status === 'PENDING'
                      }"
                      class="text-xs"
                    >
                      {{ enrollment.status }}
                    </span>
                  </div>
                </label>
              </div>
              
              <p class="mt-2 text-xs text-navy-400">
                {{ selectedEnrollments.length }} enrollment(s) selected
              </p>
            </div>
          </div>

          <div class="p-6 border-t border-navy-700/50 flex gap-3 justify-end">
            <button
              type="button"
              @click="showIssueModal = false"
              class="rounded-lg border border-navy-700 bg-navy-800/50 px-5 py-2.5 text-sm font-medium text-navy-200 hover:bg-navy-700/50 transition-all"
            >
              Cancel
            </button>
            <button
              @click="issueCertificates"
              :disabled="issuingCertificates || selectedEnrollments.length === 0"
              class="rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 px-5 py-2.5 text-sm font-medium text-white hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span v-if="issuingCertificates" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              {{ issuingCertificates ? 'Issuing...' : `Issue ${selectedEnrollments.length} Certificate(s)` }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
const toast = useToast()
const { downloadCertificate: downloadPdf, isGenerating } = useCertificatePdf()

const { data: certificates, refresh: refreshCertificates, pending: certificatesLoading } = await useFetch('/api/admin/certificates')
const { data: templates, refresh: refreshTemplates, pending: templatesLoading } = await useFetch('/api/admin/certificates/templates')
const { data: courses } = await useFetch('/api/admin/courses')
const { data: eligibleEnrollments, refresh: refreshEnrollments, pending: eligibleEnrollmentsLoading } = await useFetch('/api/admin/enrollments')

const certificatePreviewRef = ref<HTMLElement | null>(null)
const isDownloading = ref(false)

const showTemplateModal = ref(false)
const showPreviewModal = ref(false)
const showDeleteModal = ref(false)
const showDeleteCertificateModal = ref(false)
const showIssueModal = ref(false)
const savingTemplate = ref(false)
const issuingCertificates = ref(false)
const templateToDelete = ref<string | null>(null)
const certificateToDelete = ref<string | null>(null)
const editTemplateId = ref<string | null>(null)
const selectedEnrollments = ref<string[]>([])

const isEditMode = computed(() => editTemplateId.value !== null)

const issueFilter = ref({
  courseId: ''
})

const issueForm = ref({
  templateId: ''
})

const templateForm = ref({
  name: '',
  courseId: '',
  design: {
    backgroundColor: '',
    textColor: '#1e3a5f',
    titleFont: 'Georgia, serif',
    bodyFont: '',
    logoUrl: '',
    borderColor: '#b45309'
  },
  variables: {}
})

const previewData = ref({
  design: {},
  studentName: '',
  courseTitle: '',
  dateOfCompletion: '',
  certificateNumber: ''
})

const selectedCourseName = computed(() => {
  if (!templateForm.value.courseId) return 'Course Title'
  const course = courses.value?.find((c: any) => c.id === templateForm.value.courseId)
  return course?.name || 'Course Title'
})

const openCreateModal = () => {
  editTemplateId.value = null
  templateForm.value = {
    name: '',
    courseId: '',
    design: {
      backgroundColor: '',
      textColor: '#1e3a5f',
      titleFont: 'Georgia, serif',
      bodyFont: '',
      logoUrl: '',
      borderColor: '#b45309'
    },
    variables: {}
  }
  showTemplateModal.value = true
}

const editTemplate = (template: any) => {
  editTemplateId.value = template.id
  templateForm.value = {
    name: template.name || '',
    courseId: template.courseId || '',
    design: {
      backgroundColor: template.design?.backgroundColor || '',
      textColor: template.design?.textColor || '#1e3a5f',
      titleFont: template.design?.titleFont || 'Georgia, serif',
      bodyFont: template.design?.bodyFont || '',
      logoUrl: template.design?.logoUrl || '',
      borderColor: template.design?.borderColor || '#b45309'
    },
    variables: template.variables || {}
  }
  showTemplateModal.value = true
}

const saveTemplate = async () => {
  if (!templateForm.value.name) {
    toast.warning('Please enter a template name')
    return
  }
  
  try {
    savingTemplate.value = true
    
    if (isEditMode.value && editTemplateId.value) {
      // Update existing template
      await $fetch(`/api/admin/certificates/templates/${editTemplateId.value}`, {
        method: 'PUT',
        body: templateForm.value
      })
      toast.success('Template updated successfully')
    } else {
      // Create new template
      await $fetch('/api/admin/certificates/templates', {
        method: 'POST',
        body: templateForm.value
      })
      toast.success('Template created successfully')
    }
    
    showTemplateModal.value = false
    editTemplateId.value = null
    await refreshTemplates()
  } catch (error: any) {
    toast.error(error.data?.message || (isEditMode.value ? 'Failed to update template' : 'Failed to create template'))
  } finally {
    savingTemplate.value = false
  }
}

const previewTemplate = (template: any) => {
  previewData.value = {
    design: template.design || {},
    studentName: 'Sample Student',
    courseTitle: template.course?.name || 'Course Title',
    dateOfCompletion: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    certificateNumber: 'CERT-SAMPLE'
  }
  showPreviewModal.value = true
}

const viewCertificate = (cert: any) => {
  previewData.value = {
    design: cert.template?.design || {},
    studentName: cert.user.name,
    courseTitle: cert.course.name,
    dateOfCompletion: new Date(cert.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    certificateNumber: cert.certificateNumber
  }
  showPreviewModal.value = true
}

const downloadCertificatePdf = async () => {
  if (!certificatePreviewRef.value) {
    toast.error('Certificate preview not found')
    return
  }
  
  try {
    isDownloading.value = true
    const filename = `certificate-${previewData.value.certificateNumber || 'download'}.pdf`
    await downloadPdf(certificatePreviewRef.value, filename)
    toast.success('Certificate downloaded successfully')
  } catch (error: any) {
    console.error('Failed to download certificate:', error)
    toast.error('Failed to download certificate')
  } finally {
    isDownloading.value = false
  }
}

const deleteTemplate = (id: string) => {
  templateToDelete.value = id
  showDeleteModal.value = true
}

const confirmDeleteTemplate = async () => {
  if (!templateToDelete.value) return
  try {
    await $fetch(`/api/admin/certificates/templates/${templateToDelete.value}`, {
      method: 'DELETE'
    })
    toast.success('Template deleted successfully')
    await refreshTemplates()
  } catch (error: any) {
    toast.error(error.data?.message || 'Failed to delete template')
  } finally {
    templateToDelete.value = null
  }
}

const openDeleteCertificateModal = (id: string) => {
  certificateToDelete.value = id
  showDeleteCertificateModal.value = true
}

const confirmDeleteCertificate = async () => {
  if (!certificateToDelete.value) return
  try {
    await $fetch(`/api/admin/certificates/${certificateToDelete.value}`, {
      method: 'DELETE'
    })
    toast.success('Certificate deleted successfully')
    await refreshCertificates()
  } catch (error: any) {
    toast.error(error.data?.message || 'Failed to delete certificate')
  } finally {
    certificateToDelete.value = null
  }
}

// Issue Certificate Functions
const filteredEligibleEnrollments = computed(() => {
  if (!eligibleEnrollments.value) return []
  
  // Filter out enrollments that already have certificates
  const certificateEnrollmentIds = new Set(
    (certificates.value || []).map((c: any) => c.enrollmentId)
  )
  
  // Only show COMPLETED enrollments without certificates
  let enrollments = (eligibleEnrollments.value as any[]).filter(
    (e: any) => !certificateEnrollmentIds.has(e.id) && e.status === 'COMPLETED'
  )
  
  // Apply course filter
  if (issueFilter.value.courseId) {
    enrollments = enrollments.filter((e: any) => e.courseId === issueFilter.value.courseId)
  }
  
  return enrollments
})

const openIssueModal = async () => {
  selectedEnrollments.value = []
  issueFilter.value.courseId = ''
  issueForm.value.templateId = ''
  await refreshEnrollments()
  showIssueModal.value = true
}

const selectAllEnrollments = () => {
  selectedEnrollments.value = filteredEligibleEnrollments.value.map((e: any) => e.id)
}

const clearEnrollmentSelection = () => {
  selectedEnrollments.value = []
}

const issueCertificates = async () => {
  if (selectedEnrollments.value.length === 0) {
    toast.warning('Please select at least one enrollment')
    return
  }
  
  try {
    issuingCertificates.value = true
    const result = await $fetch('/api/admin/certificates/issue', {
      method: 'POST',
      body: {
        enrollmentIds: selectedEnrollments.value,
        templateId: issueForm.value.templateId || undefined
      }
    })
    
    if (result.issued > 0) {
      toast.success(`Successfully issued ${result.issued} certificate(s)`)
    }
    if (result.failed > 0) {
      toast.warning(`${result.failed} certificate(s) failed to issue`)
    }
    
    showIssueModal.value = false
    selectedEnrollments.value = []
    await refreshCertificates()
  } catch (error: any) {
    toast.error(error.data?.message || 'Failed to issue certificates')
  } finally {
    issuingCertificates.value = false
  }
}
</script>
