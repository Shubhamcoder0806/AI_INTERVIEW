
import React, { useState } from 'react';
import WelcomeForm from '@/components/WelcomeForm';
import InterviewInterface from '@/components/InterviewInterface';

interface UserInfo {
  name: string;
  role: string;
  experience: string;
  education: string;
}

const Index = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);

  const handleStartInterview = (info: UserInfo) => {
    console.log('Starting interview for:', info);
    setUserInfo(info);
    setIsInterviewStarted(true);
  };

  const handleRestart = () => {
    console.log('Restarting interview');
    setUserInfo(null);
    setIsInterviewStarted(false);
  };

  if (!isInterviewStarted || !userInfo) {
    return <WelcomeForm onStartInterview={handleStartInterview} />;
  }

  return <InterviewInterface userInfo={userInfo} onRestart={handleRestart} />;
};

export default Index;
