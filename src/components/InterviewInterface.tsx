
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { getQuestions, evaluateAnswer, generateFeedback } from '@/utils/interviewLogic';
import InterviewSummary from './InterviewSummary';

interface UserInfo {
  name: string;
  role: string;
  experience: string;
  education: string;
}

interface InterviewInterfaceProps {
  userInfo: UserInfo;
  onRestart: () => void;
}

interface Question {
  id: number;
  text: string;
  type: 'behavioral' | 'technical';
  category: string;
}

interface Answer {
  questionId: number;
  answer: string;
  score: number;
  feedback: string;
}

const InterviewInterface: React.FC<InterviewInterfaceProps> = ({ userInfo, onRestart }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  useEffect(() => {
    const interviewQuestions = getQuestions(userInfo.role, userInfo.experience);
    setQuestions(interviewQuestions);
  }, [userInfo]);

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim()) return;

    setIsEvaluating(true);
    const currentQuestion = questions[currentQuestionIndex];
    
    // Simulate evaluation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const score = evaluateAnswer(currentAnswer, currentQuestion.type);
    const feedback = generateFeedback(currentAnswer, currentQuestion, score);
    
    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      answer: currentAnswer,
      score: score,
      feedback: feedback
    };

    setAnswers([...answers, newAnswer]);
    setCurrentAnswer('');
    setIsEvaluating(false);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsCompleted(true);
    }
  };

  if (isCompleted) {
    return <InterviewSummary userInfo={userInfo} answers={answers} questions={questions} onRestart={onRestart} />;
  }

  if (questions.length === 0) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Preparing your interview...</p>
      </div>
    </div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Mock Interview</h1>
            <Badge variant="secondary" className="text-sm">
              Question {currentQuestionIndex + 1} of {questions.length}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-start mb-2">
              <Badge variant={currentQuestion.type === 'behavioral' ? 'default' : 'secondary'}>
                {currentQuestion.type === 'behavioral' ? 'Behavioral' : 'Technical'}
              </Badge>
              <span className="text-sm text-gray-500">{currentQuestion.category}</span>
            </div>
            <CardTitle className="text-xl leading-relaxed">{currentQuestion.text}</CardTitle>
            {currentQuestion.type === 'behavioral' && (
              <CardDescription>
                Structure your answer using the STAR method (Situation, Task, Action, Result)
              </CardDescription>
            )}
          </CardHeader>
        </Card>

        {/* Answer Section */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Your Answer</CardTitle>
            <CardDescription>
              Take your time to provide a thoughtful response. Aim for 2-3 minutes worth of content.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Type your answer here..."
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              className="min-h-[200px] text-base"
              disabled={isEvaluating}
            />
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {currentAnswer.length} characters
              </div>
              <Button 
                onClick={handleSubmitAnswer}
                disabled={!currentAnswer.trim() || isEvaluating}
                className="px-8 bg-blue-600 hover:bg-blue-700"
              >
                {isEvaluating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Evaluating...
                  </>
                ) : (
                  currentQuestionIndex === questions.length - 1 ? 'Complete Interview' : 'Next Question'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Previous Answers */}
        {answers.length > 0 && (
          <Card className="mt-6 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Previous Questions & Feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {answers.map((answer, index) => {
                const question = questions.find(q => q.id === answer.questionId);
                return (
                  <div key={answer.questionId} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">Q{index + 1}: {question?.text}</h4>
                      <Badge variant={answer.score >= 7 ? 'default' : answer.score >= 5 ? 'secondary' : 'destructive'}>
                        {answer.score}/10
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{answer.feedback}</p>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default InterviewInterface;
