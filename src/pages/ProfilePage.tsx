
import React, { useState } from 'react';
import { User, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser, UserRole } from '@/contexts/UserContext';

const ProfilePage: React.FC = () => {
  const { t } = useLanguage();
  const { user, setUser } = useUser();
  const { toast } = useToast();
  
  const [name, setName] = useState(user?.name || '');
  const [age, setAge] = useState<number | undefined>(user?.age);
  const [specialty, setSpecialty] = useState<string>(user?.specialty || '');
  const [isEditing, setIsEditing] = useState(false);

  const specialties = [
    { id: 'surgeon', name: t('surgeon') },
    { id: 'generalPractitioner', name: t('generalPractitioner') },
    { id: 'dentist', name: t('dentist') },
    { id: 'pediatrician', name: t('pediatrician') },
    { id: 'gynecologist', name: t('gynecologist') },
  ];

  const handleSave = () => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      name,
      ...(user.role === 'patient' ? { age } : {}),
      ...(user.role === 'doctor' ? { specialty } : {}),
    };
    
    setUser(updatedUser);
    setIsEditing(false);
    
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString();
  };

  if (!user) return null;

  return (
    <DashboardLayout title={t('profile')}>
      <div className="grid gap-6 max-w-2xl mx-auto">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>{t('profileInformation')}</CardTitle>
              {!isEditing ? (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  {t('edit')}
                </Button>
              ) : (
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    {t('cancel')}
                  </Button>
                  <Button onClick={handleSave}>
                    {t('save')}
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {t('name')}
                  </h3>
                  {isEditing ? (
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="font-medium">{name}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {t('email')}
                  </h3>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {t('role')}
                  </h3>
                  <p className="font-medium">{t(user.role)}</p>
                </div>
              </div>

              {user.role === 'patient' && (
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      {t('age')}
                    </h3>
                    {isEditing ? (
                      <Input
                        type="number"
                        min="0"
                        max="120"
                        value={age || ''}
                        onChange={(e) => setAge(parseInt(e.target.value) || undefined)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="font-medium">{age}</p>
                    )}
                  </div>
                </div>
              )}

              {user.role === 'doctor' && (
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      {t('specialty')}
                    </h3>
                    {isEditing ? (
                      <Select
                        value={specialty}
                        onValueChange={setSpecialty}
                      >
                        <SelectTrigger className="mt-1">
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
                    ) : (
                      <p className="font-medium">{t(specialty)}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {t('lastLogin')}
                  </h3>
                  <p className="font-medium">{formatDate(user.lastLogin)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
