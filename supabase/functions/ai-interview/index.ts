
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const geminiApiKey = Deno.env.get('GEMINI_API_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, userInfo, answer, question, previousAnswers } = await req.json();

    console.log('AI Interview request:', { action, userInfo, question: question?.text });

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    switch (action) {
      case 'generateQuestions':
        return await generatePersonalizedQuestions(userInfo);
      
      case 'evaluateAnswer':
        return await evaluateAnswerWithAI(answer, question, userInfo);
      
      case 'generateFollowUp':
        return await generateFollowUpQuestion(answer, question, userInfo, previousAnswers);
      
      default:
        throw new Error('Invalid action');
    }

  } catch (error) {
    console.error('Error in ai-interview function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function generatePersonalizedQuestions(userInfo: any) {
  const prompt = `You are an expert interviewer. Generate 7 interview questions for a candidate applying for ${userInfo.role} position with ${userInfo.experience} experience level and ${userInfo.education} education background.

  Mix behavioral and technical questions. Return a JSON array of objects with this structure:
  {
    "id": number,
    "text": "question text",
    "type": "behavioral" | "technical", 
    "category": "category name"
  }

  Make questions relevant to their experience level:
  - Fresher: Focus on basics, learning ability, projects
  - Mid-level: Focus on problem-solving, team collaboration, technical depth
  - Senior: Focus on leadership, architecture, mentoring, complex decisions

  Only return the JSON array, no other text.`;

  const response = await callGemini(prompt);
  const questions = JSON.parse(response);

  return new Response(
    JSON.stringify({ questions }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function evaluateAnswerWithAI(answer: string, question: any, userInfo: any) {
  const prompt = `You are an expert interviewer evaluating a candidate's answer. 

  Question: "${question.text}"
  Question Type: ${question.type}
  Question Category: ${question.category}
  Candidate Role: ${userInfo.role}
  Experience Level: ${userInfo.experience}
  
  Candidate's Answer: "${answer}"

  Evaluate this answer and provide:
  1. A score from 1-10
  2. Detailed feedback explaining the score
  3. Specific suggestions for improvement

  Consider:
  - Relevance to the question
  - Depth of response
  - Structure (STAR method for behavioral questions)
  - Technical accuracy (for technical questions)
  - Communication clarity
  - Experience level appropriateness

  Return JSON format:
  {
    "score": number,
    "feedback": "detailed feedback text",
    "strengths": ["strength1", "strength2"],
    "improvements": ["improvement1", "improvement2"]
  }`;

  const response = await callGemini(prompt);
  const evaluation = JSON.parse(response);

  return new Response(
    JSON.stringify(evaluation),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function generateFollowUpQuestion(answer: string, question: any, userInfo: any, previousAnswers: any[]) {
  const prompt = `You are an expert interviewer conducting a follow-up question based on the candidate's response.

  Original Question: "${question.text}"
  Candidate's Answer: "${answer}"
  Role: ${userInfo.role}
  Experience: ${userInfo.experience}

  Based on their answer, generate a thoughtful follow-up question that:
  - Digs deeper into their experience
  - Clarifies any vague points
  - Explores specific examples or details
  - Tests their knowledge further

  Return JSON format:
  {
    "followUpQuestion": "your follow-up question text",
    "reasoning": "why this follow-up is valuable"
  }

  If no follow-up is needed, return null for followUpQuestion.`;

  const response = await callGemini(prompt);
  const followUp = JSON.parse(response);

  return new Response(
    JSON.stringify(followUp),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function callGemini(prompt: string): Promise<string> {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Gemini API error:', error);
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}
