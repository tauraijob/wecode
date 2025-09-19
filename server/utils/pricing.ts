import { z } from 'zod'

// Pricing definitions for School Clubs (Primary & High School)
// Currency: USD

export const schoolPricing = {
  currency: 'USD',
  tax: { enabled: false, ratePercent: 0 },
  fees: [] as { name: string; type: 'percent' | 'fixed'; value: number }[],
  plans: {
    primary: [
      {
        id: 'primary-starter',
        name: 'Starter Plan',
        description: '1-hour weekly club session (Digital Skills + Coding + Intro Robotics). Term-based curriculum. End-of-term presentations.',
        unit: 'student_month',
        price: 10,
        minimumStudents: 50
      },
      {
        id: 'primary-premium',
        name: 'Premium Plan',
        description: 'Starter + Printed certificates + Intra-school robotics/coding challenges.',
        unit: 'student_month',
        price: 15,
        minimumStudents: 40
      },
      {
        id: 'primary-full',
        name: 'Full Experience Plan',
        description: 'Premium + Monthly robotics (Bit:Bot) + Extra project templates + Club badges & printed t-shirts.',
        unit: 'student_month',
        price: 20,
        minimumStudents: 30
      }
    ],
    high: [
      {
        id: 'high-core',
        name: 'Core Coding Club',
        description: '1-hour weekly session. HTML, CSS, JavaScript, Python, MySQL, PHP. Term project + portfolio.',
        unit: 'student_month',
        price: 15,
        minimumStudents: 50
      },
      {
        id: 'high-tech-builders',
        name: 'Tech Builders Club',
        description: 'Core + React, APIs, Git & hosting. Team hackathons, DevOps basics.',
        unit: 'student_month',
        price: 20,
        minimumStudents: 40
      },
      {
        id: 'high-ai-robotics',
        name: 'AI & Robotics Plan',
        description: 'All above + Python AI basics (chatbots, image classifiers), sensors & robotics (Bit:Bot, Arduino exposure).',
        unit: 'student_month',
        price: 25,
        minimumStudents: 30
      }
    ]
  },
  teacherTraining: [
    { id: 'teacher-basic', name: 'Basic Training', description: '2-hour overview for assisting teachers', unit: 'teacher', price: 50 },
    { id: 'teacher-facilitator', name: 'Facilitator Training', description: 'Full-day practical training to manage clubs', unit: 'teacher', price: 100 },
    { id: 'teacher-termly', name: 'Termly Refresher', description: 'New topics, project walkthroughs, coaching', unit: 'teacher', price: 60 }
  ],
  roboticsKits: [
    { id: 'kit-microbit', name: 'Micro:bit Kit', description: 'Board + batteries + cables + simple sensors', unit: 'unit', price: 35 },
    { id: 'kit-bitbot', name: 'Bit:Bot Kit', description: 'Robot car with sensors, programmable via Micro:bit', unit: 'unit', price: 70 },
    { id: 'kit-highschool-pack', name: 'High School Robotics Pack (5 kits)', description: '5 full kits + sensors for large teams', unit: 'set', price: 350 }
  ],
  extras: [
    { id: 'extra-hackathon', name: 'Hackathon Entry', description: 'Compete with other schools', unit: 'student', price: 5 },
    { id: 'extra-merch', name: 'Club Merchandise', description: 'Shirts, badges, digital certificates', unit: 'student', price: 8.5 }
  ]
}

export const QuoteRequestSchema = z.object({
  schoolName: z.string().min(2),
  contactName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  level: z.enum(['primary', 'high']),
  planId: z.string(),
  students: z.number().int().positive(),
  months: z.number().int().positive(),
  attachPdf: z.boolean().optional(),
  depositOnly: z.boolean().optional(),
  teacherTraining: z.array(z.object({ id: z.string(), quantity: z.number().int().nonnegative() })).optional(),
  kits: z.array(z.object({ id: z.string(), quantity: z.number().int().nonnegative() })).optional(),
  extras: z.array(z.object({ id: z.string(), quantity: z.number().int().nonnegative() })).optional(),
  notes: z.string().optional()
})

export type QuoteRequest = z.infer<typeof QuoteRequestSchema>

export interface LineItem {
  id: string
  name: string
  unitPrice: number
  quantity: number
  total: number
}

export interface QuoteResult {
  currency: string
  items: LineItem[]
  subtotal: number
  tax: number
  fees: number
  total: number
  metadata: { level: string; planId: string; months: number; students: number }
}

