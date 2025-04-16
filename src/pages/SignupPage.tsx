
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import Logo from '@/components/Logo';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser, UserRole } from '@/contexts/UserContext';

const SignupPage: React.FC = () => {
  const { t } = useLanguage();
  const { signup } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | undefined>(undefined);
  const [role, setRole] = useState<UserRole | ''>('');
  const [specialty, setSpecialty] = useState<string | ''>('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const specialties = [
    { id: 'surgeon', name: t('surgeon') },
    { id: 'generalPractitioner', name: t('generalPractitioner') },
    { id: 'dentist', name: t('dentist') },
    { id: 'pediatrician', name: t('pediatrician') },
    { id: 'gynecologist', name: t('gynecologist') },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!role) {
      toast({
        variant: "destructive",
        title: "Please select a role",
        description: "Choose whether you are a patient or a doctor.",
      });
      return;
    }
    
    if (role === 'doctor' && !specialty) {
      toast({
        variant: "destructive",
        title: "Please select a specialty",
        description: "Doctors must select their medical specialty.",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const userData = {
        email,
        password,
        name,
        role: role as UserRole,
        ...(age ? { age } : {}),
        ...(specialty ? { specialty } : {}),
      };
      
      const success = await signup(userData);
      
      if (success) {
        toast({
          title: "Account created",
          description: "Welcome to FulaMed!",
        });
        navigate('/dashboard');
      } else {
        toast({
          variant: "destructive",
          title: "Signup failed",
          description: "Please try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent to-white flex flex-col">
      <header className="p-4 flex justify-between items-center">
        <Logo />
        <LanguageSwitcher />
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <h1 className="text-2xl font-bold text-primary">{t('signup')}</h1>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  {t('name')}
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder={t('enterName')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  {t('email')}
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('enterEmail')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  {t('password')}
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t('enterPassword')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium">
                  {t('selectRole')}
                </label>
                <Select
                  value={role}
                  onValueChange={(value: UserRole) => setRole(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectRole')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="patient">{t('patient')}</SelectItem>
                    <SelectItem value="doctor">{t('doctor')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {role === 'patient' && (
                <div className="space-y-2">
                  <label htmlFor="age" className="text-sm font-medium">
                    {t('age')}
                  </label>
                  <Input
                    id="age"
                    type="number"
                    min="0"
                    max="120"
                    placeholder={t('enterAge')}
                    value={age || ''}
                    onChange={(e) => setAge(parseInt(e.target.value) || undefined)}
                    required
                  />
                </div>
              )}
              
              {role === 'doctor' && (
                <div className="space-y-2">
                  <label htmlFor="specialty" className="text-sm font-medium">
                    {t('specialty')}
                  </label>
                  <Select
                    value={specialty}
                    onValueChange={setSpecialty}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectSpecialty')} />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map(spec => (
                        <SelectItem key={spec.id} value={spec.id}>
                          {spec.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Loading..." : t('signup')}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="justify-center">
            <p className="text-sm text-muted-foreground">
              {t('hasAccount')}{" "}
              <Link to="/login" className="text-primary hover:underline">
                {t('login')}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default SignupPage;
