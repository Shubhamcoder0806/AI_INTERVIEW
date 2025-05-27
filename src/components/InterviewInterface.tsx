
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { getQuestions, evaluateAnswer, generateFeedback } from '@/utils/interviewLogic';
import InterviewSummary from './InterviewSummary';
import { MessageCircle, Clock, ChevronRight, Brain, User, Star, AlertCircle } from 'lucide-react';

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
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <Brain className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">Preparing Your Interview</h3>
            <p className="text-gray-600">Our AI is customizing questions for your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 backdrop-blur-sm bg-white/95">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mock Interview</h1>
                <p className="text-gray-600">Interview for {userInfo.role}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-sm px-4 py-2 bg-blue-50 border-blue-200">
                <User className="w-4 h-4 mr-2" />
                {userInfo.name}
              </Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">
                Question {currentQuestionIndex + 1} of {questions.length}
              </Badge>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-3 bg-gray-200" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Question Card */}
        <Card className="shadow-xl bg-white border-0 overflow-hidden animate-fade-in">
          <div className={`p-6 ${currentQuestion.type === 'behavioral' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-purple-500 to-indigo-600'}`}>
            <div className="flex items-center justify-between mb-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-0 backdrop-blur-sm">
                {currentQuestion.type === 'behavioral' ? 'Behavioral Question' : 'Technical Question'}
              </Badge>
              <div className="flex items-center text-white/80 text-sm">
                <Clock className="w-4 h-4 mr-1" />
                2-3 minutes recommended
              </div>
            </div>
            <CardTitle className="text-2xl text-white leading-relaxed mb-3">
              {currentQuestion.text}
            </CardTitle>
            <div className="flex items-center text-white/90">
              <span className="text-sm font-medium">{currentQuestion.category}</span>
            </div>
          </div>
          
          {currentQuestion.type === 'behavioral' && (
            <div className="p-6 bg-green-50 border-t">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-800 mb-1">STAR Method Tip</h4>
                  <p className="text-green-700 text-sm">
                    Structure your answer: <strong>Situation</strong> → <strong>Task</strong> → <strong>Action</strong> → <strong>Result</strong>
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Answer Section */}
        <Card className="shadow-xl bg-white border-0">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Your Answer</CardTitle>
                <CardDescription>
                  Take your time to provide a thoughtful, detailed response
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Textarea
              placeholder="Start typing your answer here..."
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              className="min-h-[200px] text-base border-2 border-gray-200 focus:border-blue-500 rounded-xl resize-none"
              disabled={isEvaluating}
            />
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500 flex items-center space-x-4">
                <span>{currentAnswer.length} characters</span>
                <span className="text-gray-300">|</span>
                <span>~{Math.ceil(currentAnswer.length / 200)} minutes</span>
              </div>
              <Button 
                onClick={handleSubmitAnswer}
                disabled={!currentAnswer.trim() || isEvaluating}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 rounded-xl font-semibold"
                size="lg"
              >
                {isEvaluating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Evaluating Answer...
                  </>
                ) : (
                  <>
                    {currentQuestionIndex === questions.length - 1 ? 'Complete Interview' : 'Next Question'}
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Previous Answers */}
        {answers.length > 0 && (
          <Card className="shadow-xl bg-white border-0">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Star className="w-6 h-6 mr-3 text-yellow-500" />
                Previous Questions & Feedback
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {answers.map((answer, index) => {
                const question = questions.find(q => q.id === answer.questionId);
                return (
                  <div key={answer.questionId} className="border border-gray-200 rounded-xl p-6 bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Q{index + 1}: {question?.text}
                        </h4>
                        <div className="flex space-x-2">
                          <Badge variant={question?.type === 'behavioral' ? 'default' : 'secondary'} className="text-xs">
                            {question?.type}
                          </Badge>
                          <Badge variant="outline" className="text-xs">{question?.category}</Badge>
                        </div>
                      </div>
                      <Badge 
                        variant={answer.score >= 7 ? 'default' : answer.score >= 5 ? 'secondary' : 'destructive'}
                        className="text-sm font-bold px-3 py-1"
                      >
                        {answer.score}/10
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 bg-white p-4 rounded-lg border">{answer.feedback}</p>
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
