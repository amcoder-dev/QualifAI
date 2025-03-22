import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Phone, 
  Mail, 
  FileText, 
  Users,
  MoreHorizontal,
  Clock,
  X,
  AlertCircle
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
  // Adding duration for week/day views
  duration?: number; // in minutes
}

export const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTask, setNewTask] = useState<Partial<CalendarEvent>>({
    title: '',
    type: 'Task',
    priority: 'Medium',
    date: new Date(),
    time: '9:00 AM',
    duration: 30
  });
  
  // Mock events
  const events: CalendarEvent[] = [
    {
      id: '1',
      title: 'Call with Dave Peterson',
      type: 'Call',
      date: new Date(2025, 2, 22), // March 22, 2025
      time: '10:30 AM',
      priority: 'High',
      with: 'Dave Peterson',
      duration: 30
    },
    {
      id: '2',
      title: 'Send proposal to Contoso Ltd',
      type: 'Email',
      date: new Date(2025, 2, 22), // March 22, 2025
      time: '2:00 PM',
      priority: 'Medium',
      with: 'Contoso Ltd',
      duration: 45
    },
    {
      id: '3',
      title: 'Follow up with Global Tech',
      type: 'Task',
      date: new Date(2025, 2, 23), // March 23, 2025
      time: '11:00 AM',
      priority: 'Medium',
      with: 'Global Tech',
      duration: 60
    },
    {
      id: '4',
      title: 'Quarterly review meeting',
      type: 'Meeting',
      date: new Date(2025, 2, 24), // March 24, 2025
      time: '3:00 PM',
      priority: 'Low',
      duration: 90
    },
    {
      id: '5',
      title: 'Strategy planning session',
      type: 'Meeting',
      date: new Date(2025, 2, 25), // March 25, 2025
      time: '1:00 PM',
      priority: 'Medium',
      duration: 120
    },
    {
      id: '6',
      title: 'Demo with new client',
      type: 'Call',
      date: new Date(2025, 2, 26), // March 26, 2025
      time: '10:00 AM',
      priority: 'High',
      with: 'ABC Corp',
      duration: 60
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Call':
        return 'bg-blue-100 border-blue-200 text-blue-800';
      case 'Email':
        return 'bg-purple-100 border-purple-200 text-purple-800';
      case 'Task':
        return 'bg-yellow-100 border-yellow-200 text-yellow-800';
      case 'Meeting':
        return 'bg-green-100 border-green-200 text-green-800';
      default:
        return 'bg-gray-100 border-gray-200 text-gray-800';
    }
  };

  // Navigation functions
  const previousPeriod = () => {
    if (view === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate()));
    } else if (view === 'week') {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() - 7);
      setCurrentDate(newDate);
    } else if (view === 'day') {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() - 1);
      setCurrentDate(newDate);
    }
  };

  const nextPeriod = () => {
    if (view === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate()));
    } else if (view === 'week') {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + 7);
      setCurrentDate(newDate);
    } else if (view === 'day') {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + 1);
      setCurrentDate(newDate);
    }
  };

  const today = () => {
    setCurrentDate(new Date());
  };

  // Time conversion
  const timeStringToMinutes = (timeStr: string): number => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    if (hours === 12) {
      hours = 0;
    }
    
    if (modifier === 'PM') {
      hours += 12;
    }
    
    return hours * 60 + minutes;
  };

  // Calendar generation functions
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  // Get dates for the current week
  const getWeekDates = (date: Date) => {
    const day = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const diff = date.getDate() - day;
    const weekDates = [];
    
    for (let i = 0; i < 7; i++) {
      const newDate = new Date(date);
      newDate.setDate(diff + i);
      weekDates.push(newDate);
    }
    
    return weekDates;
  };

  // Get period label based on view
  const getPeriodLabel = () => {
    if (view === 'month') {
      return `${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`;
    } else if (view === 'week') {
      const weekDates = getWeekDates(currentDate);
      const startDate = weekDates[0];
      const endDate = weekDates[6];
      
      if (startDate.getMonth() === endDate.getMonth()) {
        return `${startDate.toLocaleString('default', { month: 'long' })} ${startDate.getDate()} - ${endDate.getDate()}, ${startDate.getFullYear()}`;
      } else {
        return `${startDate.toLocaleString('default', { month: 'short' })} ${startDate.getDate()} - ${endDate.toLocaleString('default', { month: 'short' })} ${endDate.getDate()}, ${startDate.getFullYear()}`;
      }
    } else {
      return currentDate.toLocaleString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    }
  };

  // Create time slots for day/week view
  const getTimeSlots = () => {
    const slots = [];
    // Start from 8 AM to 6 PM
    for (let hour = 8; hour <= 18; hour++) {
      const time = hour > 12 ? `${hour - 12}:00 PM` : hour === 12 ? '12:00 PM' : `${hour}:00 AM`;
      slots.push(time);
    }
    return slots;
  };

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.getDate() === date.getDate() && 
      event.date.getMonth() === date.getMonth() && 
      event.date.getFullYear() === date.getFullYear()
    ).sort((a, b) => timeStringToMinutes(a.time) - timeStringToMinutes(b.time));
  };

  // Format date to display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Month view calendar
  const renderMonthView = () => {
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
      const dayEvents = getEventsForDate(date);

      days.push(
        <div 
          key={`current-${day}`}
          onClick={() => {
            setCurrentDate(new Date(year, month, day));
            setView('day');
          }}
          className={`h-28 p-1 border border-gray-200 bg-white relative ${isToday ? 'ring-2 ring-[#403DA1] ring-inset' : ''} cursor-pointer hover:bg-gray-50`}
        >
          <div className={`text-sm font-medium ${isToday ? 'bg-[#403DA1] text-white rounded-full w-6 h-6 flex items-center justify-center' : ''}`}>
            {day}
          </div>
          <div className="mt-1 space-y-1 overflow-y-auto max-h-20">
            {dayEvents.slice(0, 2).map(event => (
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

    return (
      <>
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
          {days}
        </div>
      </>
    );
  };

  // Week view calendar
  const renderWeekView = () => {
    const weekDates = getWeekDates(currentDate);
    const timeSlots = getTimeSlots();
    const today = new Date();
    
    return (
      <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
        {/* Week header */}
        <div className="grid grid-cols-8 border-b border-gray-200">
          <div className="p-2 text-center border-r border-gray-200 bg-gray-50"></div>
          {weekDates.map((date, index) => {
            const isToday = 
              date.getDate() === today.getDate() && 
              date.getMonth() === today.getMonth() && 
              date.getFullYear() === today.getFullYear();
            
            return (
              <div 
                key={index} 
                className={`p-2 text-center ${isToday ? 'bg-[#403DA1] text-white' : 'bg-gray-50'}`}
              >
                <div className="text-sm font-medium">
                  {date.toLocaleString('default', { weekday: 'short' })}
                </div>
                <div className={`text-sm ${isToday ? 'font-bold' : ''}`}>
                  {date.getDate()}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Time slots */}
        <div className="relative">
          {timeSlots.map((time, timeIndex) => (
            <div key={timeIndex} className="grid grid-cols-8 border-b border-gray-200">
              <div className="p-2 text-center text-xs text-gray-500 border-r border-gray-200 bg-gray-50">
                {time}
              </div>
              
              {weekDates.map((date, dateIndex) => {
                const cellEvents = getEventsForDate(date).filter(event => {
                  const eventHour = parseInt(event.time.split(':')[0]);
                  const eventPeriod = event.time.slice(-2);
                  const timeHour = parseInt(time.split(':')[0]);
                  const timePeriod = time.slice(-2);
                  
                  return (
                    (eventHour === timeHour && eventPeriod === timePeriod) ||
                    (eventHour === 12 && timeHour === 12 && eventPeriod === timePeriod) ||
                    (eventHour === timeHour + 12 && timeHour !== 12 && eventPeriod !== timePeriod)
                  );
                });
                
                return (
                  <div key={dateIndex} className="p-1 min-h-16 relative border-r border-gray-200">
                    {cellEvents.map(event => (
                      <div 
                        key={event.id}
                        className={`p-1 mb-1 text-xs rounded ${getTypeColor(event.type)} border cursor-pointer`}
                      >
                        <div className="flex items-center gap-1">
                          {getEventIcon(event.type)}
                          <span className="font-medium truncate">{event.title}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{event.time} ({event.duration} min)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Day view calendar
  const renderDayView = () => {
    const timeSlots = getTimeSlots();
    const dayEvents = getEventsForDate(currentDate);
    
    return (
      <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
        {/* Day header */}
        <div className="bg-gray-50 p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">
            {currentDate.toLocaleString('default', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h3>
          <p className="text-sm text-gray-500">
            {dayEvents.length} {dayEvents.length === 1 ? 'event' : 'events'} scheduled
          </p>
        </div>
        
        {/* Time slots */}
        <div className="grid grid-cols-4">
          <div className="col-span-1 border-r border-gray-200 bg-gray-50">
            {timeSlots.map((time, timeIndex) => (
              <div key={timeIndex} className="p-4 border-b border-gray-200 h-20 flex items-start">
                <div className="text-xs font-medium text-gray-500">{time}</div>
              </div>
            ))}
          </div>
          
          <div className="col-span-3 relative">
            {timeSlots.map((time, timeIndex) => {
              const slotEvents = dayEvents.filter(event => {
                const eventHour = parseInt(event.time.split(':')[0]);
                const eventPeriod = event.time.slice(-2);
                const timeHour = parseInt(time.split(':')[0]);
                const timePeriod = time.slice(-2);
                
                return (
                  (eventHour === timeHour && eventPeriod === timePeriod) ||
                  (eventHour === 12 && timeHour === 12 && eventPeriod === timePeriod) ||
                  (eventHour === timeHour + 12 && timeHour !== 12 && eventPeriod !== timePeriod)
                );
              });
              
              return (
                <div key={timeIndex} className="p-2 h-20 border-b border-gray-200">
                  {slotEvents.map(event => (
                    <div 
                      key={event.id}
                      className={`p-3 mb-2 rounded-lg ${getTypeColor(event.type)} border cursor-pointer`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {getEventIcon(event.type)}
                            <span className="font-medium">{event.title}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>{event.time} ({event.duration} min)</span>
                          </div>
                          {event.with && (
                            <div className="mt-1 text-sm text-gray-600">With: {event.with}</div>
                          )}
                        </div>
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(event.priority)}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
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
            <div 
              key={event.id} 
              className="p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => {
                setCurrentDate(new Date(event.date));
                setView('day');
              }}
            >
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

  // Render the appropriate view based on the current selection
  const renderCalendarView = () => {
    switch (view) {
      case 'month':
        return renderMonthView();
      case 'week':
        return renderWeekView();
      case 'day':
        return renderDayView();
      default:
        return renderMonthView();
    }
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
              className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-[#403DA1] to-[#635FC1] text-white rounded-lg 
                        shadow-sm hover:shadow-lg hover:from-[#373490] hover:to-[#5652B0] hover:-translate-y-0.5 
                        active:translate-y-0 active:shadow-md transition-all duration-200 ease-in-out
                        flex items-center gap-1"
            >
              Today
            </button>
            <div className="flex items-center gap-1">
              <button 
                onClick={previousPeriod}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={nextPeriod}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <h2 className="text-lg font-semibold min-w-28">
              {getPeriodLabel()}
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
              onClick={() => setShowAddTaskModal(true)}
              className="px-4 py-2 text-sm bg-[#403DA1] text-white rounded-lg hover:bg-[#373490] transition-colors"
            >
              + Add new task
            </button>
          </div>
        </div>

        {/* Render the appropriate calendar view */}
        {renderCalendarView()}

        {/* Agenda View */}
        {renderAgenda()}

        {/* Add Event Button (Fixed position) */}
        <button 
          onClick={() => setShowAddTaskModal(true)}
          className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-[#403DA1] to-[#AA55B9] text-white rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-6 h-6" />
          <span className="sr-only">Add new task</span>
        </button>
        
        {/* Add Task Modal */}
        {showAddTaskModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Add New Task</h3>
                <button 
                  onClick={() => setShowAddTaskModal(false)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-4 space-y-4">
                {/* Task Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Task Title *
                  </label>
                  <input 
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#403DA1] focus:border-[#403DA1] outline-none"
                    placeholder="Enter task title"
                  />
                </div>
                
                {/* Task Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {['Call', 'Email', 'Task', 'Meeting'].map(type => (
                      <button
                        key={type}
                        onClick={() => setNewTask({...newTask, type: type as CalendarEvent['type']})}
                        className={`flex items-center justify-center gap-1 p-2 rounded-lg border ${
                          newTask.type === type 
                            ? getTypeColor(type) + ' border-transparent'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {type === 'Call' && <Phone className={`w-4 h-4 ${newTask.type === type ? 'text-blue-500' : ''}`} />}
                        {type === 'Email' && <Mail className={`w-4 h-4 ${newTask.type === type ? 'text-purple-500' : ''}`} />}
                        {type === 'Task' && <FileText className={`w-4 h-4 ${newTask.type === type ? 'text-yellow-500' : ''}`} />}
                        {type === 'Meeting' && <Users className={`w-4 h-4 ${newTask.type === type ? 'text-green-500' : ''}`} />}
                        <span className="text-sm">{type}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Task with (optional) */}
                {(newTask.type === 'Call' || newTask.type === 'Meeting' || newTask.type === 'Email') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      With
                    </label>
                    <input 
                      type="text"
                      value={newTask.with || ''}
                      onChange={(e) => setNewTask({...newTask, with: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#403DA1] focus:border-[#403DA1] outline-none"
                      placeholder={`Who is this ${newTask.type.toLowerCase()} with?`}
                    />
                  </div>
                )}
                
                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input 
                      type="date"
                      value={newTask.date ? newTask.date.toISOString().split('T')[0] : ''}
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        setNewTask({...newTask, date});
                      }}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#403DA1] focus:border-[#403DA1] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <select
                      value={newTask.time}
                      onChange={(e) => setNewTask({...newTask, time: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#403DA1] focus:border-[#403DA1] outline-none"
                    >
                      {[
                        '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
                        '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
                        '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM'
                      ].map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes)
                  </label>
                  <select
                    value={newTask.duration}
                    onChange={(e) => setNewTask({...newTask, duration: parseInt(e.target.value)})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#403DA1] focus:border-[#403DA1] outline-none"
                  >
                    {[15, 30, 45, 60, 90, 120].map(duration => (
                      <option key={duration} value={duration}>{duration} min</option>
                    ))}
                  </select>
                </div>
                
                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Low', 'Medium', 'High'].map(priority => (
                      <button
                        key={priority}
                        onClick={() => setNewTask({...newTask, priority: priority as CalendarEvent['priority']})}
                        className={`p-2 rounded-lg border text-sm ${
                          newTask.priority === priority
                            ? priority === 'High' 
                              ? 'bg-red-500 text-white border-red-500'
                              : priority === 'Medium'
                                ? 'bg-yellow-500 text-white border-yellow-500'
                                : 'bg-green-500 text-white border-green-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {priority}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (optional)
                  </label>
                  <textarea
                    value={newTask.description || ''}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#403DA1] focus:border-[#403DA1] outline-none"
                    placeholder="Add details about this task"
                    rows={3}
                  />
                </div>
                
                {/* Error Message (if title is empty) */}
                {!newTask.title && (
                  <div className="flex items-center gap-2 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>Task title is required</span>
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
                <button
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Basic validation - title is required
                    if (!newTask.title) return;
                    
                    // Generate a unique ID
                    const id = String(Date.now());
                    
                    // Add event to the list (would typically be a state update or API call)
                    // For demo purposes, we're just closing the modal
                    alert(`New task "${newTask.title}" would be added here`);
                    
                    // Close modal and reset form
                    setShowAddTaskModal(false);
                    setNewTask({
                      title: '',
                      type: 'Task',
                      priority: 'Medium',
                      date: new Date(),
                      time: '9:00 AM',
                      duration: 30
                    });
                  }}
                  disabled={!newTask.title}
                  className={`px-4 py-2 rounded-lg ${
                    !newTask.title
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-[#403DA1] text-white hover:bg-[#373490]'
                  }`}
                >
                  Add Task
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};