
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardLayout from '@/components/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';

const DashboardPage: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useUser();
  
  const formatDate = (date?: Date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString();
  };

  return (
    <DashboardLayout title={t('home')}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('profile')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('name')}:</span>
                <span className="font-medium">{user?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('email')}:</span>
                <span className="font-medium">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('role')}:</span>
                <span className="font-medium">{user ? t(user.role) : ''}</span>
              </div>
              {user?.role === 'patient' && user?.age && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('age')}:</span>
                  <span className="font-medium">{user.age}</span>
                </div>
              )}
              {user?.role === 'doctor' && user?.specialty && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('specialty')}:</span>
                  <span className="font-medium">{t(user.specialty)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('lastLogin')}:</span>
                <span className="font-medium">{formatDate(user?.lastLogin)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('medicalHistory')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground py-4">
              {t('medicalRecords')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('translate')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground py-4">
              {t(user?.role === 'doctor' ? 'translateToFulfulde' : 'translateFromFulfulde')}
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
