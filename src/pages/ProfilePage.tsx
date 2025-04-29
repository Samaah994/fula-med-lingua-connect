
import React, { useState, useEffect, useRef } from 'react';
import { User, Calendar, Settings, Sun, Moon, Volume2, Volume, VolumeX, Upload, Camera } from 'lucide-react';
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
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';

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
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.avatarUrl || null);
  const [uploading, setUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      avatarUrl
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

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Validate file type
    if (!file.type.match('image/jpeg|image/png|image/jpg')) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a JPEG or PNG image.",
      });
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
      });
      return;
    }

    setUploading(true);
    
    try {
      // For demo purposes, we're creating an object URL directly
      // In a real app with Supabase, you would upload to storage
      const objectUrl = URL.createObjectURL(file);
      setAvatarUrl(objectUrl);
      
      // For a real implementation with Supabase, uncomment this:
      /*
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
      
      const { error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);
        
      if (error) {
        throw error;
      }
      
      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
      setAvatarUrl(data.publicUrl);
      */
      
      toast({
        title: "Upload successful",
        description: "Your profile picture has been updated.",
      });
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was an error uploading your profile picture.",
      });
      console.error("Error uploading avatar:", error);
    } finally {
      setUploading(false);
    }
  };

  if (!user) return null;

  const userInitials = user.name ? user.name.charAt(0).toUpperCase() : 'U';

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
                      <Button variant="outline" onClick={() => {
                        setIsEditing(false);
                        setName(user.name || '');
                        setAge(user.age);
                        setSpecialty(user.specialty || '');
                        setAvatarUrl(user.avatarUrl || null);
                      }}>
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
                <div className="flex flex-col items-center mb-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={avatarUrl || undefined} alt={user.name} />
                      <AvatarFallback className="text-2xl bg-primary/10 text-primary">{userInitials}</AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <div className="absolute -bottom-2 -right-2">
                        <Button 
                          size="icon"
                          variant="outline" 
                          className="rounded-full h-8 w-8 bg-background"
                          onClick={triggerFileInput}
                          disabled={uploading}
                        >
                          {uploading ? (
                            <span className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                          ) : (
                            <Camera className="h-4 w-4" />
                          )}
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/png, image/jpeg"
                          className="hidden"
                          onChange={handleFileChange}
                          disabled={uploading}
                        />
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {t('clickToUpload')}
                    </p>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      {t('name')}
                    </label>
                    {isEditing ? (
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    ) : (
                      <p className="font-medium">{name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      {t('email')}
                    </label>
                    <p className="font-medium">{user.email}</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      {t('role')}
                    </label>
                    <p className="font-medium">{t(user.role)}</p>
                  </div>

                  {user.role === 'patient' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        {t('age')}
                      </label>
                      {isEditing ? (
                        <Input
                          type="number"
                          min="0"
                          max="120"
                          value={age || ''}
                          onChange={(e) => setAge(parseInt(e.target.value) || undefined)}
                        />
                      ) : (
                        <p className="font-medium">{age}</p>
                      )}
                    </div>
                  )}

                  {user.role === 'doctor' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        {t('specialty')}
                      </label>
                      {isEditing ? (
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
                      ) : (
                        <p className="font-medium">{t(specialty)}</p>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      {t('lastLogin')}
                    </label>
                    <p className="font-medium">{formatDate(user.lastLogin)}</p>
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
