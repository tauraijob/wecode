<template>
  <form @submit.prevent="onSubmit" class="grid gap-6">
    <!-- Contact Info -->
    <div class="grid gap-4 sm:grid-cols-2">
      <div>
        <label class="block text-gray-900 font-semibold mb-2">Parent/Guardian Name</label>
        <input v-model="form.parentName" required placeholder="John Smith" class="w-full rounded-lg bg-white border-2 border-amber-200 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none" />
      </div>
      <div>
        <label class="block text-gray-900 font-semibold mb-2">Student Name</label>
        <input v-model="form.studentName" required placeholder="Jane Smith" class="w-full rounded-lg bg-white border-2 border-amber-200 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none" />
      </div>
      <div>
        <label class="block text-gray-900 font-semibold mb-2">Email</label>
        <input v-model="form.email" type="email" required placeholder="[email protected]" class="w-full rounded-lg bg-white border-2 border-amber-200 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none" />
      </div>
      <div>
        <label class="block text-gray-900 font-semibold mb-2">Phone / WhatsApp</label>
        <input v-model="form.phone" required placeholder="+263778456168" class="w-full rounded-lg bg-white border-2 border-amber-200 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none" />
      </div>
    </div>

    <!-- Student Details -->
    <div class="grid gap-4 sm:grid-cols-3">
      <div>
        <label class="block text-gray-900 font-semibold mb-2">Student Age</label>
        <input v-model.number="form.age" type="number" min="5" max="18" required class="w-full rounded-lg bg-white border-2 border-amber-200 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none" />
      </div>
      <div>
        <label class="block text-gray-900 font-semibold mb-2">Grade Level</label>
        <select v-model="form.grade" class="w-full rounded-lg bg-white border-2 border-amber-200 px-4 py-2.5 text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none">
          <option value="">Select grade</option>
          <option value="1-3">Grade 1-3</option>
          <option value="4-7">Grade 4-7</option>
          <option value="form1-2">Form 1-2</option>
          <option value="form3-4">Form 3-4</option>
          <option value="form5-6">Form 5-6</option>
        </select>
      </div>
      <div>
        <label class="block text-gray-900 font-semibold mb-2">Preferred Program</label>
        <select v-model="form.program" class="w-full rounded-lg bg-white border-2 border-amber-200 px-4 py-2.5 text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none">
          <option value="">Select program</option>
          <option value="coding">Coding Basics</option>
          <option value="robotics">Robotics</option>
          <option value="web-dev">Web Development</option>
          <option value="game-dev">Game Development</option>
          <option value="ai">AI & Machine Learning</option>
        </select>
      </div>
    </div>

    <!-- Message -->
    <div>
      <label class="block text-gray-900 font-semibold mb-2">Message / Questions</label>
      <textarea v-model="form.message" rows="4" placeholder="Tell us about your child's interests and what you'd like to learn..." class="w-full rounded-lg bg-white border-2 border-amber-200 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none resize-none"></textarea>
    </div>

    <!-- Submit -->
    <div class="flex items-center justify-end">
      <button :disabled="submitting" type="submit" class="rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-3 font-semibold text-white shadow-lg hover:shadow-xl hover:from-primary-700 hover:to-primary-800 transition-all disabled:opacity-50">
        {{ submitting ? 'Submitting...' : 'Submit Request' }}
      </button>
    </div>

    <div v-if="successMsg" class="rounded-xl border-2 border-green-500 bg-green-50 px-4 py-3 text-sm text-green-900 font-medium">
      {{ successMsg }}
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const form = reactive({
  parentName: '',
  studentName: '',
  email: '',
  phone: '',
  age: 10,
  grade: '',
  program: '',
  message: ''
})

const submitting = ref(false)
const successMsg = ref('')

async function onSubmit() {
  submitting.value = true
  successMsg.value = ''
  try {
    // TODO: Create API endpoint for individual requests
    await new Promise(resolve => setTimeout(resolve, 1000))
    successMsg.value = "Thank you! We'll get back to you within 24 hours."
    
    // Reset form
    Object.assign(form, {
      parentName: '',
      studentName: '',
      email: '',
      phone: '',
      age: 10,
      grade: '',
      program: '',
      message: ''
    })
  } catch (e) {
    successMsg.value = 'Failed to submit. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>
