
import { supabase } from "@/integrations/supabase/client";

export interface AIQuestion {
  id: number;
  text: string;
  type: 'behavioral' | 'technical';
  category: string;
}

export interface AIEvaluation {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export interface FollowUpResult {
  followUpQuestion: string | null;
  reasoning: string;
}

export const generateAIQuestions = async (userInfo: any): Promise<AIQuestion[]> => {
  console.log('Generating AI questions for:', userInfo);
  
  const { data, error } = await supabase.functions.invoke('ai-interview', {
    body: {
      action: 'generateQuestions',
      userInfo
    }
  });

  if (error) {
    console.error('Error generating AI questions:', error);
    throw error;
  }

  return data.questions;
};

export const evaluateAnswerWithAI = async (
  answer: string, 
  question: AIQuestion, 
  userInfo: any
): Promise<AIEvaluation> => {
  console.log('Evaluating answer with AI:', { answer: answer.substring(0, 100), question: question.text });
  
  const { data, error } = await supabase.functions.invoke('ai-interview', {
    body: {
      action: 'evaluateAnswer',
      answer,
      question,
      userInfo
    }
  });

  if (error) {
    console.error('Error evaluating answer:', error);
    throw error;
  }

  return data;
};

export const generateFollowUp = async (
  answer: string,
  question: AIQuestion,
  userInfo: any,
  previousAnswers: any[]
): Promise<FollowUpResult> => {
  console.log('Generating follow-up question');
  
  const { data, error } = await supabase.functions.invoke('ai-interview', {
    body: {
      action: 'generateFollowUp',
      answer,
      question,
      userInfo,
      previousAnswers
    }
  });

  if (error) {
    console.error('Error generating follow-up:', error);
    throw error;
  }

  return data;
};
