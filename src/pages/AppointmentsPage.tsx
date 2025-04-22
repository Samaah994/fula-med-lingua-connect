
import React, { useState } from 'react';
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

import DashboardLayout from '@/components/DashboardLayout';

// Mock data
const MOCK_UPCOMING_APPOINTMENTS = [
  {
    id: '1',
    date: new Date(2025, 4, 25, 10, 30),
    doctor: 'Dr. Sarah Johnson',
    purpose: 'Regular check-up',
    location: 'Main Hospital, Room 205',
  },
  {
    id: '2',
    date: new Date(2025, 4, 28, 14, 0),
    doctor: 'Dr. Michael Chen',
    purpose: 'Follow-up consultation',
    location: 'Medical Center, Floor 3',
  },
];

const MOCK_PAST_APPOINTMENTS = [
  {
    id: '3',
    date: new Date(2025, 3, 15, 9, 0),
    doctor: 'Dr. Sarah Johnson',
    purpose: 'Annual physical',
    location: 'Main Hospital, Room 205',
    completed: true,
  },
  {
    id: '4',
    date: new Date(2025, 2, 10, 11, 30),
    doctor: 'Dr. Robert Wilson',
    purpose: 'Vaccination',
    location: 'Community Clinic',
    completed: true,
  },
];

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

const AppointmentsPage: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useUser();
  const { toast } = useToast();

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = useState<string>('');
  const [doctor, setDoctor] = useState<string>('');
  const [purpose, setPurpose] = useState<string>('');
  
  const handleBookAppointment = () => {
    if (!date || !timeSlot || !doctor || !purpose.trim()) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all fields to book an appointment.",
      });
      return;
    }
    
    toast({
      title: "Appointment Booked",
      description: `Your appointment has been scheduled for ${format(date, 'PPP')} at ${timeSlot}.`,
    });
    
    // Reset form
    setDate(undefined);
    setTimeSlot('');
    setDoctor('');
    setPurpose('');
  };

  return (
    <DashboardLayout title={t('appointments')}>
      <div className="space-y-6">
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="book">Book New</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          
          {/* Upcoming Appointments Tab */}
          <TabsContent value="upcoming" className="space-y-4">
            {MOCK_UPCOMING_APPOINTMENTS.length > 0 ? (
              MOCK_UPCOMING_APPOINTMENTS.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))
            ) : (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No upcoming appointments scheduled.
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Book New Appointment Tab */}
          <TabsContent value="book">
            <Card>
              <CardHeader>
                <CardTitle>Book New Appointment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
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
                          {date ? format(date, "PPP") : <span>Select date</span>}
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
                    <label className="text-sm font-medium">Time</label>
                    <Select value={timeSlot} onValueChange={setTimeSlot}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
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
                  <label className="text-sm font-medium">Doctor</label>
                  <Select value={doctor} onValueChange={setDoctor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {DOCTORS.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.name} - {doctor.specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Purpose</label>
                  <Textarea 
                    placeholder="Briefly describe the reason for your appointment"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                  />
                </div>
                
                <Button onClick={handleBookAppointment} className="w-full">
                  Book Appointment
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Past Appointments Tab */}
          <TabsContent value="past" className="space-y-4">
            {MOCK_PAST_APPOINTMENTS.length > 0 ? (
              MOCK_PAST_APPOINTMENTS.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} isPast />
              ))
            ) : (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No past appointments found.
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
  appointment: {
    id: string;
    date: Date;
    doctor: string;
    purpose: string;
    location: string;
    completed?: boolean;
  };
  isPast?: boolean;
}

const AppointmentCard: React.FC<AppointmentProps> = ({ appointment, isPast = false }) => {
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
              <h3 className="font-medium">{appointment.doctor}</h3>
              <p className="text-sm text-muted-foreground">{appointment.purpose}</p>
              <div className="flex items-center gap-2 mt-1 text-sm">
                <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{format(appointment.date, 'PPP')}</span>
                <Clock className="h-3.5 w-3.5 ml-2 text-muted-foreground" />
                <span>{format(appointment.date, 'p')}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{appointment.location}</p>
            </div>
          </div>
          
          <div className="flex items-center ml-auto">
            {isPast ? (
              <div className="flex items-center text-sm text-green-600">
                <Check className="h-4 w-4 mr-1" />
                <span>Completed</span>
              </div>
            ) : (
              <Button variant="outline" size="sm">Reschedule</Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentsPage;
