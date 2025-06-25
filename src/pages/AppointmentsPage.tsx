
import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, Clock, Check, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

import DashboardLayout from '@/components/DashboardLayout';

const DOCTORS = [
  { id: '1', name: 'Dr. Sarah Johnson', specialty: 'General Practitioner' },
  { id: '2', name: 'Dr. Michael Chen', specialty: 'Cardiologist' },
  { id: '3', name: 'Dr. Robert Wilson', specialty: 'Pediatrician' },
  { id: '4', name: 'Dr. Emily Davis', specialty: 'Dermatologist' },
];

const TIME_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
  '4:00 PM', '4:30 PM'
];

interface Appointment {
  id: string;
  user_id: string;
  appointment_date: string;
  description: string;
  created_at: string;
  updated_at: string;
}

const AppointmentsPage: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useUser();
  const { toast } = useToast();

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = useState<string>('');
  const [doctor, setDoctor] = useState<string>('');
  const [purpose, setPurpose] = useState<string>('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch appointments on component mount
  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user.id)
        .order('appointment_date', { ascending: true });

      if (error) {
        console.error('Error fetching appointments:', error);
        toast({
          variant: "destructive",
          title: t('errorFetchingAppointments'),
          description: error.message,
        });
      } else {
        setAppointments(data || []);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({
        variant: "destructive",
        title: t('errorFetchingAppointments'),
        description: t('unexpectedError'),
      });
    }
  };
  
  const handleBookAppointment = async () => {
    if (!date || !timeSlot || !doctor || !purpose.trim()) {
      toast({
        variant: "destructive",
        title: t('missingInformation'),
        description: t('pleaseAllFields'),
      });
      return;
    }

    if (!user) {
      toast({
        variant: "destructive",
        title: t('authenticationRequired'),
        description: t('pleaseLogin'),
      });
      return;
    }

    setLoading(true);
    
    try {
      // Combine date and time for the appointment
      const appointmentDateTime = new Date(date);
      appointmentDateTime.setHours(
        parseInt(timeSlot.split(':')[0]) + (timeSlot.includes('PM') && !timeSlot.includes('12') ? 12 : 0),
        parseInt(timeSlot.split(':')[1].split(' ')[0]),
        0,
        0
      );

      // Create a comprehensive description that includes all appointment details
      const appointmentDescription = `Appointment with ${DOCTORS.find(d => d.id === doctor)?.name || 'Unknown Doctor'} at ${timeSlot}. Purpose: ${purpose.trim()}`;

      const { data, error } = await supabase
        .from('appointments')
        .insert([
          {
            user_id: user.id,
            appointment_date: appointmentDateTime.toISOString(),
            description: appointmentDescription
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error booking appointment:', error);
        toast({
          variant: "destructive",
          title: t('bookingFailed'),
          description: error.message,
        });
        return;
      }

      toast({
        title: t('appointmentBooked'),
        description: t('appointmentScheduled').replace('{date}', format(date, 'PPP')).replace('{time}', timeSlot),
      });
      
      // Reset form
      setDate(undefined);
      setTimeSlot('');
      setDoctor('');
      setPurpose('');
      
      // Refresh appointments list
      fetchAppointments();
      
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast({
        variant: "destructive",
        title: t('bookingFailed'),
        description: t('unexpectedError'),
      });
    } finally {
      setLoading(false);
    }
  };

  const upcomingAppointments = appointments.filter(apt => 
    new Date(apt.appointment_date) > new Date()
  );

  const pastAppointments = appointments.filter(apt => 
    new Date(apt.appointment_date) <= new Date()
  );

  return (
    <DashboardLayout title={t('appointments')}>
      <div className="space-y-6">
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="upcoming">{t('upcoming')}</TabsTrigger>
            <TabsTrigger value="book">{t('bookNew')}</TabsTrigger>
            <TabsTrigger value="past">{t('past')}</TabsTrigger>
          </TabsList>
          
          {/* Upcoming Appointments Tab */}
          <TabsContent value="upcoming" className="space-y-4">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))
            ) : (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  {t('noUpcomingAppointments')}
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Book New Appointment Tab */}
          <TabsContent value="book">
            <Card>
              <CardHeader>
                <CardTitle>{t('bookNewAppointment')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('date')}</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>{t('selectDate')}</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          disabled={(date) => 
                            date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                            date.getDay() === 0 || // Disable Sundays
                            date.getDay() === 6    // Disable Saturdays
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('time')}</label>
                    <Select value={timeSlot} onValueChange={setTimeSlot}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('selectTime')} />
                      </SelectTrigger>
                      <SelectContent>
                        {TIME_SLOTS.map((time) => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('doctor')}</label>
                  <Select value={doctor} onValueChange={setDoctor}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectDoctor')} />
                    </SelectTrigger>
                    <SelectContent>
                      {DOCTORS.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.name} - {t(doctor.specialty.toLowerCase().replace(' ', ''))}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('purpose')}</label>
                  <Textarea 
                    placeholder={t('describeReason')}
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                  />
                </div>
                
                <Button 
                  onClick={handleBookAppointment} 
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? t('booking') : t('bookAppointment')}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Past Appointments Tab */}
          <TabsContent value="past" className="space-y-4">
            {pastAppointments.length > 0 ? (
              pastAppointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} isPast />
              ))
            ) : (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  {t('noPastAppointments')}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

interface AppointmentProps {
  appointment: Appointment;
  isPast?: boolean;
}

const AppointmentCard: React.FC<AppointmentProps> = ({ appointment, isPast = false }) => {
  const { t } = useLanguage();
  
  const appointmentDate = new Date(appointment.appointment_date);
  
  return (
    <Card className={cn(
      "transition-all",
      isPast ? "opacity-80" : "hover:shadow-md"
    )}>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">{t('appointment')}</h3>
              <p className="text-sm text-muted-foreground">{appointment.description}</p>
              <div className="flex items-center gap-2 mt-1 text-sm">
                <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{format(appointmentDate, 'PPP')}</span>
                <Clock className="h-3.5 w-3.5 ml-2 text-muted-foreground" />
                <span>{format(appointmentDate, 'p')}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center ml-auto">
            {isPast ? (
              <div className="flex items-center text-sm text-green-600">
                <Check className="h-4 w-4 mr-1" />
                <span>{t('completed')}</span>
              </div>
            ) : (
              <Button variant="outline" size="sm">{t('reschedule')}</Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentsPage;
