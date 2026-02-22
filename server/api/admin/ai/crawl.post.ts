import fs from 'fs'
import path from 'path'
import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'token')
    const auth = token ? verifyJwt(token) : null
    if (!auth) {
        throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
    }

    const user = await prisma.user.findUnique({ where: { id: auth.userId }, select: { role: true } })
    if (!user || (user.role !== 'ADMIN' && user.role !== 'COMMUNITY_ADMIN')) {
        throw createError({ statusCode: 403, statusMessage: 'Unauthorized' })
    }

    const pagesDir = path.resolve(process.cwd(), 'pages')
    const files: string[] = []

    function walk(dir: string) {
        const entries = fs.readdirSync(dir, { withFileTypes: true })
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name)
            if (entry.isDirectory()) {
                walk(fullPath)
            } else if (entry.name.endsWith('.vue')) {
                files.push(fullPath)
            }
        }
    }

    walk(pagesDir)

    let indexedCount = 0
    for (const file of files) {
        let content = fs.readFileSync(file, 'utf8')

        // 1. Extract template content
        const templateMatch = content.match(/<template>([\s\S]*)<\/template>/)
        if (!templateMatch) continue

        let text = templateMatch[1]

        // 2. Strip standard HTML tags but keep content
        text = text.replace(/<[^>]*>?/gm, ' ')

        // 3. Clean up whitespace and curly braces (Vue bindings)
        text = text.replace(/{{|}}/g, '')
        text = text.replace(/\s+/g, ' ').trim()

        if (text.length < 50) continue // Skip thin pages

        const relativePath = path.relative(pagesDir, file).replace(/\\/g, '/')
        const url = '/' + relativePath.replace(/\.vue$/, '').replace(/index$/, '').replace(/\/$/, '')

        await prisma.aIKnowledgeBase.upsert({
            where: { id: `page-${url}` }, // Use constant ID for pages
            update: {
                content: `Page: ${url}\nContent: ${text}`,
                sourceUrl: url,
                isManual: false
            },
            create: {
                id: `page-${url}`,
                content: `Page: ${url}\nContent: ${text}`,
                sourceUrl: url,
                isManual: false
            }
        })
        indexedCount++
    }

    return { ok: true, indexedCount }
})
