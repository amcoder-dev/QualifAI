import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Phone, 
  Mail, 
  FileText, 
  Users,
  MoreHorizontal
} from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  type: 'Call' | 'Email' | 'Task' | 'Meeting';
  date: Date;
  time: string;
  priority: 'High' | 'Medium' | 'Low';
  description?: string;
  with?: string;
}

export const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  
  // Mock events
  const events: CalendarEvent[] = [
    {
      id: '1',
      title: 'Call with Dave Peterson',
      type: 'Call',
      date: new Date(2025, 2, 22), // March 22, 2025
      time: '10:30 AM',
      priority: 'High',
      with: 'Dave Peterson'
    },
    {
      id: '2',
      title: 'Send proposal to Contoso Ltd',
      type: 'Email',
      date: new Date(2025, 2, 22), // March 22, 2025
      time: '2:00 PM',
      priority: 'Medium',
      with: 'Contoso Ltd'
    },
    {
      id: '3',
      title: 'Follow up with Global Tech',
      type: 'Task',
      date: new Date(2025, 2, 23), // March 23, 2025
      time: '11:00 AM',
      priority: 'Medium',
      with: 'Global Tech'
    },
    {
      id: '4',
      title: 'Quarterly review meeting',
      type: 'Meeting',
      date: new Date(2025, 2, 24), // March 24, 2025
      time: '3:00 PM',
      priority: 'Low'
    },
    {
      id: '5',
      title: 'Strategy planning session',
      type: 'Meeting',
      date: new Date(2025, 2, 25), // March 25, 2025
      time: '1:00 PM',
      priority: 'Medium'
    },
    {
      id: '6',
      title: 'Demo with new client',
      type: 'Call',
      date: new Date(2025, 2, 26), // March 26, 2025
      time: '10:00 AM',
      priority: 'High',
      with: 'ABC Corp'
    }
  ];

  // Helper functions
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'Call':
        return <Phone className="w-4 h-4 text-blue-500" />;
      case 'Email':
        return <Mail className="w-4 h-4 text-purple-500" />;
      case 'Task':
        return <FileText className="w-4 h-4 text-yellow-500" />;
      case 'Meeting':
        return <Users className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-500';
      case 'Medium':
        return 'bg-yellow-500';
      case 'Low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Navigate between months
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const today = () => {
    setCurrentDate(new Date());
  };

  // Calendar generation
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    const lastDayOfPrevMonth = getDaysInMonth(year, month - 1);
    
    const days = [];
    const today = new Date();

    // Previous month days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const day = lastDayOfPrevMonth - i;
      days.push(
        <div key={`prev-${day}`} className="h-28 p-1 border border-gray-200 bg-gray-50 text-gray-400">
          <div className="text-sm">{day}</div>
        </div>
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = 
        date.getDate() === today.getDate() && 
        date.getMonth() === today.getMonth() && 
        date.getFullYear() === today.getFullYear();
      
      // Get events for this day
      const dayEvents = events.filter(event => 
        event.date.getDate() === day && 
        event.date.getMonth() === month && 
        event.date.getFullYear() === year
      );

      days.push(
        <div 
          key={`current-${day}`} 
          className={`h-28 p-1 border border-gray-200 bg-white relative ${isToday ? 'ring-2 ring-[#403DA1] ring-inset' : ''}`}
        >
          <div className={`text-sm font-medium ${isToday ? 'bg-[#403DA1] text-white rounded-full w-6 h-6 flex items-center justify-center' : ''}`}>
            {day}
          </div>
          <div className="mt-1 space-y-1 overflow-y-auto max-h-20">
            {dayEvents.map(event => (
              <div
                key={event.id}
                className="flex items-center gap-1 p-1 rounded-md text-xs bg-gray-50 hover:bg-gray-100 cursor-pointer"
              >
                <div className={`w-1 h-1 rounded-full ${getPriorityColor(event.priority)}`}></div>
                {getEventIcon(event.type)}
                <span className="truncate">{event.title}</span>
              </div>
            ))}
          </div>
          {dayEvents.length > 2 && (
            <div className="absolute bottom-1 right-1 text-xs text-gray-500">
              +{dayEvents.length - 2} more
            </div>
          )}
        </div>
      );
    }

    // Next month days
    const totalCells = 42; // 6 rows x 7 days
    const remainingCells = totalCells - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      days.push(
        <div key={`next-${day}`} className="h-28 p-1 border border-gray-200 bg-gray-50 text-gray-400">
          <div className="text-sm">{day}</div>
        </div>
      );
    }

    return days;
  };

  // Get month name
  const getMonthName = (date: Date) => {
    return date.toLocaleString('default', { month: 'long' });
  };

  // Render agenda view (upcoming events)
  const renderAgenda = () => {
    const now = new Date();
    const upcomingEvents = events
      .filter(event => event.date >= now)
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    return (
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold">Upcoming Events</h3>
        </div>
        <div className="divide-y divide-gray-200 border-t border-gray-100">
          {upcomingEvents.map(event => (
            <div key={event.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-gray-100">
                    {getEventIcon(event.type)}
                  </div>
                  <div>
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-gray-500">
                      {event.date.toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })} • {event.time}
                    </p>
                    {event.with && (
                      <p className="text-sm text-gray-500">With: {event.with}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getPriorityColor(event.priority)}`}></div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <main className="ml-64 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Calendar</h1>
            <p className="text-gray-600">Manage your schedule and tasks</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={today}
              className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Today
            </button>
            <div className="flex items-center gap-1">
              <button 
                onClick={previousMonth}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={nextMonth}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <h2 className="text-lg font-semibold min-w-28">
              {getMonthName(currentDate)} {currentDate.getFullYear()}
            </h2>
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <button 
                onClick={() => setView('month')} 
                className={`px-4 py-2 text-sm ${view === 'month' ? 'bg-[#403DA1] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                Month
              </button>
              <button 
                onClick={() => setView('week')} 
                className={`px-4 py-2 text-sm ${view === 'week' ? 'bg-[#403DA1] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                Week
              </button>
              <button 
                onClick={() => setView('day')} 
                className={`px-4 py-2 text-sm ${view === 'day' ? 'bg-[#403DA1] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                Day
              </button>
            </div>
            <button 
              className="px-4 py-2 text-sm bg-[#403DA1] text-white rounded-lg hover:bg-[#373490] transition-colors"
            >
              + Add new task
            </button>
          </div>
        </div>

        {/* Calendar header - days of week */}
        <div className="grid grid-cols-7 gap-0 mb-1 bg-gray-50 rounded-t-xl border border-gray-200 border-b-0">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-0 mb-6 border border-gray-200 rounded-b-xl overflow-hidden">
          {renderCalendar()}
        </div>

        {/* Agenda View */}
        {renderAgenda()}

        {/* Add Event Button (Fixed position) */}
        <button className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-[#403DA1] to-[#AA55B9] text-white rounded-full shadow-lg hover:shadow-xl transition-all">
          <Plus className="w-6 h-6" />
          <span className="sr-only">Add new task</span>
        </button>
      </div>
    </main>
  );
};