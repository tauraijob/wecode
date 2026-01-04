<template>
  <div class="bg-cream-50 min-h-screen">
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-b from-cream-50 to-surface-50 py-16 sm:py-20">
      <div class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_50%_at_20%_-10%,rgba(30,58,95,0.08),transparent)]"></div>
      <div class="mx-auto max-w-7xl px-4 sm:px-6">
        <div class="text-center max-w-3xl mx-auto">
          <span class="inline-flex items-center gap-2 rounded-full bg-primary-50 border border-primary-200 px-4 py-1.5 text-xs font-medium text-primary-700">
            <span class="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
            Get in Touch
          </span>
          <h1 class="mt-6 text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
            Contact <span class="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">Us</span>
          </h1>
          <p class="mt-6 text-lg text-gray-600 leading-relaxed">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </div>
    </section>

    <!-- Contact Info & Form -->
    <section class="py-12 sm:py-16">
      <div class="mx-auto max-w-7xl px-4 sm:px-6">
        <div class="grid gap-12 lg:grid-cols-2">
          <!-- Contact Info -->
          <div>
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
            <p class="text-gray-600 mb-8">
              We're here to help and answer any questions you might have. We look forward to hearing from you!
            </p>
            
            <div class="space-y-6">
              <!-- WhatsApp -->
              <div class="flex items-start gap-4">
                <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 flex-shrink-0">
                  <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900">WhatsApp</h3>
                  <a href="https://wa.me/263778456168" target="_blank" class="text-primary-600 hover:text-primary-700 font-medium">
                    +263 778 456 168
                  </a>
                  <p class="text-sm text-gray-500 mt-1">Available Mon-Fri, 8am-5pm</p>
                </div>
              </div>

              <!-- Email -->
              <div class="flex items-start gap-4">
                <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 flex-shrink-0">
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900">Email</h3>
                  <a href="mailto:info@wecodezw.com" class="text-primary-600 hover:text-primary-700 font-medium">
                    info@wecodezw.com
                  </a>
                  <p class="text-sm text-gray-500 mt-1">We'll respond within 24 hours</p>
                </div>
              </div>

              <!-- Location -->
              <div class="flex items-start gap-4">
                <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100 text-accent-600 flex-shrink-0">
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900">Location</h3>
                  <p class="text-gray-600">Harare, Zimbabwe</p>
                  <p class="text-sm text-gray-500 mt-1">Serving clients nationwide</p>
                </div>
              </div>
            </div>

            <!-- Social Links -->
            <div class="mt-10 pt-8 border-t border-cream-200">
              <h3 class="font-semibold text-gray-900 mb-4">Follow Us</h3>
              <div class="flex gap-4">
                <a href="#" class="flex h-10 w-10 items-center justify-center rounded-lg bg-cream-100 text-gray-600 hover:bg-primary-100 hover:text-primary-600 transition-colors">
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" class="flex h-10 w-10 items-center justify-center rounded-lg bg-cream-100 text-gray-600 hover:bg-primary-100 hover:text-primary-600 transition-colors">
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
                <a href="#" class="flex h-10 w-10 items-center justify-center rounded-lg bg-cream-100 text-gray-600 hover:bg-primary-100 hover:text-primary-600 transition-colors">
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
            </div>
          </div>

          <!-- Contact Form -->
          <div class="rounded-2xl bg-white border border-cream-200 shadow-card p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Send a Message</h2>
            <RequestQuickForm />
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Preview -->
    <section class="py-12 sm:py-16 bg-white border-t border-cream-200">
      <div class="mx-auto max-w-4xl px-4 sm:px-6 text-center">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
        <p class="text-gray-600 mb-8">Can't find what you're looking for? Reach out to us directly!</p>
        <div class="grid gap-4 sm:grid-cols-2 text-left">
          <div class="rounded-xl bg-cream-50 border border-cream-200 p-5">
            <h3 class="font-semibold text-gray-900 mb-2">What courses do you offer?</h3>
            <p class="text-sm text-gray-600">We offer courses in web development, programming, cybersecurity, and more. Visit our courses page to see all available options.</p>
          </div>
          <div class="rounded-xl bg-cream-50 border border-cream-200 p-5">
            <h3 class="font-semibold text-gray-900 mb-2">Do you offer corporate training?</h3>
            <p class="text-sm text-gray-600">Yes! We provide tailored training programs for businesses of all sizes. Contact us to discuss your team's needs.</p>
          </div>
          <div class="rounded-xl bg-cream-50 border border-cream-200 p-5">
            <h3 class="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
            <p class="text-sm text-gray-600">We accept payments via PayNow (EcoCash, bank transfers), PayPal, and other methods.</p>
          </div>
          <div class="rounded-xl bg-cream-50 border border-cream-200 p-5">
            <h3 class="font-semibold text-gray-900 mb-2">Can I get a certificate?</h3>
            <p class="text-sm text-gray-600">Yes, upon successful completion of a course, you'll receive a digital certificate you can share.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import RequestQuickForm from '@/components/requests/RequestQuickForm.vue'

useHead({
  title: 'Contact Us - WeCodeZW',
  meta: [
    { name: 'description', content: 'Get in touch with WeCodeZW. Contact us via WhatsApp, email, or send us a message. We\'re here to help with your technology training and IT service needs.' }
  ]
})
</script>
