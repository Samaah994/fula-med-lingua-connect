import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

// Updated interface to match actual database schema
interface Appointment {
  id: number; // Changed from string to number to match database
  user_id: string;
  appointment_date: string;
  description: string;
  created_at: string;
  updated_at: string;
}

const DOCTORS = [
  { id: '1', name: 'Dr. Amadou Ba', specialty: 'Cardiology', avatar: '/placeholder.svg' },
  { id: '2', name: 'Dr. Fatima Diallo', specialty: 'Pediatrics', avatar: '/placeholder.svg' },
  { id: '3', name: 'Dr. Mamadou Sow', specialty: 'Internal Medicine', avatar: '/placeholder.svg' },
  { id: '4', name: 'Dr. Aissatou Kane', specialty: 'Gynecology', avatar: '/placeholder.svg' },
];

const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30'
];

const AppointmentsPage: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useUser();
  const { toast } = useToast();
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  
  // Form state
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [purpose, setPurpose] = useState('');
  const [isCreating, setIsCreating] = useState(false);

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
          title: "Error",
          description: "Failed to load appointments",
        });
        return;
      }

      setAppointments(data || []);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !selectedDate || !selectedTimeSlot || !selectedDoctor || !purpose.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      });
      return;
    }

    setIsCreating(true);

    try {
      // Parse selected date and time
      const [hours, minutes] = selectedTimeSlot.split(':').map(Number);
      const appointmentDateTime = new Date(selectedDate);
      appointmentDateTime.setHours(hours, minutes, 0, 0);

      // Create a comprehensive description that includes all appointment details
      const appointmentDescription = `Appointment with ${DOCTORS.find(d => d.id === selectedDoctor)?.name || 'Unknown Doctor'} at ${selectedTimeSlot}. Purpose: ${purpose.trim()}`;

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
        console.error('Error creating appointment:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create appointment",
        });
        return;
      }

      // Add the new appointment to the list
      setAppointments(prev => [...prev, data]);
      
      // Reset form
      setSelectedDate('');
      setSelectedTimeSlot('');
      setSelectedDoctor('');
      setPurpose('');
      setShowNewAppointment(false);

      toast({
        title: "Success",
        description: "Appointment created successfully",
      });

    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
    } finally {
      setIsCreating(false);
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
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{t('appointments')}</h1>
          <Button onClick={() => setShowNewAppointment(!showNewAppointment)}>
            <Plus className="h-4 w-4 mr-2" />
            {t('newAppointment')}
          </Button>
        </div>

        {/* New Appointment Form */}
        {showNewAppointment && (
          <Card>
            <CardHeader>
              <CardTitle>{t('scheduleNewAppointment')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateAppointment} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">{t('date')}:</label>
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">{t('timeSlot')}:</label>
                    <Select value={selectedTimeSlot} onValueChange={setSelectedTimeSlot}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('selectTimeSlot')} />
                      </SelectTrigger>
                      <SelectContent>
                        {TIME_SLOTS.map(slot => (
                          <SelectItem key={slot} value={slot}>
                            {slot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">{t('doctor')}:</label>
                  <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectDoctor')} />
                    </SelectTrigger>
                    <SelectContent>
                      {DOCTORS.map(doctor => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.name} - {doctor.specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">{t('purpose')}:</label>
                  <Textarea
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder={t('describePurpose')}
                    rows={3}
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={isCreating}>
                    {isCreating ? t('creating') : t('createAppointment')}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowNewAppointment(false)}>
                    {t('cancel')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {t('upcomingAppointments')} ({upcomingAppointments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">Loading...</div>
            ) : upcomingAppointments.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                {t('noUpcomingAppointments')}
              </p>
            ) : (
              <div className="space-y-3">
                {upcomingAppointments.map(appointment => (
                  <AppointmentCard 
                    key={appointment.id} 
                    appointment={appointment} 
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Past Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {t('pastAppointments')} ({pastAppointments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pastAppointments.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                {t('noPastAppointments')}
              </p>
            ) : (
              <div className="space-y-3">
                {pastAppointments.map(appointment => (
                  <AppointmentCard 
                    key={appointment.id} 
                    appointment={appointment} 
                    isPast={true}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
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
    <Card className={`p-4 ${isPast ? 'opacity-75' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-full ${isPast ? 'bg-gray-100' : 'bg-primary/10'}`}>
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
      </div>
    </Card>
  );
};

export default AppointmentsPage;
