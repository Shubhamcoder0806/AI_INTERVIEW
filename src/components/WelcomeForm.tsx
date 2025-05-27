
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Users, Target, TrendingUp } from 'lucide-react';

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

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Questions",
      description: "Dynamic questions tailored to your role and experience"
    },
    {
      icon: Target,
      title: "Real-Time Feedback",
      description: "Get instant evaluation and improvement suggestions"
    },
    {
      icon: TrendingUp,
      title: "Performance Analytics",
      description: "Detailed breakdown of your interview performance"
    },
    {
      icon: Users,
      title: "Industry Standards",
      description: "Questions based on real industry interview patterns"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Hero content */}
            <div className="text-center lg:text-left space-y-8 animate-fade-in">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI-Powered Interview Practice
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Master Your
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Interview</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                  Practice with our AI interviewer, get personalized feedback, and boost your confidence for real interviews.
                </p>
              </div>

              {/* Features grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/80 transition-all duration-300 hover:scale-105">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <feature.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side - Form */}
            <div className="animate-scale-in animation-delay-300">
              <Card className="shadow-2xl bg-white/80 backdrop-blur-sm border-0 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                  <CardTitle className="text-2xl font-bold text-white">Start Your Interview</CardTitle>
                  <CardDescription className="text-blue-100 mt-2">
                    Fill in your details to begin your personalized mock interview
                  </CardDescription>
                </div>
                
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center">
                        <Users className="w-4 h-4 mr-2 text-blue-600" />
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={userInfo.name}
                        onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                        className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-sm font-semibold text-gray-700 flex items-center">
                        <Target className="w-4 h-4 mr-2 text-blue-600" />
                        Target Role
                      </Label>
                      <Select value={userInfo.role} onValueChange={(value) => setUserInfo({ ...userInfo, role: value })}>
                        <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl">
                          <SelectValue placeholder="Select your target role" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-2">
                          {roles.map((role) => (
                            <SelectItem key={role} value={role} className="cursor-pointer hover:bg-blue-50">
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience" className="text-sm font-semibold text-gray-700 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
                        Experience Level
                      </Label>
                      <Select value={userInfo.experience} onValueChange={(value) => setUserInfo({ ...userInfo, experience: value })}>
                        <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl">
                          <SelectValue placeholder="Select your experience level" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-2">
                          {experienceLevels.map((level) => (
                            <SelectItem key={level} value={level} className="cursor-pointer hover:bg-blue-50">
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="education" className="text-sm font-semibold text-gray-700">
                        Education (Optional)
                      </Label>
                      <Input
                        id="education"
                        type="text"
                        placeholder="e.g., B.Tech in Computer Science, 2024"
                        value={userInfo.education}
                        onChange={(e) => setUserInfo({ ...userInfo, education: e.target.value })}
                        className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 rounded-xl shadow-lg hover:shadow-xl"
                      disabled={!userInfo.name || !userInfo.role || !userInfo.experience}
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      Start My Interview
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeForm;
