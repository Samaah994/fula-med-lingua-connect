
import React, { useState } from 'react';
import { FileText, File, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/components/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';

// Mock data for medical records
const mockTextRecords = [
  {
    id: '1',
    title: 'Initial Consultation',
    date: '2023-01-10',
    content: 'Patient reports regular headaches for the past 2 weeks...',
  },
  {
    id: '2',
    title: 'Follow-up Visit',
    date: '2023-01-24',
    content: 'Headaches have decreased in frequency. Blood pressure normal...',
  },
  {
    id: '3',
    title: 'Blood Test Results',
    date: '2023-02-05',
    content: 'All blood work within normal ranges. Vitamin D slightly low...',
  },
];

const mockVoiceRecords = [
  {
    id: '1',
    title: 'Patient Description',
    date: '2023-01-10',
    duration: '2:45',
  },
  {
    id: '2',
    title: 'Doctor Recommendation',
    date: '2023-01-24',
    duration: '3:12',
  },
];

const MedicalHistoryPage: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('text');

  const downloadAsPdf = (recordId: string) => {
    console.log('Downloading record', recordId);
    alert(`Downloading record ${recordId} as PDF...`);
  };

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
          <div className="grid gap-4">
            {mockTextRecords.map((record) => (
              <Card key={record.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{record.title}</CardTitle>
                    <div className="text-sm text-muted-foreground">
                      {new Date(record.date).toLocaleDateString()}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{record.content}</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => downloadAsPdf(record.id)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {t('downloadAsPdf')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="voice">
          <div className="grid gap-4">
            {mockVoiceRecords.map((record) => (
              <Card key={record.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{record.title}</CardTitle>
                    <div className="text-sm text-muted-foreground">
                      {new Date(record.date).toLocaleDateString()}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-muted-foreground">
                      {record.duration}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => downloadAsPdf(record.id)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {t('download')}
                    </Button>
                  </div>
                  <div className="h-12 bg-secondary/20 rounded-md flex items-center justify-center">
                    <span className="text-sm text-muted-foreground">Audio Waveform</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default MedicalHistoryPage;
