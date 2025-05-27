
interface Question {
  id: number;
  text: string;
  type: 'behavioral' | 'technical';
  category: string;
}

const questionBank: Record<string, Question[]> = {
  'Frontend Developer': [
    {
      id: 1,
      text: "Tell me about yourself and why you're interested in frontend development.",
      type: 'behavioral',
      category: 'Introduction'
    },
    {
      id: 2,
      text: "Describe a challenging project you worked on. What obstacles did you face and how did you overcome them?",
      type: 'behavioral',
      category: 'Problem Solving'
    },
    {
      id: 3,
      text: "Explain the difference between let, const, and var in JavaScript.",
      type: 'technical',
      category: 'JavaScript Fundamentals'
    },
    {
      id: 4,
      text: "How would you optimize the performance of a React application?",
      type: 'technical',
      category: 'React Performance'
    },
    {
      id: 5,
      text: "Tell me about a time when you had to learn a new technology quickly. How did you approach it?",
      type: 'behavioral',
      category: 'Learning & Adaptability'
    },
    {
      id: 6,
      text: "What is the difference between CSS Grid and Flexbox? When would you use each?",
      type: 'technical',
      category: 'CSS Layout'
    },
    {
      id: 7,
      text: "Describe a situation where you had to work with a difficult team member. How did you handle it?",
      type: 'behavioral',
      category: 'Teamwork'
    }
  ],
  'Backend Developer': [
    {
      id: 1,
      text: "Tell me about yourself and what drew you to backend development.",
      type: 'behavioral',
      category: 'Introduction'
    },
    {
      id: 2,
      text: "Describe a time when you had to debug a complex issue in production. Walk me through your process.",
      type: 'behavioral',
      category: 'Problem Solving'
    },
    {
      id: 3,
      text: "Explain the difference between SQL and NoSQL databases. When would you choose one over the other?",
      type: 'technical',
      category: 'Database Design'
    },
    {
      id: 4,
      text: "How would you design a RESTful API for a social media platform?",
      type: 'technical',
      category: 'API Design'
    },
    {
      id: 5,
      text: "Tell me about a time when you had to optimize system performance. What was your approach?",
      type: 'behavioral',
      category: 'Performance Optimization'
    },
    {
      id: 6,
      text: "Explain the concept of microservices and their advantages and disadvantages.",
      type: 'technical',
      category: 'System Architecture'
    },
    {
      id: 7,
      text: "Describe a situation where you had to make a trade-off between code quality and delivery timeline.",
      type: 'behavioral',
      category: 'Decision Making'
    }
  ],
  'Data Analyst': [
    {
      id: 1,
      text: "Tell me about yourself and what interests you about data analysis.",
      type: 'behavioral',
      category: 'Introduction'
    },
    {
      id: 2,
      text: "Describe a data project where you discovered unexpected insights. How did you communicate these findings?",
      type: 'behavioral',
      category: 'Data Storytelling'
    },
    {
      id: 3,
      text: "Explain the difference between correlation and causation with an example.",
      type: 'technical',
      category: 'Statistical Concepts'
    },
    {
      id: 4,
      text: "How would you approach cleaning and preparing a messy dataset for analysis?",
      type: 'technical',
      category: 'Data Cleaning'
    },
    {
      id: 5,
      text: "Tell me about a time when stakeholders disagreed with your analysis. How did you handle it?",
      type: 'behavioral',
      category: 'Stakeholder Management'
    },
    {
      id: 6,
      text: "What visualization would you choose to represent sales data over time and why?",
      type: 'technical',
      category: 'Data Visualization'
    },
    {
      id: 7,
      text: "Describe a situation where you had to work with incomplete or unreliable data.",
      type: 'behavioral',
      category: 'Problem Solving'
    }
  ]
};

const getDefaultQuestions = (): Question[] => [
  {
    id: 1,
    text: "Tell me about yourself and your career goals.",
    type: 'behavioral',
    category: 'Introduction'
  },
  {
    id: 2,
    text: "Describe a challenging situation you faced and how you overcame it.",
    type: 'behavioral',
    category: 'Problem Solving'
  },
  {
    id: 3,
    text: "What are your greatest strengths and how do they apply to this role?",
    type: 'behavioral',
    category: 'Self Assessment'
  },
  {
    id: 4,
    text: "Tell me about a time when you had to learn something new quickly.",
    type: 'behavioral',
    category: 'Learning & Adaptability'
  },
  {
    id: 5,
    text: "Describe a situation where you had to work as part of a team to achieve a goal.",
    type: 'behavioral',
    category: 'Teamwork'
  },
  {
    id: 6,
    text: "What motivates you in your work and how do you handle pressure?",
    type: 'behavioral',
    category: 'Work Style'
  },
  {
    id: 7,
    text: "Where do you see yourself in 5 years and how does this role fit into your plans?",
    type: 'behavioral',
    category: 'Career Goals'
  }
];

