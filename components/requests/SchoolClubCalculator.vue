<template>
  <form @submit.prevent="onSubmit" class="grid gap-6">
    <!-- Contact Info -->
    <div class="grid gap-4 sm:grid-cols-2">
      <div>
        <label class="block text-gray-900 font-semibold mb-2">School name</label>
        <input v-model="form.schoolName" required placeholder="Example High School" class="w-full rounded-lg bg-white border-2 border-amber-200 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none" />
      </div>
      <div>
        <label class="block text-gray-900 font-semibold mb-2">Contact person</label>
        <input v-model="form.contactName" required placeholder="Jane Doe" class="w-full rounded-lg bg-white border-2 border-amber-200 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none" />
      </div>
      <div>
        <label class="block text-gray-900 font-semibold mb-2">Email</label>
        <input v-model="form.email" type="email" required placeholder="[email protected]" class="w-full rounded-lg bg-white border-2 border-amber-200 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none" />
      </div>
      <div>
        <label class="block text-gray-900 font-semibold mb-2">Phone / WhatsApp</label>
        <input v-model="form.phone" placeholder="+263778456168" class="w-full rounded-lg bg-white border-2 border-amber-200 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none" />
      </div>
    </div>

    <!-- Plan Selection -->
    <div class="grid gap-4 sm:grid-cols-3">
      <div>
        <label class="block text-gray-900 font-semibold mb-2">Level</label>
        <select v-model="form.level" class="w-full rounded-lg bg-white border-2 border-amber-200 px-4 py-2.5 text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none">
          <option value="primary">Primary (Grade 1–7)</option>
          <option value="high">High School (Form 1–6)</option>
        </select>
      </div>
      <div>
        <label class="block text-gray-900 font-semibold mb-2">Plan</label>
        <select v-model="form.planId" class="w-full rounded-lg bg-white border-2 border-amber-200 px-4 py-2.5 text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none">
          <option v-for="p in plans" :key="p.id" :value="p.id">{{ p.name }} — ${{ p.price }}/student/mo (min {{ p.minimumStudents }})</option>
        </select>
      </div>
      <div>
        <label class="block text-gray-900 font-semibold mb-2">Months</label>
        <input v-model.number="form.months" type="number" min="1" required class="w-full rounded-lg bg-white border-2 border-amber-200 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none" />
      </div>
    </div>

    <!-- Students & Training -->
    <div class="grid gap-4 sm:grid-cols-3">
      <div>
        <label class="block text-gray-900 font-semibold mb-2">Students</label>
        <input v-model.number="form.students" type="number" min="1" required class="w-full rounded-lg bg-white border-2 border-amber-200 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none" />
      </div>
      <div>
        <label class="block text-gray-900 font-semibold mb-2">Teacher Training</label>
        <div class="grid grid-cols-1 gap-2">
          <label class="flex items-center justify-between gap-2 rounded-lg border-2 border-amber-200 bg-white px-3 py-2.5 text-sm text-gray-900 hover:border-primary-500 transition-colors cursor-pointer">
            <span class="font-medium">Basic (2 hrs)</span>
            <div class="flex items-center gap-2">
              <span class="text-gray-900 font-semibold">$50 ×</span>
              <input v-model.number="teacherBasic" type="number" min="0" class="w-16 rounded-lg border-2 border-amber-200 bg-white px-2 py-1.5 text-right text-gray-900 font-medium focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none" />
            </div>
          </label>
          <label class="flex items-center justify-between gap-2 rounded-lg border-2 border-amber-200 bg-white px-3 py-2.5 text-sm text-gray-900 hover:border-primary-500 transition-colors cursor-pointer">
            <span class="font-medium">Facilitator (Full day)</span>
            <div class="flex items-center gap-2">
              <span class="text-gray-900 font-semibold">$100 ×</span>
              <input v-model.number="teacherFacilitator" type="number" min="0" class="w-16 rounded-lg border-2 border-amber-200 bg-white px-2 py-1.5 text-right text-gray-900 font-medium focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none" />
            </div>
          </label>
          <label class="flex items-center justify-between gap-2 rounded-lg border-2 border-amber-200 bg-white px-3 py-2.5 text-sm text-gray-900 hover:border-primary-500 transition-colors cursor-pointer">
            <span class="font-medium">Termly Refresher</span>
            <div class="flex items-center gap-2">
              <span class="text-gray-900 font-semibold">$60 ×</span>
              <input v-model.number="teacherTermly" type="number" min="0" class="w-16 rounded-lg border-2 border-amber-200 bg-white px-2 py-1.5 text-right text-gray-900 font-medium focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none" />
            </div>
          </label>
        </div>
      </div>
      <div>
        <label class="block text-gray-900 font-semibold mb-2">Robotics Kits (optional)</label>
        <div class="grid grid-cols-1 gap-2">
          <label class="flex items-center justify-between gap-2 rounded-lg border-2 border-amber-200 bg-white px-3 py-2.5 text-sm text-gray-900 hover:border-primary-500 transition-colors cursor-pointer">
            <span class="font-medium">Micro:bit Kit</span>
            <div class="flex items-center gap-2">
              <span class="text-gray-900 font-semibold">$35 ×</span>
              <input v-model.number="kitMicrobit" type="number" min="0" class="w-16 rounded-lg border-2 border-amber-200 bg-white px-2 py-1.5 text-right text-gray-900 font-medium focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none" />
            </div>
          </label>
          <label class="flex items-center justify-between gap-2 rounded-lg border-2 border-amber-200 bg-white px-3 py-2.5 text-sm text-gray-900 hover:border-primary-500 transition-colors cursor-pointer">
            <span class="font-medium">Bit:Bot Kit</span>
            <div class="flex items-center gap-2">
              <span class="text-gray-900 font-semibold">$70 ×</span>
              <input v-model.number="kitBitbot" type="number" min="0" class="w-16 rounded-lg border-2 border-amber-200 bg-white px-2 py-1.5 text-right text-gray-900 font-medium focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none" />
            </div>
          </label>
          <label class="flex items-center justify-between gap-2 rounded-lg border-2 border-amber-200 bg-white px-3 py-2.5 text-sm text-gray-900 hover:border-primary-500 transition-colors cursor-pointer">
            <span class="font-medium">High School Pack (5 kits)</span>
            <div class="flex items-center gap-2">
              <span class="text-gray-900 font-semibold">$350 ×</span>
              <input v-model.number="kitPack" type="number" min="0" class="w-16 rounded-lg border-2 border-amber-200 bg-white px-2 py-1.5 text-right text-gray-900 font-medium focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none" />
            </div>
          </label>
        </div>
      </div>
    </div>

    <!-- Extras -->
    <div>
      <label class="block text-gray-900 font-semibold mb-2">Extras</label>
      <div class="grid gap-2 sm:grid-cols-2">
        <label class="flex items-center justify-between gap-2 rounded-lg border-2 border-amber-200 bg-white px-3 py-2.5 text-sm text-gray-900 hover:border-primary-500 transition-colors cursor-pointer">
          <span class="font-medium">Hackathon Entry ($5 per student)</span>
          <div class="flex items-center gap-2">
            <span class="text-gray-900 font-semibold">$5 ×</span>
            <input v-model.number="extraHackathon" type="number" min="0" class="w-20 rounded-lg border-2 border-amber-200 bg-white px-2 py-1.5 text-right text-gray-900 font-medium focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none" />
          </div>
        </label>
        <label class="flex items-center justify-between gap-2 rounded-lg border-2 border-amber-200 bg-white px-3 py-2.5 text-sm text-gray-900 hover:border-primary-500 transition-colors cursor-pointer">
          <span class="font-medium">Club Merchandise (avg $8.5 per student)</span>
          <div class="flex items-center gap-2">
            <span class="text-gray-900 font-semibold">$8.5 ×</span>
            <input v-model.number="extraMerch" type="number" min="0" class="w-20 rounded-lg border-2 border-amber-200 bg-white px-2 py-1.5 text-right text-gray-900 font-medium focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none" />
          </div>
        </label>
      </div>
    </div>

    <!-- Notes -->
    <div>
      <label class="block text-gray-900 font-semibold mb-2">Notes</label>
      <textarea v-model="form.notes" rows="3" placeholder="Anything we should know?" class="w-full rounded-lg bg-white border-2 border-amber-200 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none resize-none"></textarea>
    </div>

    <!-- Submit Section -->
    <div class="flex flex-wrap items-center justify-between gap-4 pt-4 border-t-2 border-amber-200">
      <div class="text-lg text-gray-900 font-semibold">
        Estimated total: <span class="font-bold text-primary-600">USD {{ total.toFixed(2) }}</span>
      </div>
      <div class="flex flex-wrap items-center gap-4">
        <label class="flex items-center gap-2 text-sm text-gray-900 cursor-pointer font-medium">
          <input type="checkbox" v-model="attachPdf" class="h-4 w-4 rounded border-amber-300 text-primary-600 focus:ring-primary-500" /> 
          Attach PDF
        </label>
        <label class="flex items-center gap-2 text-sm text-gray-900 cursor-pointer font-medium">
          <input type="checkbox" v-model="depositOnly" class="h-4 w-4 rounded border-amber-300 text-primary-600 focus:ring-primary-500" /> 
          Deposit only (50%)
        </label>
      </div>
      <button :disabled="submitting" type="submit" class="w-full sm:w-auto rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-3 font-semibold text-white shadow-lg hover:shadow-xl hover:from-primary-700 hover:to-primary-800 transition-all disabled:opacity-50">
        {{ submitting ? 'Generating...' : 'Generate Invoice' }}
      </button>
    </div>

    <div v-if="successMsg" class="rounded-xl border-2 border-green-500 bg-green-50 px-4 py-3 text-sm text-green-900 font-medium">
      {{ successMsg }}
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue'

