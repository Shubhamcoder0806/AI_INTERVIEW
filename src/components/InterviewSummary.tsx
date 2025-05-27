
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface UserInfo {
  name: string;
  role: string;
  experience: string;
  education: string;
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

interface InterviewSummaryProps {
  userInfo: UserInfo;
  answers: Answer[];
  questions: Question[];
  onRestart: () => void;
}

const InterviewSummary: React.FC<InterviewSummaryProps> = ({ userInfo, answers, questions, onRestart }) => {
  const totalScore = answers.reduce((sum, answer) => sum + answer.score, 0);
  const averageScore = totalScore / answers.length;
  const behavioralAnswers = answers.filter(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    return question?.type === 'behavioral';
  });
  const technicalAnswers = answers.filter(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    return question?.type === 'technical';
  });

  const behavioralAvg = behavioralAnswers.length > 0 
    ? behavioralAnswers.reduce((sum, answer) => sum + answer.score, 0) / behavioralAnswers.length 
    : 0;
  const technicalAvg = technicalAnswers.length > 0 
    ? technicalAnswers.reduce((sum, answer) => sum + answer.score, 0) / technicalAnswers.length 
    : 0;

  const getPerformanceLevel = (score: number) => {
    if (score >= 8) return { label: 'Excellent', color: 'bg-green-500', textColor: 'text-green-700' };
    if (score >= 6) return { label: 'Good', color: 'bg-blue-500', textColor: 'text-blue-700' };
    if (score >= 4) return { label: 'Fair', color: 'bg-yellow-500', textColor: 'text-yellow-700' };
    return { label: 'Needs Improvement', color: 'bg-red-500', textColor: 'text-red-700' };
  };

  const performance = getPerformanceLevel(averageScore);

  const strengths = answers
    .filter(answer => answer.score >= 7)
    .map(answer => questions.find(q => q.id === answer.questionId)?.category)
    .filter((category, index, self) => category && self.indexOf(category) === index);

  const improvementAreas = answers
    .filter(answer => answer.score < 6)
    .map(answer => questions.find(q => q.id === answer.questionId)?.category)
    .filter((category, index, self) => category && self.indexOf(category) === index);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Complete!</h1>
          <p className="text-lg text-gray-600">
            Congratulations {userInfo.name}, you've finished your mock interview for {userInfo.role}
          </p>
        </div>

        {/* Overall Performance */}
        <Card className="mb-6 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Overall Performance</CardTitle>
            <CardDescription>Your interview assessment results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="text-6xl font-bold mb-2" style={{ color: performance.textColor.replace('text-', '') }}>
                {averageScore.toFixed(1)}/10
              </div>
              <Badge className={`${performance.color} text-white text-lg px-4 py-2`}>
                {performance.label}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {behavioralAnswers.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Behavioral Questions</h4>
                  <div className="flex items-center space-x-3">
                    <Progress value={(behavioralAvg / 10) * 100} className="flex-1" />
                    <span className="font-bold">{behavioralAvg.toFixed(1)}/10</span>
                  </div>
                </div>
              )}
              
              {technicalAnswers.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Technical Questions</h4>
                  <div className="flex items-center space-x-3">
                    <Progress value={(technicalAvg / 10) * 100} className="flex-1" />
                    <span className="font-bold">{technicalAvg.toFixed(1)}/10</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Strengths */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-green-700">Strengths</CardTitle>
              <CardDescription>Areas where you performed well</CardDescription>
            </CardHeader>
            <CardContent>
              {strengths.length > 0 ? (
                <ul className="space-y-2">
                  {strengths.map((strength, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Focus on providing more detailed and structured responses in future interviews.</p>
              )}
            </CardContent>
          </Card>

          {/* Areas for Improvement */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-orange-700">Areas for Improvement</CardTitle>
              <CardDescription>Focus areas for your next interview</CardDescription>
            </CardHeader>
            <CardContent>
              {improvementAreas.length > 0 ? (
                <ul className="space-y-2">
                  {improvementAreas.map((area, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Great job! You performed consistently well across all question categories.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Question Breakdown */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Question-by-Question Breakdown</CardTitle>
            <CardDescription>Detailed feedback for each question</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {answers.map((answer, index) => {
                const question = questions.find(q => q.id === answer.questionId);
                return (
                  <div key={answer.questionId} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Question {index + 1}: {question?.text}
                        </h4>
                        <div className="flex space-x-2">
                          <Badge variant={question?.type === 'behavioral' ? 'default' : 'secondary'}>
                            {question?.type}
                          </Badge>
                          <Badge variant="outline">{question?.category}</Badge>
                        </div>
                      </div>
                      <Badge variant={answer.score >= 7 ? 'default' : answer.score >= 5 ? 'secondary' : 'destructive'}>
                        {answer.score}/10
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm">{answer.feedback}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="text-center">
          <Button 
            onClick={onRestart}
            size="lg"
            className="px-8 bg-blue-600 hover:bg-blue-700"
          >
            Start New Interview
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewSummary;
