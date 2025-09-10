<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Teleport to="body">
    <!-- portals for modals etc -->
  </Teleport>
  <div id="whatsapp" class="fixed bottom-6 right-6 z-50">
    <a
      href="https://wa.me/263778456168"
      target="_blank"
      rel="noopener"
      class="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
      aria-label="Chat on WhatsApp"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-6 w-6">
        <path d="M20.52 3.48A11.94 11.94 0 0012 0C5.37 0 0 5.37 0 12c0 2.11.55 4.13 1.6 5.93L0 24l6.2-1.62A11.94 11.94 0 0012 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52zM12 22a9.94 9.94 0 01-5.1-1.41l-.36-.21-3.64.95.97-3.54-.23-.37A9.94 9.94 0 012 12C2 6.49 6.49 2 12 2s10 4.49 10 10-4.49 10-10 10zm5.45-7.37c-.3-.15-1.77-.87-2.05-.96-.27-.1-.47-.15-.68.15-.2.3-.78.96-.95 1.15-.17.2-.35.22-.65.08-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.46.13-.6.13-.12.3-.3.45-.45.15-.15.2-.25.3-.42.1-.17.05-.32-.02-.45-.08-.15-.68-1.65-.93-2.27-.24-.58-.48-.5-.68-.5h-.58c-.2 0-.45.07-.68.34-.23.27-.9.88-.9 2.15s.93 2.5 1.05 2.67c.13.17 1.82 2.77 4.4 3.88.62.27 1.1.43 1.47.55.62.2 1.18.17 1.62.1.5-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z"/>
      </svg>
    </a>
  </div>
</template>

<script setup lang="ts"></script>

<style>
@import url('./assets/css/tailwind.css');
</style>

