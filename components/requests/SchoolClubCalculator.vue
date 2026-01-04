<template>
  <form @submit.prevent="onSubmit" class="grid gap-6">
    <!-- Contact Info -->
    <div class="grid gap-4 sm:grid-cols-2">
      <div>
        <UiLabel class="text-white font-medium mb-1.5">School name</UiLabel>
        <UiInput v-model="form.schoolName" required placeholder="Example High School" class="bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-primary-300 focus:ring-primary-300/20" />
      </div>
      <div>
        <UiLabel class="text-white font-medium mb-1.5">Contact person</UiLabel>
        <UiInput v-model="form.contactName" required placeholder="Jane Doe" class="bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-primary-300 focus:ring-primary-300/20" />
      </div>
      <div>
        <UiLabel class="text-white font-medium mb-1.5">Email</UiLabel>
        <UiInput v-model="form.email" type="email" required placeholder="[email protected]" class="bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-primary-300 focus:ring-primary-300/20" />
      </div>
      <div>
        <UiLabel class="text-white font-medium mb-1.5">Phone / WhatsApp</UiLabel>
        <UiInput v-model="form.phone" placeholder="+263778456168" class="bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-primary-300 focus:ring-primary-300/20" />
      </div>
    </div>

    <!-- Plan Selection -->
    <div class="grid gap-4 sm:grid-cols-3">
      <div>
        <UiLabel class="text-white font-medium mb-1.5">Level</UiLabel>
        <UiSelect v-model="form.level" class="bg-white/10 border-white/20 text-white">
          <option value="primary" class="bg-primary-700 text-white">Primary (Grade 1–7)</option>
          <option value="high" class="bg-primary-700 text-white">High School (Form 1–6)</option>
        </UiSelect>
      </div>
      <div>
        <UiLabel class="text-white font-medium mb-1.5">Plan</UiLabel>
        <UiSelect v-model="form.planId" class="bg-white/10 border-white/20 text-white">
          <option v-for="p in plans" :key="p.id" :value="p.id" class="bg-primary-700 text-white">{{ p.name }} — ${{ p.price }}/student/mo (min {{ p.minimumStudents }})</option>
        </UiSelect>
      </div>
      <div>
        <UiLabel class="text-white font-medium mb-1.5">Months</UiLabel>
        <UiInput v-model.number="form.months" type="number" min="1" required class="bg-white/10 border-white/20 text-white placeholder-white/50" />
      </div>
    </div>

    <!-- Students & Training -->
    <div class="grid gap-4 sm:grid-cols-3">
      <div>
        <UiLabel class="text-white font-medium mb-1.5">Students</UiLabel>
        <UiInput v-model.number="form.students" type="number" min="1" required class="bg-white/10 border-white/20 text-white placeholder-white/50" />
      </div>
      <div>
        <UiLabel class="text-white font-medium mb-1.5">Teacher Training</UiLabel>
        <div class="grid grid-cols-1 gap-2">
          <label class="flex items-center justify-between gap-2 rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10 transition-colors">
            <span>Basic (2 hrs)</span>
            <div class="flex items-center gap-2">
              <span class="text-primary-200">$50 ×</span>
              <input v-model.number="teacherBasic" type="number" min="0" class="w-16 rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-right text-white" />
            </div>
          </label>
          <label class="flex items-center justify-between gap-2 rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10 transition-colors">
            <span>Facilitator (Full day)</span>
            <div class="flex items-center gap-2">
              <span class="text-primary-200">$100 ×</span>
              <input v-model.number="teacherFacilitator" type="number" min="0" class="w-16 rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-right text-white" />
            </div>
          </label>
          <label class="flex items-center justify-between gap-2 rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10 transition-colors">
            <span>Termly Refresher</span>
            <div class="flex items-center gap-2">
              <span class="text-primary-200">$60 ×</span>
              <input v-model.number="teacherTermly" type="number" min="0" class="w-16 rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-right text-white" />
            </div>
          </label>
        </div>
      </div>
      <div>
        <UiLabel class="text-white font-medium mb-1.5">Robotics Kits (optional)</UiLabel>
        <div class="grid grid-cols-1 gap-2">
          <label class="flex items-center justify-between gap-2 rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10 transition-colors">
            <span>Micro:bit Kit</span>
            <div class="flex items-center gap-2">
              <span class="text-primary-200">$35 ×</span>
              <input v-model.number="kitMicrobit" type="number" min="0" class="w-16 rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-right text-white" />
            </div>
          </label>
          <label class="flex items-center justify-between gap-2 rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10 transition-colors">
            <span>Bit:Bot Kit</span>
            <div class="flex items-center gap-2">
              <span class="text-primary-200">$70 ×</span>
              <input v-model.number="kitBitbot" type="number" min="0" class="w-16 rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-right text-white" />
            </div>
          </label>
          <label class="flex items-center justify-between gap-2 rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10 transition-colors">
            <span>High School Pack (5 kits)</span>
            <div class="flex items-center gap-2">
              <span class="text-primary-200">$350 ×</span>
              <input v-model.number="kitPack" type="number" min="0" class="w-16 rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-right text-white" />
            </div>
          </label>
        </div>
      </div>
    </div>

    <!-- Extras -->
    <div>
      <UiLabel class="text-white font-medium mb-1.5">Extras</UiLabel>
      <div class="grid gap-2 sm:grid-cols-2">
        <label class="flex items-center justify-between gap-2 rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10 transition-colors">
          <span>Hackathon Entry ($5 per student)</span>
          <div class="flex items-center gap-2">
            <span class="text-primary-200">$5 ×</span>
            <input v-model.number="extraHackathon" type="number" min="0" class="w-20 rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-right text-white" />
          </div>
        </label>
        <label class="flex items-center justify-between gap-2 rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10 transition-colors">
          <span>Club Merchandise (avg $8.5 per student)</span>
          <div class="flex items-center gap-2">
            <span class="text-primary-200">$8.5 ×</span>
            <input v-model.number="extraMerch" type="number" min="0" class="w-20 rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-right text-white" />
          </div>
        </label>
      </div>
    </div>

    <!-- Notes -->
    <div>
      <UiLabel class="text-white font-medium mb-1.5">Notes</UiLabel>
      <UiTextarea v-model="form.notes" :rows="3" placeholder="Anything we should know?" class="bg-white/10 border-white/20 text-white placeholder-white/50" />
    </div>

    <!-- Submit Section -->
    <div class="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
      <div class="text-lg text-white">Estimated total: <span class="font-bold text-accent-300">USD {{ total.toFixed(2) }}</span></div>
      <div class="flex flex-wrap items-center gap-4">
        <label class="flex items-center gap-2 text-sm text-white/80 cursor-pointer">
          <input type="checkbox" v-model="attachPdf" class="h-4 w-4 rounded border-white/30 bg-white/10 text-primary-500 focus:ring-primary-400" /> Attach PDF
        </label>
        <label class="flex items-center gap-2 text-sm text-white/80 cursor-pointer">
          <input type="checkbox" v-model="depositOnly" class="h-4 w-4 rounded border-white/30 bg-white/10 text-primary-500 focus:ring-primary-400" /> Deposit only (50%)
        </label>
      </div>
      <button :disabled="submitting" type="submit" class="w-full sm:w-auto rounded-xl bg-white px-6 py-3 font-semibold text-primary-600 shadow-lg hover:shadow-xl hover:bg-primary-50 transition-all disabled:opacity-50">
        {{ submitting ? 'Generating...' : 'Generate Invoice' }}
      </button>
    </div>

    <div v-if="successMsg" class="rounded-xl border border-green-400/30 bg-green-500/20 px-4 py-3 text-sm text-green-100 animate-fade-in">{{ successMsg }}</div>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue'
import UiInput from '@/components/ui/Input.vue'
import UiLabel from '@/components/ui/Label.vue'
import UiSelect from '@/components/ui/Select.vue'
import UiTextarea from '@/components/ui/Textarea.vue'

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
