# Gemini AI Setup for Quiz Generation

This document explains how to set up Google Gemini API for AI-powered quiz generation in the e-learning platform.

## Overview

The platform uses Google's Gemini AI to automatically generate quiz questions from course content (transcripts, notes, and descriptions). This provides intelligent, context-aware quiz questions for each lesson.

## Getting Your Gemini API Key

1. **Visit Google AI Studio**: Go to [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey) or [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

2. **Sign in** with your Google account

3. **Create API Key**: Click "Create API Key" and select or create a Google Cloud project

4. **Copy the API Key**: Save the generated API key securely

## Free Tier Information

Google Gemini API offers a **generous free tier**:
- **Free tier**: 60 requests per minute (RPM)
- **No credit card required** for free tier
- Perfect for development and small to medium production use

For higher limits, you can upgrade to a paid plan.

## Environment Variable Setup

Add the following to your `.env` file:

```env
GEMINI_API_KEY=your_api_key_here
```

**For Production:**
- Set this in your production environment variables
- Never commit the API key to version control
- Use environment variable management in your hosting platform

## How It Works

1. **Admin adds course content**: When creating/editing lessons, admins can add:
   - Video URLs (YouTube, Vimeo, or direct links)
   - Descriptions
   - Transcripts (for AI quiz generation)
   - Notes (additional context for quiz generation)

2. **Generate Quiz**: Admin clicks "Generate Quiz" button for any lesson
   - The system uses the lesson's transcript, notes, and description
   - Sends content to Gemini AI with course and topic context
   - Gemini generates relevant quiz questions based on the content
   - Questions are displayed in a preview modal

3. **Quiz Types Generated**:
   - Multiple-choice questions (4 options)
   - True/False questions
   - Each question includes explanations

## Admin Features

### Adding Video Content

1. Navigate to Admin → Courses → Select Course
2. Click "Add Lesson" or edit an existing lesson
3. Fill in:
   - **Video URL**: YouTube, Vimeo, or direct video link
   - **Description**: Brief description of the lesson
   - **Transcript**: Full transcript of the video (recommended for best quiz quality)
   - **Notes**: Additional key points or concepts

### Generating Quizzes

1. In the lesson list, click the **"Quiz"** button next to any lesson
2. The system will:
   - Check if lesson has content (transcript, notes, or description)
   - Generate 10 medium-difficulty questions by default
   - Display preview in a modal
3. Review the generated questions
4. Questions are automatically used when students take quizzes

## API Endpoints

### Admin Quiz Generation
- **POST** `/api/admin/lessons/[id]/quiz/generate`
  - Admin-only endpoint
  - Generates quiz questions for preview
  - Body: `{ questionCount: number, difficulty: 'easy' | 'medium' | 'hard' }`

### Student Quiz Generation
- **POST** `/api/lessons/[id]/quiz/generate`
  - Student endpoint (requires lesson completion)
  - Automatically uses course and topic context

## Troubleshooting

### "GEMINI_API_KEY not set" Warning
- Ensure `GEMINI_API_KEY` is set in your environment variables
- Restart your server after adding the variable
- The system will fall back to placeholder questions if the key is missing

### Quiz Generation Fails
- Check that the lesson has content (transcript, notes, or description)
- Verify your API key is valid and has not exceeded rate limits
- Check server logs for detailed error messages

### Rate Limiting
- Free tier: 60 requests per minute
- If you hit the limit, wait a minute before generating more quizzes
- Consider implementing caching for frequently accessed quizzes

## Best Practices

1. **Add Transcripts**: For best quiz quality, always add full transcripts to video lessons
2. **Use Notes**: Add key concepts and important points in the notes field
3. **Review Generated Questions**: Always review AI-generated questions before students use them
4. **Context Matters**: The system uses course name and topic name for better context - ensure these are descriptive

## Security Notes

- Never commit API keys to version control
- Use environment variables for all API keys
- Rotate API keys if they are exposed
- Monitor API usage to detect unusual activity

## Support

For issues with:
- **Gemini API**: Check [Google AI Studio Documentation](https://ai.google.dev/docs)
- **Quiz Generation**: Check server logs and ensure content is available
- **Platform Issues**: Review the main documentation



