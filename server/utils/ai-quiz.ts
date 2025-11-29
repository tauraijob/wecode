/**
 * AI Quiz Generation Utility using Google Gemini API
 * 
 * This utility generates quiz questions from lesson content using Google's Gemini AI.
 * Requires GEMINI_API_KEY environment variable to be set.
 */

import { GoogleGenerativeAI } from '@google/generative-ai'

export interface QuizQuestion {
  id: string
  type: 'multiple-choice' | 'true-false'
  question: string
  options?: string[]
  correctAnswer: string | boolean
  explanation?: string
}

/**
 * Generate quiz questions from source material using Gemini AI
 * 
 * @param sourceMaterial - The lesson transcript, notes, or description
 * @param questionCount - Number of questions to generate (default: 10)
 * @param difficulty - Difficulty level: 'easy', 'medium', 'hard'
 * @param courseName - Optional course name for context
 * @param topicName - Optional topic name for context
 * @returns Array of quiz questions
 */
export async function generateQuizQuestions(
  sourceMaterial: string,
  questionCount: number = 10,
  difficulty: string = 'medium',
  courseName?: string,
  topicName?: string
): Promise<QuizQuestion[]> {
  const apiKey = process.env.GEMINI_API_KEY
  
  if (!apiKey) {
    console.warn('GEMINI_API_KEY not set, falling back to placeholder quiz generation')
    return generatePlaceholderQuestions(sourceMaterial, questionCount)
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    // Use gemini-1.5-flash (faster, free tier) or gemini-1.5-pro (more capable)
    // Set temperature for more randomness and diversity
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.9, // Higher temperature for more diverse outputs
        topP: 0.95,
        topK: 40
      }
    })

    // Build context for better quiz generation
    let contextPrompt = ''
    if (courseName) {
      contextPrompt += `Course: ${courseName}\n`
    }
    if (topicName) {
      contextPrompt += `Topic: ${topicName}\n`
    }
    contextPrompt += `Difficulty Level: ${difficulty}\n\n`

    const prompt = `${contextPrompt}Generate exactly ${questionCount} ${difficulty} quiz questions based on the following course content:

${sourceMaterial}

CRITICAL REQUIREMENTS:
- Each question MUST be completely unique and different from all other questions
- Cover DIFFERENT topics, concepts, and aspects from the lesson content
- Vary question types: use a good mix of multiple-choice and true-false questions
- For multiple-choice questions, provide exactly 4 DISTINCT options (A, B, C, D)
- Each question should test a DIFFERENT concept or piece of information
- Questions should be RANDOM and cover various parts of the content, not just the beginning
- Make questions relevant to the content and test understanding
- Include brief explanations for each answer
- Questions should be appropriate for ${difficulty} difficulty level
- DO NOT repeat similar questions or test the same concept twice
- Ensure questions are spread across different sections/topics in the content

Question Distribution Guidelines:
- Cover different key concepts from the lesson
- Test different levels of understanding (recall, application, analysis)
- Vary the question wording and structure
- Ensure each question focuses on a unique aspect of the content

Return ONLY a valid JSON array with this exact structure (no markdown, no code blocks, just pure JSON):
[
  {
    "id": "q1",
    "type": "multiple-choice",
    "question": "Unique question text here that tests a specific concept?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option A",
    "explanation": "Brief explanation of why this is correct"
  },
  {
    "id": "q2",
    "type": "true-false",
    "question": "True or False: Unique statement here that tests a different concept?",
    "correctAnswer": true,
    "explanation": "Brief explanation"
  }
]

Generate exactly ${questionCount} UNIQUE and DIVERSE questions. Each question must test a different concept. Return only the JSON array, nothing else.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Clean the response - remove markdown code blocks if present
    let cleanedText = text.trim()
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '')
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/```\n?/g, '')
    }

    let questions = parseQuestions(cleanedText)
    const originalCount = questions.length
    
    // Remove duplicate or very similar questions
    questions = removeDuplicateQuestions(questions)
    const afterDedupCount = questions.length
    
    if (originalCount > afterDedupCount) {
      console.log(`Removed ${originalCount - afterDedupCount} duplicate/similar questions`)
    }
    
    // If we have duplicates removed, try to generate more to fill the gap
    if (questions.length < questionCount) {
      console.warn(`After deduplication: ${questions.length} unique questions, expected ${questionCount}`)
      
      // Try generating additional questions if we have enough content
      if (sourceMaterial.length > 500) {
        try {
          const additionalCount = questionCount - questions.length
          const additionalPrompt = `${contextPrompt}Generate exactly ${additionalCount} ADDITIONAL unique quiz questions based on the following content. These questions MUST be completely different from any previous questions and cover different concepts:

${sourceMaterial}

Requirements:
- Generate ${additionalCount} NEW questions that are completely different from previous questions
- Cover different topics/concepts not already covered
- Each question must test a unique aspect of the content
- Mix of multiple-choice and true-false questions
- Return ONLY a valid JSON array (no markdown, no code blocks)

Return ONLY the JSON array:`
          
          const additionalResult = await model.generateContent(additionalPrompt)
          const additionalResponse = await additionalResult.response
          let additionalText = additionalResponse.text().trim()
          
          if (additionalText.startsWith('```json')) {
            additionalText = additionalText.replace(/```json\n?/g, '').replace(/```\n?/g, '')
          } else if (additionalText.startsWith('```')) {
            additionalText = additionalText.replace(/```\n?/g, '')
          }
          
          const additionalQuestions = parseQuestions(additionalText)
          const uniqueAdditional = removeDuplicateQuestions(additionalQuestions, questions)
          questions = [...questions, ...uniqueAdditional]
        } catch (error) {
          console.warn('Failed to generate additional questions:', error)
        }
      }
      
      // Fill remaining with placeholders if still needed
      if (questions.length < questionCount) {
        const needed = questionCount - questions.length
        const placeholders = generatePlaceholderQuestions(sourceMaterial, needed)
        // Remove duplicates from placeholders too
        const uniquePlaceholders = removeDuplicateQuestions(placeholders, questions)
        questions = [...questions, ...uniquePlaceholders.slice(0, needed)]
      }
    }

    // Final deduplication pass
    questions = removeDuplicateQuestions(questions)
    
    return questions.slice(0, questionCount)
  } catch (error: any) {
    console.error('Error generating quiz with Gemini AI:', error)
    console.warn('Falling back to placeholder quiz generation')
    return generatePlaceholderQuestions(sourceMaterial, questionCount)
  }
}

/**
 * Generate placeholder questions when AI is unavailable
 */
function generatePlaceholderQuestions(
  sourceMaterial: string,
  questionCount: number
): QuizQuestion[] {
  const questions: QuizQuestion[] = []
  const sentences = sourceMaterial.split(/[.!?]+/).filter(s => s.trim().length > 20)
  
  for (let i = 0; i < Math.min(questionCount, sentences.length); i++) {
    const sentence = sentences[i].trim()
    const words = sentence.split(/\s+/)
    
    if (words.length > 5) {
      questions.push({
        id: `q${i + 1}`,
        type: 'true-false',
        question: `True or False: ${sentence.substring(0, 100)}...`,
        correctAnswer: true,
        explanation: 'Based on the lesson content'
      })
    }
  }
  
  // Fill remaining slots with multiple-choice questions
  while (questions.length < questionCount) {
    questions.push({
      id: `q${questions.length + 1}`,
      type: 'multiple-choice',
      question: `What is a key concept discussed in this lesson?`,
      options: [
        'Option A',
        'Option B',
        'Option C',
        'Option D'
      ],
      correctAnswer: 'Option A',
      explanation: 'This concept was covered in the lesson'
    })
  }
  
  return questions.slice(0, questionCount)
}

/**
 * Remove duplicate or very similar questions
 */
function removeDuplicateQuestions(
  questions: QuizQuestion[],
  existingQuestions: QuizQuestion[] = []
): QuizQuestion[] {
  const uniqueQuestions: QuizQuestion[] = []
  const allQuestions = [...existingQuestions]
  
  for (const question of questions) {
    // Check if this question is too similar to any existing question
    let isDuplicate = false
    let duplicateReason = ''
    
    for (const existing of allQuestions) {
      // Check for exact duplicate
      if (existing.question.toLowerCase().trim() === question.question.toLowerCase().trim()) {
        isDuplicate = true
        duplicateReason = 'exact match'
        break
      }
      
      // Check for high similarity (more than 75% word overlap)
      const similarity = calculateQuestionSimilarity(existing.question, question.question)
      if (similarity > 0.75) {
        isDuplicate = true
        duplicateReason = `high similarity (${Math.round(similarity * 100)}%)`
        break
      }
      
      // Check if questions are asking about the same thing (same keywords)
      if (areQuestionsAboutSameTopic(existing.question, question.question)) {
        isDuplicate = true
        duplicateReason = 'same topic'
        break
      }
    }
    
    if (!isDuplicate) {
      uniqueQuestions.push(question)
      allQuestions.push(question) // Add to existing to check against future questions
    } else {
      console.log(`Removed duplicate question: "${question.question.substring(0, 60)}..." (${duplicateReason})`)
    }
  }
  
  return uniqueQuestions
}

/**
 * Calculate similarity between two questions (0-1 scale)
 */
function calculateQuestionSimilarity(q1: string, q2: string): number {
  const words1 = new Set(q1.toLowerCase().split(/\s+/).filter(w => w.length > 3))
  const words2 = new Set(q2.toLowerCase().split(/\s+/).filter(w => w.length > 3))
  
  if (words1.size === 0 || words2.size === 0) return 0
  
  const intersection = new Set([...words1].filter(w => words2.has(w)))
  const union = new Set([...words1, ...words2])
  
  return intersection.size / union.size
}

/**
 * Check if two questions are about the same topic
 */
function areQuestionsAboutSameTopic(q1: string, q2: string): boolean {
  // Extract key terms (longer words that are likely to be topic-specific)
  const extractKeyTerms = (text: string) => {
    return text.toLowerCase()
      .split(/\s+/)
      .filter(w => w.length > 5)
      .map(w => w.replace(/[^\w]/g, ''))
      .filter(w => w.length > 0)
  }
  
  const terms1 = extractKeyTerms(q1)
  const terms2 = extractKeyTerms(q2)
  
  if (terms1.length === 0 || terms2.length === 0) return false
  
  // If more than 50% of key terms match, they're likely about the same topic
  const matchingTerms = terms1.filter(t => terms2.includes(t))
  return matchingTerms.length / Math.max(terms1.length, terms2.length) > 0.5
}

/**
 * Parse AI response into structured questions
 */
function parseQuestions(aiResponse: string): QuizQuestion[] {
  try {
    // Try to extract JSON from the response
    let jsonString = aiResponse.trim()
    
    // Find JSON array in the response
    const jsonMatch = jsonString.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      jsonString = jsonMatch[0]
    }
    
    const parsed = JSON.parse(jsonString)
    
    if (Array.isArray(parsed)) {
      // Validate and normalize questions
      return parsed.map((q: any, index: number) => ({
        id: q.id || `q${index + 1}`,
        type: q.type === 'true-false' ? 'true-false' : 'multiple-choice',
        question: q.question || '',
        options: q.options || (q.type === 'multiple-choice' ? ['Option A', 'Option B', 'Option C', 'Option D'] : undefined),
        correctAnswer: q.correctAnswer !== undefined ? q.correctAnswer : (q.type === 'true-false' ? true : 'Option A'),
        explanation: q.explanation || ''
      })).filter((q: any) => q.question.length > 0)
    }
    
    return []
  } catch (error) {
    console.error('Error parsing AI response:', error)
    console.error('Response was:', aiResponse.substring(0, 500))
    return []
  }
}