export function calculateQuote(input: QuoteRequest): QuoteResult {
  const items: LineItem[] = []
  const currency = schoolPricing.currency

  const planList = input.level === 'primary' ? schoolPricing.plans.primary : schoolPricing.plans.high
  const plan = planList.find(p => p.id === input.planId)
  if (!plan) throw new Error('Invalid plan selected')

  const effectiveStudents = input.students
  const planMonths = input.months
  const planQuantity = effectiveStudents * planMonths
  const planTotal = plan.price * planQuantity
  items.push({ id: plan.id, name: `${plan.name} (${effectiveStudents} students x ${planMonths} months)`, unitPrice: plan.price, quantity: planQuantity, total: planTotal })

  for (const tr of input.teacherTraining || []) {
    if (!tr.quantity) continue
    const def = schoolPricing.teacherTraining.find(t => t.id === tr.id)
    if (!def) continue
    const total = def.price * tr.quantity
    items.push({ id: def.id, name: def.name, unitPrice: def.price, quantity: tr.quantity, total })
  }

  for (const kit of input.kits || []) {
    if (!kit.quantity) continue
    const def = schoolPricing.roboticsKits.find(k => k.id === kit.id)
    if (!def) continue
    const total = def.price * kit.quantity
    items.push({ id: def.id, name: def.name, unitPrice: def.price, quantity: kit.quantity, total })
  }

  for (const ex of input.extras || []) {
    if (!ex.quantity) continue
    const def = schoolPricing.extras.find(e => e.id === ex.id)
    if (!def) continue
    const total = def.price * ex.quantity
    items.push({ id: def.id, name: def.name, unitPrice: def.price, quantity: ex.quantity, total })
  }

  let subtotal = items.reduce((s, i) => s + i.total, 0)
  if ((input as any).depositOnly) {
    subtotal = subtotal * 0.5
  }
  const tax = schoolPricing.tax.enabled ? (subtotal * schoolPricing.tax.ratePercent) / 100 : 0
  const fees = schoolPricing.fees.reduce((s, f) => s + (f.type === 'percent' ? (subtotal * f.value) / 100 : f.value), 0)
  const total = subtotal + tax + fees

  return { currency, items, subtotal, tax, fees, total, metadata: { level: input.level, planId: input.planId, months: input.months, students: effectiveStudents } }
}

export function renderInvoiceHtml(params: {
  quote: QuoteResult
  request: QuoteRequest
  invoiceNumber: string
  company: { name: string; email: string; phone?: string }
}): string {
  const { quote, request, invoiceNumber, company } = params
  const date = new Date().toISOString().slice(0, 10)
  const currency = quote.currency
  const money = (n: number) => `${currency} ${n.toFixed(2)}`

  return `<!DOCTYPE html>
  <html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Invoice ${invoiceNumber}</title></head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background:#f6f8fb; color:#0b1224; padding:24px;">
    <div style="max-width:800px;margin:0 auto;background:#ffffff;border-radius:10px;box-shadow:0 6px 20px rgba(0,0,0,0.08);overflow:hidden;">
      <div style="background:linear-gradient(135deg,#213c6d,#7899d1);padding:24px;color:#fff;display:flex;justify-content:space-between;align-items:flex-start;">
        <div>
          <div style="font-size:20px;font-weight:700;">WeCodeZW</div>
          <div style="opacity:.9;">${company.email}${company.phone ? ' • ' + company.phone : ''}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:22px;font-weight:700;">Invoice</div>
          <div style="opacity:.9;">No: ${invoiceNumber}</div>
          <div style="opacity:.9;">Date: ${date}</div>
        </div>
      </div>

      <div style="padding:24px;">
        <div style="display:flex;gap:24px;flex-wrap:wrap;margin-bottom:16px;">
          <div style="flex:1;min-width:240px;">
            <div style="font-weight:700;">Bill To</div>
            <div>${request.schoolName}</div>
            <div>${request.contactName}</div>
            <div>${request.email}${request.phone ? ' • ' + request.phone : ''}</div>
          </div>
          <div style="flex:1;min-width:240px;">
            <div style="font-weight:700;">Details</div>
            <div>Club Level: ${request.level}</div>
            <div>Months: ${request.months}</div>
            <div>Students: ${quote.metadata.students}</div>
          </div>
        </div>

        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr>
              <th style="text-align:left;border-bottom:2px solid #e5eaf1;padding:12px 8px;">Item</th>
              <th style="text-align:right;border-bottom:2px solid #e5eaf1;padding:12px 8px;">Unit Price</th>
              <th style="text-align:right;border-bottom:2px solid #e5eaf1;padding:12px 8px;">Qty</th>
              <th style="text-align:right;border-bottom:2px solid #e5eaf1;padding:12px 8px;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${quote.items
              .map(
                (i) => `<tr>
                  <td style="border-bottom:1px solid #eef2f6;padding:10px 8px;">${i.name}</td>
                  <td style="text-align:right;border-bottom:1px solid #eef2f6;padding:10px 8px;">${money(i.unitPrice)}</td>
                  <td style="text-align:right;border-bottom:1px solid #eef2f6;padding:10px 8px;">${i.quantity}</td>
                  <td style="text-align:right;border-bottom:1px solid #eef2f6;padding:10px 8px;">${money(i.total)}</td>
                </tr>`
              )
              .join('')}
          </tbody>
        </table>

        <div style="display:flex;justify-content:flex-end;margin-top:16px;">
          <table style="min-width:320px;">
            <tr><td style="padding:6px 8px;">Subtotal</td><td style="text-align:right;padding:6px 8px;">${money(quote.subtotal)}</td></tr>
            ${quote.tax ? `<tr><td style="padding:6px 8px;">Tax</td><td style="text-align:right;padding:6px 8px;">${money(quote.tax)}</td></tr>` : ''}
            ${quote.fees ? `<tr><td style="padding:6px 8px;">Fees</td><td style="text-align:right;padding:6px 8px;">${money(quote.fees)}</td></tr>` : ''}
            <tr><td style="padding:10px 8px;font-weight:700;border-top:2px solid #e5eaf1;">Total</td><td style="text-align:right;padding:10px 8px;font-weight:700;border-top:2px solid #e5eaf1;">${money(quote.total)}</td></tr>
          </table>
        </div>

        ${request.notes ? `<div style="margin-top:16px;background:#f8fafc;border-left:4px solid #7899d1;padding:12px;border-radius:6px;">
          <div style="font-weight:700;">Notes</div>
          <div>${request.notes}</div>
        </div>` : ''}

        <div style="margin-top:24px;font-size:12px;color:#475569;">Payments in USD. For queries, contact ${company.email} or WhatsApp +263778456168.</div>
      </div>
    </div>
  </body></html>`
}


