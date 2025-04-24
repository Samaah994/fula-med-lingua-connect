
import React, { useState, useEffect } from 'react';
import { User, Calendar, Settings, Sun, Moon, Volume2, Volume, VolumeX } from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser, UserRole } from '@/contexts/UserContext';
import { useTheme } from '@/contexts/ThemeContext';

// Define theme type
type Theme = 'light' | 'dark';

const ProfilePage: React.FC = () => {
  const { t } = useLanguage();
  const { user, setUser } = useUser();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  
  const [name, setName] = useState(user?.name || '');
  const [age, setAge] = useState<number | undefined>(user?.age);
  const [specialty, setSpecialty] = useState<string>(user?.specialty || '');
  const [isEditing, setIsEditing] = useState(false);

  // Settings state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    // Check for saved sound preference in localStorage
    const savedSound = localStorage.getItem('soundEnabled');
    return savedSound ? savedSound === 'true' : true;
  });
  const [volume, setVolume] = useState<number>(() => {
    // Check for saved volume preference in localStorage
    const savedVolume = localStorage.getItem('volume');
    return savedVolume ? parseInt(savedVolume, 10) : 80;
  });

  // Effect to save sound settings
  useEffect(() => {
    localStorage.setItem('soundEnabled', String(soundEnabled));
    localStorage.setItem('volume', String(volume));
  }, [soundEnabled, volume]);

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

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    toast({
      title: "Theme updated",
      description: `Switched to ${newTheme} theme.`,
    });
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString();
  };

  if (!user) return null;

  return (
    <DashboardLayout title={t('profile')}>
      <div className="grid gap-6 max-w-3xl mx-auto">
        <Tabs defaultValue="profile">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="profile">{t('profileInformation')}</TabsTrigger>
            <TabsTrigger value="settings">{t('settings')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
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
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  {t('applicationSettings')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Theme Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{t('theme')}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {theme === 'light' ? (
                        <Sun className="h-5 w-5 text-orange-500" />
                      ) : (
                        <Moon className="h-5 w-5 text-indigo-400" />
                      )}
                      <span>{theme === 'light' ? t('lightTheme') : t('darkTheme')}</span>
                    </div>
                    <Button onClick={toggleTheme} variant="outline">
                      {theme === 'light' ? t('switchToDark') : t('switchToLight')}
                    </Button>
                  </div>
                </div>
                
                {/* Sound Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{t('sound')}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {soundEnabled ? (
                        <Volume2 className="h-5 w-5" />
                      ) : (
                        <VolumeX className="h-5 w-5" />
                      )}
                      <span>{soundEnabled ? t('soundOn') : t('soundOff')}</span>
                    </div>
                    <Switch
                      checked={soundEnabled}
                      onCheckedChange={setSoundEnabled}
                      aria-label="Toggle sound"
                    />
                  </div>
                  
                  {soundEnabled && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{t('volume')}</span>
                        <span className="text-sm font-medium">{volume}%</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Volume className="h-4 w-4 text-muted-foreground" />
                        <Slider
                          value={[volume]}
                          min={0}
                          max={100}
                          step={1}
                          onValueChange={(values) => setVolume(values[0])}
                          aria-label="Volume"
                        />
                        <Volume2 className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