export const getQuestions = (role: string, experience: string): Question[] => {
  const roleQuestions = questionBank[role] || getDefaultQuestions();
  
  // Adjust questions based on experience level
  if (experience.includes('Fresher')) {
    // For freshers, focus more on behavioral questions and basic concepts
    return roleQuestions.slice(0, 6);
  } else if (experience.includes('Senior')) {
    // For senior roles, include all questions including complex technical ones
    return roleQuestions;
  } else {
    // For mid-level, exclude the most basic questions
    return roleQuestions.slice(0, 7);
  }
};

export const evaluateAnswer = (answer: string, questionType: 'behavioral' | 'technical'): number => {
  // Simple scoring algorithm based on answer length and structure
  const wordCount = answer.trim().split(/\s+/).length;
  let score = 0;
  
  // Base score from word count
  if (wordCount < 20) score = 3;
  else if (wordCount < 50) score = 5;
  else if (wordCount < 100) score = 7;
  else if (wordCount < 200) score = 8;
  else score = 9;
  
  // Adjust for question type
  if (questionType === 'behavioral') {
    // Look for STAR method indicators
    const starKeywords = ['situation', 'task', 'action', 'result', 'challenge', 'outcome', 'learned'];
    const starMatches = starKeywords.filter(keyword => 
      answer.toLowerCase().includes(keyword)
    ).length;
    
    if (starMatches >= 3) score += 1;
    if (starMatches >= 2) score += 0.5;
  } else {
    // Technical questions - look for technical terms and explanations
    const technicalKeywords = ['because', 'however', 'therefore', 'example', 'implement', 'optimize'];
    const technicalMatches = technicalKeywords.filter(keyword => 
      answer.toLowerCase().includes(keyword)
    ).length;
    
    if (technicalMatches >= 2) score += 1;
    if (technicalMatches >= 1) score += 0.5;
  }
  
  // Cap the score at 10
  return Math.min(Math.round(score * 10) / 10, 10);
};

export const generateFeedback = (answer: string, question: Question, score: number): string => {
  const feedbackTemplates = {
    excellent: [
      "Excellent response! You provided a comprehensive answer with great examples and clear structure.",
      "Outstanding! Your answer demonstrates strong understanding and excellent communication skills.",
      "Fantastic response! You covered all key points with specific examples and clear reasoning."
    ],
    good: [
      "Good response! You addressed the question well, though you could expand on some points.",
      "Well done! Your answer shows good understanding, consider adding more specific examples.",
      "Nice work! You provided a solid answer, try to structure it more clearly next time."
    ],
    fair: [
      "Fair response. Your answer touches on key points but could be more detailed and structured.",
      "You're on the right track, but try to provide more specific examples and elaborate further.",
      "Good start! Consider using the STAR method for behavioral questions and more technical depth for technical ones."
    ],
    poor: [
      "Your answer could be improved. Try to provide more detail and specific examples.",
      "Consider expanding your response with more concrete examples and clearer structure.",
      "Think about structuring your answer more clearly and providing specific examples from your experience."
    ]
  };
  
  let category: keyof typeof feedbackTemplates;
  if (score >= 8) category = 'excellent';
  else if (score >= 6) category = 'good';
  else if (score >= 4) category = 'fair';
  else category = 'poor';
  
  const templates = feedbackTemplates[category];
  const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
  
  // Add specific feedback based on question type
  let specificFeedback = '';
  if (question.type === 'behavioral' && score < 7) {
    specificFeedback = " For behavioral questions, try using the STAR method: describe the Situation, Task, Action you took, and Result achieved.";
  } else if (question.type === 'technical' && score < 7) {
    specificFeedback = " For technical questions, provide clear explanations, examples, and consider discussing trade-offs or alternatives.";
  }
  
  return randomTemplate + specificFeedback;
};
