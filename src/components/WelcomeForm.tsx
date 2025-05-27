
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface UserInfo {
  name: string;
  role: string;
  experience: string;
  education: string;
}

interface WelcomeFormProps {
  onStartInterview: (userInfo: UserInfo) => void;
}

const WelcomeForm: React.FC<WelcomeFormProps> = ({ onStartInterview }) => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    role: '',
    experience: '',
    education: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInfo.name && userInfo.role && userInfo.experience) {
      onStartInterview(userInfo);
    }
  };

  const roles = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Data Analyst',
    'Data Scientist',
    'Product Manager',
    'UI/UX Designer',
    'Marketing Associate',
    'Business Analyst',
    'Software Engineer',
    'DevOps Engineer',
    'QA Engineer'
  ];

  const experienceLevels = [
    'Fresher (0-1 years)',
    'Junior (1-3 years)',
    'Mid-level (3-5 years)',
    'Senior (5+ years)'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">AI Interview Simulator</CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Practice your interview skills with our AI-powered mock interviews. Get personalized feedback and improve your performance.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={userInfo.name}
                  onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                  className="h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium text-gray-700">Job Role</Label>
                <Select value={userInfo.role} onValueChange={(value) => setUserInfo({ ...userInfo, role: value })}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select your target role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience" className="text-sm font-medium text-gray-700">Experience Level</Label>
                <Select value={userInfo.experience} onValueChange={(value) => setUserInfo({ ...userInfo, experience: value })}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceLevels.map((level) => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="education" className="text-sm font-medium text-gray-700">Education</Label>
                <Input
                  id="education"
                  type="text"
                  placeholder="e.g., B.Tech in Computer Science, 2024"
                  value={userInfo.education}
                  onChange={(e) => setUserInfo({ ...userInfo, education: e.target.value })}
                  className="h-12"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700 transition-colors"
              disabled={!userInfo.name || !userInfo.role || !userInfo.experience}
            >
              Start Mock Interview
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeForm;
