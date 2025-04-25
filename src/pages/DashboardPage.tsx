import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardLayout from '@/components/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { Calendar, ClipboardList, MessageSquare, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useUser();
  const navigate = useNavigate();
  
  return (
    <DashboardLayout title={t('dashboard')}>
      {user?.role === 'doctor' ? (
        <DoctorDashboard user={user} />
      ) : (
        <PatientDashboard user={user} />
      )}
    </DashboardLayout>
  );
};

const formatDate = (date?: Date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString();
};

const DoctorDashboard = ({ user }: { user: any }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const upcomingAppointments = [
    { id: '1', patient: 'John Doe', time: '10:30 AM', date: 'Apr 25, 2025', reason: 'Regular check-up' },
    { id: '2', patient: 'Jane Smith', time: '2:00 PM', date: 'Apr 28, 2025', reason: 'Follow-up consultation' },
  ];
  
  const recentTranslations = [
    { id: '1', patient: 'Maria Garcia', date: 'Apr 20, 2025', language: 'Fulfulde' },
    { id: '2', patient: 'Ali Hassan', date: 'Apr 18, 2025', language: 'Fulfulde' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Profile Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('name')}:</span>
                <span className="font-medium">{user?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('specialty')}:</span>
                <span className="font-medium">{t(user?.specialty || 'notSpecified')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('lastLogin')}:</span>
                <span className="font-medium">{formatDate(user?.lastLogin)}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-2"
                onClick={() => navigate('/profile')}
              >
                <User className="h-4 w-4 mr-2" />
                {t('viewProfile')}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-3">
                {upcomingAppointments.map(appointment => (
                  <div key={appointment.id} className="text-sm border-b pb-2 last:border-b-0">
                    <div className="font-medium">{appointment.patient}</div>
                    <div className="text-muted-foreground flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {appointment.date}, {appointment.time}
                    </div>
                    <div className="text-xs text-muted-foreground">{appointment.reason}</div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={() => navigate('/appointments')}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  {t('viewAll')}
                </Button>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-4">
                {t('noUpcomingAppointments')}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Recent Translations</CardTitle>
          </CardHeader>
          <CardContent>
            {recentTranslations.length > 0 ? (
              <div className="space-y-3">
                {recentTranslations.map(session => (
                  <div key={session.id} className="text-sm border-b pb-2 last:border-b-0">
                    <div className="font-medium">{session.patient}</div>
                    <div className="text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {session.date}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t('translatedFrom')}: {session.language}
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={() => navigate('/translate')}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {t('translate')}
                </Button>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-4">
                {t('noRecentTranslations')}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Button onClick={() => navigate('/translate')} className="h-20 text-lg justify-start px-4">
              <MessageSquare className="h-6 w-6 mr-4" />
              Start Translation Session
            </Button>
            <Button onClick={() => navigate('/appointments')} variant="outline" className="h-20 text-lg justify-start px-4">
              <Calendar className="h-6 w-6 mr-4" />
              Manage Appointments
            </Button>
            <Button onClick={() => navigate('/medical-history')} variant="outline" className="h-20 text-lg justify-start px-4">
              <ClipboardList className="h-6 w-6 mr-4" />
              View Patient Records
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const PatientDashboard = ({ user }: { user: any }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const upcomingAppointment = {
    doctor: 'Dr. Sarah Johnson',
    specialty: 'General Practitioner',
    date: 'April 25, 2025',
    time: '10:30 AM',
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
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
                <span className="text-muted-foreground">{t('age')}:</span>
                <span className="font-medium">{user?.age}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('lastLogin')}:</span>
                <span className="font-medium">{formatDate(user?.lastLogin)}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-2"
                onClick={() => navigate('/profile')}
              >
                <User className="h-4 w-4 mr-2" />
                {t('viewProfile')}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('nextAppointment')}</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingAppointment ? (
              <div className="space-y-3">
                <div className="font-medium">{upcomingAppointment.doctor}</div>
                <div className="text-sm text-muted-foreground">{upcomingAppointment.specialty}</div>
                <div className="text-sm flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{upcomingAppointment.date}, {upcomingAppointment.time}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={() => navigate('/appointments')}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  {t('viewAllAppointments')}
                </Button>
              </div>
            ) : (
              <div className="py-4 text-center text-muted-foreground">
                <p className="mb-4">{t('noUpcomingAppointments')}</p>
                <Button onClick={() => navigate('/appointments')}>
                  {t('bookAppointment')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('medicalTranslation')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground py-2 mb-4">
              {t('translateWithDoctor')}
            </p>
            <Button 
              onClick={() => navigate('/translate')} 
              className="w-full"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              {t('startTranslation')}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('quickActions')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Button onClick={() => navigate('/translate')} className="h-20 text-lg justify-start px-4">
              <MessageSquare className="h-6 w-6 mr-4" />
              {t('translate')}
            </Button>
            <Button onClick={() => navigate('/appointments')} variant="outline" className="h-20 text-lg justify-start px-4">
              <Calendar className="h-6 w-6 mr-4" />
              {t('bookAppointment')}
            </Button>
            <Button onClick={() => navigate('/medical-history')} variant="outline" className="h-20 text-lg justify-start px-4">
              <ClipboardList className="h-6 w-6 mr-4" />
              {t('medicalHistory')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
