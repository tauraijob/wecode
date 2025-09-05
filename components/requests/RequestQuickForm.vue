<template>
  <form @submit.prevent="onSubmit" class="mt-8 grid gap-4 rounded-xl border border-navy-800 bg-navy-900/40 p-6">
    <div class="grid gap-4 md:grid-cols-2">
      <div class="grid gap-2">
        <UiLabel class="text-navy-200">Full name</UiLabel>
        <UiInput v-model="form.fullName" required placeholder="Jane Doe" class="bg-navy-900 border-navy-700 placeholder-navy-400" />
      </div>
      <div class="grid gap-2">
        <UiLabel class="text-navy-200">Email</UiLabel>
        <UiInput v-model="form.email" type="email" required placeholder="[email protected]" class="bg-navy-900 border-navy-700 placeholder-navy-400" />
      </div>
    </div>
    <div class="grid gap-4 md:grid-cols-2">
      <div class="grid gap-2">
        <UiLabel class="text-navy-200">Client type</UiLabel>
        <UiSelect v-model="form.clientType" class="bg-navy-900 border-navy-700 text-white">
          <option value="individual">Individual / Student</option>
          <option value="corporate">Corporate / Organization</option>
          <option value="school">School / Club</option>
        </UiSelect>
      </div>
      <div class="grid gap-2">
        <UiLabel class="text-navy-200">Phone / WhatsApp</UiLabel>
        <UiInput v-model="form.phone" placeholder="+27 61 629 1608" class="bg-navy-900 border-navy-700 placeholder-navy-400" />
      </div>
    </div>
    <div class="grid gap-2">
      <UiLabel class="text-navy-200">What do you need?</UiLabel>
      <UiTextarea v-model="form.message" :rows="4" placeholder="Tell us about the training, workshop, or club you need." class="bg-navy-900 border-navy-700 placeholder-navy-400" />
    </div>
    <div class="flex items-center justify-between gap-3">
      <div class="text-sm text-navy-300">We’ll reply within 1 business day.</div>
      <UiButton :disabled="submitting" type="submit" class="bg-navy-400 text-navy-950 hover:bg-navy-300">Submit request</UiButton>
    </div>
    <div v-if="successMsg" class="rounded-md border border-green-600/40 bg-green-900/20 px-3 py-2 text-sm text-green-200 animate-fade-in">{{ successMsg }}</div>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import UiInput from '@/components/ui/Input.vue'
import UiLabel from '@/components/ui/Label.vue'
import UiSelect from '@/components/ui/Select.vue'
import UiTextarea from '@/components/ui/Textarea.vue'
import UiButton from '@/components/ui/Button.vue'

interface RequestForm {
  fullName: string
  email: string
  clientType: 'individual' | 'corporate' | 'school'
  phone?: string
  message?: string
}

const form = reactive<RequestForm>({
  fullName: '',
  email: '',
  clientType: 'individual',
  phone: '',
  message: ''
})

const submitting = ref(false)
const successMsg = ref('')

async function onSubmit() {
  try {
    submitting.value = true
    // For now, just log. Later this will hit an API route.
    console.log('Request submitted', { ...form })
    successMsg.value = 'Request received. We will contact you within 1 business day.'
    form.fullName = ''
    form.email = ''
    form.clientType = 'individual'
    form.phone = ''
    form.message = ''
  } finally {
    submitting.value = false
  }
}
</script>

