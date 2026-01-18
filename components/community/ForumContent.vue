<template>
  <div class="forum-content text-sm text-slate-700 leading-relaxed">
    <template v-for="(block, index) in parsedContent" :key="index">
      <!-- Code Block -->
      <div v-if="block.type === 'code'" class="my-3 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
        <!-- Code Header -->
        <div class="flex items-center justify-between px-3 py-1.5 bg-slate-800 border-b border-slate-700">
          <div class="flex items-center gap-1.5">
            <div class="flex gap-1">
              <span class="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-green-500"></span>
            </div>
            <span class="text-[10px] text-slate-400 font-mono ml-2">{{ block.language || 'code' }}</span>
          </div>
          <button
            @click="copyCode(block.code || '')"
            class="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {{ copied === (block.code || '') ? 'Copied!' : 'Copy' }}
          </button>
        </div>
        <!-- Code Content -->
        <div class="bg-slate-900 overflow-x-auto">
          <pre class="p-3 text-xs font-mono text-slate-100 leading-relaxed"><code v-html="highlightCode(block.code || '', block.language)"></code></pre>
        </div>
      </div>
      
      <!-- Regular Text -->
      <p v-else class="whitespace-pre-line">{{ block.text }}</p>
    </template>
  </div>
</template>

<script setup lang="ts">
import Prism from 'prismjs'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-markup'

interface ContentBlock {
  type: 'text' | 'code'
  text?: string
  code?: string
  language?: string
}

const props = defineProps<{
  content: string
}>()

const copied = ref<string | null>(null)