type Level = 'primary' | 'high'

interface PlanDef { 
  id: string
  name: string
  price: number
  minimumStudents: number 
}

const primaryPlans: PlanDef[] = [
  { id: 'primary-starter', name: 'Starter', price: 10, minimumStudents: 50 },
  { id: 'primary-premium', name: 'Premium', price: 15, minimumStudents: 40 },
  { id: 'primary-full', name: 'Full Experience', price: 20, minimumStudents: 30 }
]

const highPlans: PlanDef[] = [
  { id: 'high-core', name: 'Core', price: 15, minimumStudents: 50 },
  { id: 'high-tech-builders', name: 'Tech Builders', price: 20, minimumStudents: 40 },
  { id: 'high-ai-robotics', name: 'AI & Robotics', price: 25, minimumStudents: 30 }
]

const form = reactive({
  schoolName: '',
  contactName: '',
  email: '',
  phone: '',
  level: 'primary' as Level,
  planId: 'primary-starter',
  students: 50,
  months: 3,
  notes: ''
})

const teacherBasic = ref(0)
const teacherFacilitator = ref(0)
const teacherTermly = ref(0)
const kitMicrobit = ref(0)
const kitBitbot = ref(0)
const kitPack = ref(0)
const extraHackathon = ref(0)
const extraMerch = ref(0)

