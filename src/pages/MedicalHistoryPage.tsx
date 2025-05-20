
import React, { useState } from 'react';
import { FileText, File, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

// Types for our medical records
type MedicalRecord = {
  id: string;
  title: string;
  content?: string;
  record_type: 'text' | 'voice';
  duration?: string;
  created_at: string;
};

const MedicalHistoryPage: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useUser();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('text');

  // Query to fetch medical records
  const { data: medicalRecords, isLoading, error } = useQuery({
    queryKey: ['medicalRecords', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      // Check if the user ID is the development mock ID, and handle accordingly
      if (user.id === 'dev-user-123') {
        // Return mock data for development
        return [
          {
            id: 'mock-1',
            title: t('annualCheckupResults'),
            content: t('allVitalsNormal'),
            record_type: 'text',
            created_at: new Date().toISOString()
          },
          {
            id: 'mock-2',
            title: t('consultationRecording'),
            record_type: 'voice',
            duration: '3:45',
            created_at: new Date(Date.now() - 86400000).toISOString()
          }
        ] as MedicalRecord[];
      }
      
      const { data, error } = await supabase
        .from('medical_records')
        .select('*')
        .eq(user.role === 'patient' ? 'patient_id' : 'patient_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as MedicalRecord[];
    },
    enabled: !!user,
  });

  // Filter records by type based on active tab
  const textRecords = medicalRecords?.filter(record => record.record_type === 'text') || [];
  const voiceRecords = medicalRecords?.filter(record => record.record_type === 'voice') || [];

  // Function to track downloads
  const trackDownload = async (recordId: string, downloadType: string) => {
    if (!user) return;

    try {
      // Skip tracking for development mock user
      if (user.id === 'dev-user-123') {
        console.log('Download tracking skipped for development user');
        return;
      }

      const { error } = await supabase
        .from('download_history')
        .insert({
          user_id: user.id,
          record_id: recordId,
          download_type: downloadType
        });

      if (error) {
        console.error('Error tracking download:', error);
      }
    } catch (error) {
      console.error('Failed to track download:', error);
    }
  };

  const downloadRecord = async (record: MedicalRecord) => {
    // Mock download for now
    toast({
      title: t('downloadStarted'),
      description: `${record.title} ${t('isBeingDownloaded')}`,
    });

    // Track the download
    await trackDownload(record.id, record.record_type);
  };

  if (error) {
    return (
      <DashboardLayout title={t('medicalHistory')}>
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
          {(error as Error).message || t('errorLoadingRecords')}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={t('medicalHistory')}>
      <Tabs defaultValue="text" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="text">
            <FileText className="h-4 w-4 mr-2" />
            {t('textNotes')}
          </TabsTrigger>
          <TabsTrigger value="voice">
            <File className="h-4 w-4 mr-2" />
            {t('voiceRecordings')}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="text">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : textRecords.length > 0 ? (
            <div className="grid gap-4">
              {textRecords.map((record) => (
                <Card key={record.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{record.title}</CardTitle>
                      <div className="text-sm text-muted-foreground">
                        {new Date(record.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{record.content || t('noContent')}</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => downloadRecord(record)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {t('downloadAsPdf')}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-8">
              <p className="text-muted-foreground">{t('noTextRecords')}</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="voice">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : voiceRecords.length > 0 ? (
            <div className="grid gap-4">
              {voiceRecords.map((record) => (
                <Card key={record.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{record.title}</CardTitle>
                      <div className="text-sm text-muted-foreground">
                        {new Date(record.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-sm text-muted-foreground">
                        {record.duration || t('unknown')}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => downloadRecord(record)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {t('download')}
                      </Button>
                    </div>
                    <div className="h-12 bg-secondary/20 rounded-md flex items-center justify-center">
                      <span className="text-sm text-muted-foreground">{t('audioWaveform')}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-8">
              <p className="text-muted-foreground">{t('noVoiceRecords')}</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default MedicalHistoryPage;