// Patterns to detect code without markdown blocks
const codePatterns = [
  // Function declarations
  /^(function\s+\w+\s*\([^)]*\)\s*\{|const\s+\w+\s*=\s*(?:async\s*)?\([^)]*\)\s*=>|def\s+\w+\s*\([^)]*\)\s*:)/m,
  // Variable declarations with code patterns
  /^(const|let|var|import|export|class|interface|type)\s+\w+/m,
  // Common code structures
  /\{\s*[\n\r]/,
  /^\s*(if|else|for|while|switch|try|catch)\s*[\(\{]/m,
  // Python/Ruby patterns
  /^(import\s+\w+|from\s+\w+\s+import|require\s+['"]|def\s+\w+)/m,
  // Console/print statements
  /(console\.(log|error|warn|info)|print\(|println\(|System\.out)/,
  // HTML tags
  /<\/?[a-z][a-z0-9]*[^<>]*>/i
]

// Detect language from code content
const detectLanguage = (code: string): string => {
  // JavaScript/TypeScript patterns
  if (/const\s+\w+\s*=|let\s+\w+\s*=|function\s+\w+|=>\s*\{|console\./i.test(code)) {
    if (/:\s*(string|number|boolean|any|void)\s*[=;,\)]|interface\s+\w+|type\s+\w+\s*=/i.test(code)) {
      return 'typescript'
    }
    return 'javascript'
  }
  // Python
  if (/def\s+\w+\s*\(|import\s+\w+|from\s+\w+\s+import|print\s*\(|:\s*$/m.test(code)) {
    return 'python'
  }
  // HTML
  if (/<\/?[a-z][a-z0-9]*[^<>]*>/i.test(code)) {
    return 'markup'
  }
  // CSS
  if (/\{[^}]*:[^;]+;[^}]*\}|^\s*\.[a-z-]+\s*\{/im.test(code)) {
    return 'css'
  }
  // SQL
  if (/\b(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER)\b/i.test(code)) {
    return 'sql'
  }
  // JSON
  if (/^\s*[\{\[]/.test(code) && /[\}\]]\s*$/.test(code)) {
    try {
      JSON.parse(code)
      return 'json'
    } catch {}
  }
  return 'javascript'
}

// Check if text looks like code
const looksLikeCode = (text: string): boolean => {
  // More than 3 lines with common code patterns
  const lines = text.split('\n').filter(l => l.trim())
  if (lines.length < 2) return false
  
  // Check for code patterns
  for (const pattern of codePatterns) {
    if (pattern.test(text)) return true
  }
  
  // Check for high ratio of special characters common in code
  const codeChars = (text.match(/[\{\}\[\]\(\);:=<>]/g) || []).length
  const wordChars = text.replace(/\s/g, '').length
  if (wordChars > 20 && codeChars / wordChars > 0.08) return true
  
  return false
}

const parsedContent = computed<ContentBlock[]>(() => {
  const content = props.content || ''
  const blocks: ContentBlock[] = []
  
  // Match code blocks: ```language\ncode\n``` or ```\ncode\n```
  const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g
  let lastIndex = 0
  let match
  
  while ((match = codeBlockRegex.exec(content)) !== null) {
    // Add text before code block
    if (match.index > lastIndex) {
      const text = content.slice(lastIndex, match.index).trim()
      if (text) {
        // Check if this text looks like code
        if (looksLikeCode(text)) {
          blocks.push({
            type: 'code',
            language: detectLanguage(text),
            code: text
          })
        } else {
          blocks.push({ type: 'text', text })
        }
      }
    }
    
    // Add code block
    blocks.push({
      type: 'code',
      language: match[1] || detectLanguage(match[2]),
      code: match[2].trim()
    })
    
    lastIndex = match.index + match[0].length
  }
  
  // Add remaining text
  if (lastIndex < content.length) {
    const text = content.slice(lastIndex).trim()
    if (text) {
      // Check if remaining text looks like code
      if (looksLikeCode(text)) {
        blocks.push({
          type: 'code',
          language: detectLanguage(text),
          code: text
        })
      } else {
        blocks.push({ type: 'text', text })
      }
    }
  }
  
  // If no blocks found, check if entire content is code
  if (blocks.length === 0) {
    if (looksLikeCode(content)) {
      blocks.push({
        type: 'code',
        language: detectLanguage(content),
        code: content
      })
    } else {
      blocks.push({ type: 'text', text: content })
    }
  }
  
  return blocks
})

const highlightCode = (code: string, language?: string) => {
  if (!code) return ''
  const lang = language || 'javascript'
  const grammar = Prism.languages[lang] || Prism.languages.javascript
  
  if (!grammar) {
    return escapeHtml(code)
  }
  
  try {
    return Prism.highlight(code, grammar, lang)
  } catch {
    return escapeHtml(code)
  }
}

const escapeHtml = (text: string) => {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

const copyCode = async (code: string) => {
  try {
    await navigator.clipboard.writeText(code)
    copied.value = code
    setTimeout(() => {
      copied.value = null
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>

<style>
/* Prism theme - VS Code Dark+ inspired */
.forum-content code .token.comment,
.forum-content code .token.prolog,
.forum-content code .token.doctype,
.forum-content code .token.cdata {
  color: #6a9955;
}

.forum-content code .token.punctuation {
  color: #d4d4d4;
}

.forum-content code .token.property,
.forum-content code .token.tag,
.forum-content code .token.boolean,
.forum-content code .token.number,
.forum-content code .token.constant,
.forum-content code .token.symbol {
  color: #b5cea8;
}

.forum-content code .token.selector,
.forum-content code .token.attr-name,
.forum-content code .token.string,
.forum-content code .token.char,
.forum-content code .token.builtin {
  color: #ce9178;
}

.forum-content code .token.operator,
.forum-content code .token.entity,
.forum-content code .token.url,
.forum-content code .token.variable {
  color: #d4d4d4;
}

.forum-content code .token.atrule,
.forum-content code .token.attr-value,
.forum-content code .token.function,
.forum-content code .token.class-name {
  color: #dcdcaa;
}

.forum-content code .token.keyword {
  color: #569cd6;
}

.forum-content code .token.regex,
.forum-content code .token.important {
  color: #d16969;
}

.forum-content code .token.important,
.forum-content code .token.bold {
  font-weight: bold;
}

.forum-content code .token.italic {
  font-style: italic;
}
</style>