const submitting = ref(false)
const successMsg = ref('')
const attachPdf = ref(true)
const depositOnly = ref(false)

const plans = computed(() => (form.level === 'primary' ? primaryPlans : highPlans))

watch(() => form.level, (lvl) => {
  form.planId = lvl === 'primary' ? 'primary-starter' : 'high-core'
})

const total = computed(() => {
  const p = plans.value.find(p => p.id === form.planId)!
  const students = form.students
  let planTotal = p.price * students * form.months
  const teacherTotal = teacherBasic.value * 50 + teacherFacilitator.value * 100 + teacherTermly.value * 60
  const kitsTotal = kitMicrobit.value * 35 + kitBitbot.value * 70 + kitPack.value * 350
  const extrasTotal = extraHackathon.value * 5 + extraMerch.value * 8.5
  let total = planTotal + teacherTotal + kitsTotal + extrasTotal
  if (depositOnly.value) total = total * 0.5
  return total
})

async function onSubmit() {
  submitting.value = true
  successMsg.value = ''
  try {
    const payload = {
      schoolName: form.schoolName,
      contactName: form.contactName,
      email: form.email,
      phone: form.phone,
      level: form.level,
      planId: form.planId,
      students: Number(form.students),
      months: Number(form.months),
      attachPdf: attachPdf.value,
      depositOnly: depositOnly.value,
      teacherTraining: [
        { id: 'teacher-basic', quantity: Number(teacherBasic.value) },
        { id: 'teacher-facilitator', quantity: Number(teacherFacilitator.value) },
        { id: 'teacher-termly', quantity: Number(teacherTermly.value) }
      ],
      kits: [
        { id: 'kit-microbit', quantity: Number(kitMicrobit.value) },
        { id: 'kit-bitbot', quantity: Number(kitBitbot.value) },
        { id: 'kit-highschool-pack', quantity: Number(kitPack.value) }
      ],
      extras: [
        { id: 'extra-hackathon', quantity: Number(extraHackathon.value) },
        { id: 'extra-merch', quantity: Number(extraMerch.value) }
      ],
      notes: form.notes
    }

    const res = await $fetch('/api/quotes.school', { method: 'POST', body: payload })
    if ((res as any)?.ok) {
      successMsg.value = 'Quote generated and emailed. Check your inbox.'
    }
  } catch (e) {
    successMsg.value = 'Could not generate invoice. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>
