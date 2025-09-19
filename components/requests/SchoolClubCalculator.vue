<template>
  <form @submit.prevent="onSubmit" class="grid gap-4 rounded-xl border border-navy-800 bg-navy-900/40 p-6">
    <div class="grid gap-2 sm:grid-cols-2">
      <div>
        <UiLabel class="text-navy-200">School name</UiLabel>
        <UiInput v-model="form.schoolName" required placeholder="Example High School" class="bg-navy-900 border-navy-700 text-navy-100 placeholder-navy-400" />
      </div>
      <div>
        <UiLabel class="text-navy-200">Contact person</UiLabel>
        <UiInput v-model="form.contactName" required placeholder="Jane Doe" class="bg-navy-900 border-navy-700 text-navy-100 placeholder-navy-400" />
      </div>
      <div>
        <UiLabel class="text-navy-200">Email</UiLabel>
        <UiInput v-model="form.email" type="email" required placeholder="[email protected]" class="bg-navy-900 border-navy-700 text-navy-100 placeholder-navy-400" />
      </div>
      <div>
        <UiLabel class="text-navy-200">Phone / WhatsApp</UiLabel>
        <UiInput v-model="form.phone" placeholder="+263778456168" class="bg-navy-900 border-navy-700 text-navy-100 placeholder-navy-400" />
      </div>
    </div>

    <div class="grid gap-2 sm:grid-cols-3">
      <div>
        <UiLabel class="text-navy-200">Level</UiLabel>
        <UiSelect v-model="form.level" class="bg-navy-900 border-navy-700 text-navy-100">
          <option value="primary">Primary (Grade 1–7)</option>
          <option value="high">High School (Form 1–6)</option>
        </UiSelect>
      </div>
      <div>
        <UiLabel class="text-navy-200">Plan</UiLabel>
        <UiSelect v-model="form.planId" class="bg-navy-900 border-navy-700 text-navy-100">
          <option v-for="p in plans" :key="p.id" :value="p.id">{{ p.name }} — ${{ p.price }}/student/mo (min {{ p.minimumStudents }})</option>
        </UiSelect>
      </div>
      <div>
        <UiLabel class="text-navy-200">Months</UiLabel>
        <UiInput v-model.number="form.months" type="number" min="1" required class="bg-navy-900 border-navy-700 text-navy-100 placeholder-navy-400" />
      </div>
    </div>

    <div class="grid gap-2 sm:grid-cols-3">
      <div>
        <UiLabel class="text-navy-200">Students</UiLabel>
        <UiInput v-model.number="form.students" type="number" min="1" required class="bg-navy-900 border-navy-700 text-navy-100 placeholder-navy-400" />
      </div>
      <div>
        <UiLabel class="text-navy-200">Teacher Training</UiLabel>
        <div class="grid grid-cols-1 gap-2">
          <label class="flex items-center justify-between gap-2 rounded-md border border-navy-800 bg-navy-900 px-3 py-2 text-sm">
            <span>Basic (2 hrs)</span>
            <div class="flex items-center gap-2">
              <span class="text-navy-300">$50 ×</span>
              <input v-model.number="teacherBasic" type="number" min="0" class="w-16 rounded-md border border-navy-700 bg-navy-900 px-2 py-1 text-right text-navy-100" />
            </div>
          </label>
          <label class="flex items-center justify-between gap-2 rounded-md border border-navy-800 bg-navy-900 px-3 py-2 text-sm">
            <span>Facilitator (Full day)</span>
            <div class="flex items-center gap-2">
              <span class="text-navy-300">$100 ×</span>
              <input v-model.number="teacherFacilitator" type="number" min="0" class="w-16 rounded-md border border-navy-700 bg-navy-900 px-2 py-1 text-right text-navy-100" />
            </div>
          </label>
          <label class="flex items-center justify-between gap-2 rounded-md border border-navy-800 bg-navy-900 px-3 py-2 text-sm">
            <span>Termly Refresher</span>
            <div class="flex items-center gap-2">
              <span class="text-navy-300">$60 ×</span>
              <input v-model.number="teacherTermly" type="number" min="0" class="w-16 rounded-md border border-navy-700 bg-navy-900 px-2 py-1 text-right text-navy-100" />
            </div>
          </label>
        </div>
      </div>
      <div>
        <UiLabel class="text-navy-200">Robotics Kits (optional)</UiLabel>
        <div class="grid grid-cols-1 gap-2">
          <label class="flex items-center justify-between gap-2 rounded-md border border-navy-800 bg-navy-900 px-3 py-2 text-sm">
            <span>Micro:bit Kit</span>
            <div class="flex items-center gap-2">
              <span class="text-navy-300">$35 ×</span>
              <input v-model.number="kitMicrobit" type="number" min="0" class="w-16 rounded-md border border-navy-700 bg-navy-900 px-2 py-1 text-right text-navy-100" />
            </div>
          </label>
          <label class="flex items-center justify-between gap-2 rounded-md border border-navy-800 bg-navy-900 px-3 py-2 text-sm">
            <span>Bit:Bot Kit</span>
            <div class="flex items-center gap-2">
              <span class="text-navy-300">$70 ×</span>
              <input v-model.number="kitBitbot" type="number" min="0" class="w-16 rounded-md border border-navy-700 bg-navy-900 px-2 py-1 text-right text-navy-100" />
            </div>
          </label>
          <label class="flex items-center justify-between gap-2 rounded-md border border-navy-800 bg-navy-900 px-3 py-2 text-sm">
            <span>High School Pack (5 kits)</span>
            <div class="flex items-center gap-2">
              <span class="text-navy-300">$350 ×</span>
              <input v-model.number="kitPack" type="number" min="0" class="w-16 rounded-md border border-navy-700 bg-navy-900 px-2 py-1 text-right text-navy-100" />
            </div>
          </label>
        </div>
      </div>
    </div>

    <div>
      <UiLabel class="text-navy-200">Extras</UiLabel>
      <div class="grid gap-2 sm:grid-cols-2">
        <label class="flex items-center justify-between gap-2 rounded-md border border-navy-800 bg-navy-900 px-3 py-2 text-sm">
          <span>Hackathon Entry ($5 per student)</span>
          <div class="flex items-center gap-2">
            <span class="text-navy-300">$5 ×</span>
            <input v-model.number="extraHackathon" type="number" min="0" class="w-20 rounded-md border border-navy-700 bg-navy-900 px-2 py-1 text-right text-navy-100" />
          </div>
        </label>
        <label class="flex items-center justify-between gap-2 rounded-md border border-navy-800 bg-navy-900 px-3 py-2 text-sm">
          <span>Club Merchandise (avg $8.5 per student)</span>
          <div class="flex items-center gap-2">
            <span class="text-navy-300">$8.5 ×</span>
            <input v-model.number="extraMerch" type="number" min="0" class="w-20 rounded-md border border-navy-700 bg-navy-900 px-2 py-1 text-right text-navy-100" />
          </div>
        </label>
      </div>
    </div>

    <div>
      <UiLabel class="text-navy-200">Notes</UiLabel>
      <UiTextarea v-model="form.notes" :rows="3" placeholder="Anything we should know?" class="bg-navy-900 border-navy-700 text-navy-100 placeholder-navy-400" />
    </div>

    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="text-sm text-navy-300">Estimated total: <span class="font-semibold text-white">USD {{ total.toFixed(2) }}</span></div>
      <div class="flex items-center gap-3">
        <label class="flex items-center gap-2 text-sm text-navy-200">
          <input type="checkbox" v-model="attachPdf" class="h-4 w-4" /> Attach PDF
        </label>
        <label class="flex items-center gap-2 text-sm text-navy-200">
          <input type="checkbox" v-model="depositOnly" class="h-4 w-4" /> Deposit only (50%)
        </label>
      </div>
      <UiButton :disabled="submitting" type="submit" class="w-full bg-navy-400 text-navy-950 hover:bg-navy-300 sm:w-auto">Generate Invoice</UiButton>
    </div>

    <div v-if="successMsg" class="rounded-md border border-green-600/40 bg-green-900/20 px-3 py-2 text-sm text-green-200 animate-fade-in">{{ successMsg }}</div>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue'
import UiInput from '@/components/ui/Input.vue'
import UiLabel from '@/components/ui/Label.vue'
import UiSelect from '@/components/ui/Select.vue'
import UiTextarea from '@/components/ui/Textarea.vue'
import UiButton from '@/components/ui/Button.vue'

type Level = 'primary' | 'high'

interface PlanDef { id: string; name: string; price: number; minimumStudents: number }

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


