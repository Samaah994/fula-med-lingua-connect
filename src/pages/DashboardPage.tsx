
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardLayout from '@/components/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { Calendar, ClipboardList, MessageSquare, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const DashboardPage: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useUser();
  const navigate = useNavigate();
  
  return (
    <DashboardLayout title="Dashboard">
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

  const userInitials = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Profile Overview</CardTitle>
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                <AvatarFallback className="bg-primary/10 text-primary">{userInitials}</AvatarFallback>
              </Avatar>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Name</span>
                <span className="font-medium text-right">{user?.name}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Specialty</span>
                <span className="font-medium text-right">{t(user?.specialty || 'notSpecified')}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Last Login</span>
                <span className="font-medium text-right">{formatDate(user?.lastLogin)}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-4"
                onClick={() => navigate('/profile')}
              >
                <User className="h-4 w-4 mr-2" />
                View Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Upcoming Appointments</CardTitle>
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
                  View All
                </Button>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-4">
                No upcoming appointments
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Recent Translations</CardTitle>
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
                      Translated from: {session.language}
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
                  Translate
                </Button>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-4">
                No recent translations
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-semibold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Button onClick={() => navigate('/translate')} className="h-20 text-lg justify-start px-4">
              <MessageSquare className="h-6 w-6 mr-4" />
              Start Translation
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

  const userInitials = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Profile</CardTitle>
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                <AvatarFallback className="bg-primary/10 text-primary">{userInitials}</AvatarFallback>
              </Avatar>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Name</span>
                <span className="font-medium text-right">{user?.name}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Age</span>
                <span className="font-medium text-right">{user?.age}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Last Login</span>
                <span className="font-medium text-right">{formatDate(user?.lastLogin)}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-2"
                onClick={() => navigate('/profile')}
              >
                <User className="h-4 w-4 mr-2" />
                View Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
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
                  View All Appointments
                </Button>
              </div>
            ) : (
              <div className="py-4 text-center text-muted-foreground">
                <p className="mb-4">No upcoming appointments</p>
                <Button onClick={() => navigate('/appointments')}>
                  Book Appointment
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Translations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground py-2 mb-4">
              Translate with your doctor
            </p>
            <Button 
              onClick={() => navigate('/translate')} 
              className="w-full"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Start Translation
            </Button>
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
              Translate
            </Button>
            <Button onClick={() => navigate('/appointments')} variant="outline" className="h-20 text-lg justify-start px-4">
              <Calendar className="h-6 w-6 mr-4" />
              Book Appointment
            </Button>
            <Button onClick={() => navigate('/medical-history')} variant="outline" className="h-20 text-lg justify-start px-4">
              <ClipboardList className="h-6 w-6 mr-4" />
              Medical History
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
