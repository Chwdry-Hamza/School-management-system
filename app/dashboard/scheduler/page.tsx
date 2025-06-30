'use client';
import { Calendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

// Define event type for TypeScript
interface MyEvent {
  _id?: string; // Added for MongoDB ID
  start: Date;
  end: Date;
  title: string;
  allDay: boolean;
  color?: string;
  textColor?: string;
  teacherId?: string; // Changed from teacher to teacherId to match backend
  teacher?: { username: string; firstName: string; lastName: string }; // Populated teacher data
}

// Define teacher type for dropdown
interface Teacher {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
}

export default function Scheduler() {
  const localizer = momentLocalizer(moment);
  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState<Date>(new Date());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [events, setEvents] = useState<MyEvent[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [eventData, setEventData] = useState({
    title: '',
    start: new Date(),
    end: new Date(),
    allDay: false,
    teacherId: '',
  });
  const [selectedEvent, setSelectedEvent] = useState<MyEvent | null>(null);

  // Fetch events and teachers on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('https://backend-sms-chi.vercel.app/event');
        const fetchedEvents = response.data.events.map((event: any) => ({
          _id: event._id,
          start: new Date(event.start),
          end: new Date(event.end),
          title: event.title,
          allDay: event.allDay,
          teacherId: event.teacherId?._id || '',
          teacher: event.teacherId
            ? { username: event.teacherId.username, firstName: event.teacherId.firstName, lastName: event.teacherId.lastName }
            : undefined,
          color: event.color,
          textColor: event.textColor,
        }));
        setEvents(fetchedEvents);
      } catch (err) {
        console.error('Error fetching events:', err);
      }
    };

    const fetchTeachers = async () => {
      try {
        const response = await axios.get('https://backend-sms-chi.vercel.app/teacher');
        setTeachers(response.data.teacherData);
      } catch (err) {
        console.error('Error fetching teachers:', err);
      }
    };

    fetchEvents();
    fetchTeachers();
  }, []);

  // Custom event styling
  const eventStyleGetter = (event: MyEvent) => {
    const style = {
      backgroundColor: event.color || '#3174ad',
      color: event.textColor || '#fff',
      borderRadius: '5px',
      border: 'none',
      padding: '2px 5px',
      fontSize: '14px',
      fontWeight: '500',
    };
    return { style };
  };

  const handleAddEvent = async () => {
    try {
      const response = await axios.post('https://backend-sms-chi.vercel.app/event', {
        title: eventData.title,
        start: eventData.start,
        end: eventData.end,
        allDay: eventData.allDay,
        teacherId: eventData.teacherId,
        color: '#3B82F6',
        textColor: '#FFFFFF',
      });
      const newEvent: MyEvent = {
        _id: response.data.newEvent._id,
        start: new Date(response.data.newEvent.start),
        end: new Date(response.data.newEvent.end),
        title: response.data.newEvent.title,
        allDay: response.data.newEvent.allDay,
        teacherId: response.data.newEvent.teacherId?._id,
        teacher: response.data.newEvent.teacherId
          ? {
              username: response.data.newEvent.teacherId.username,
              firstName: response.data.newEvent.teacherId.firstName,
              lastName: response.data.newEvent.teacherId.lastName,
            }
          : undefined,
        color: response.data.newEvent.color,
        textColor: response.data.newEvent.textColor,
      };
      setEvents([...events, newEvent]);
      setIsAddModalOpen(false);
      setEventData({ title: '', start: new Date(), end: new Date(), allDay: false, teacherId: '' });
    } catch (err) {
      console.error('Error adding event:', err);
    }
  };

  const handleEditEvent = async () => {
    if (selectedEvent && selectedEvent._id) {
      try {
        const response = await axios.put(`https://backend-sms-chi.vercel.app/event/${selectedEvent._id}`, {
          title: eventData.title,
          start: eventData.start,
          end: eventData.end,
          allDay: eventData.allDay,
          teacherId: eventData.teacherId,
          color: selectedEvent.color,
          textColor: selectedEvent.textColor,
        });
        const updatedEvent: MyEvent = {
          _id: response.data.updatedEvent._id,
          start: new Date(response.data.updatedEvent.start),
          end: new Date(response.data.updatedEvent.end),
          title: response.data.updatedEvent.title,
          allDay: response.data.updatedEvent.allDay,
          teacherId: response.data.updatedEvent.teacherId?._id,
          teacher: response.data.updatedEvent.teacherId
            ? {
                username: response.data.updatedEvent.teacherId.username,
                firstName: response.data.updatedEvent.teacherId.firstName,
                lastName: response.data.updatedEvent.teacherId.lastName,
              }
            : undefined,
          color: response.data.updatedEvent.color,
          textColor: response.data.updatedEvent.textColor,
        };
        setEvents(events.map((e) => (e._id === updatedEvent._id ? updatedEvent : e)));
        setIsEditModalOpen(false);
        setSelectedEvent(null);
        setEventData({ title: '', start: new Date(), end: new Date(), allDay: false, teacherId: '' });
      } catch (err) {
        console.error('Error updating event:', err);
      }
    }
  };

  const handleDeleteEvent = async () => {
    if (selectedEvent && selectedEvent._id) {
      try {
        await axios.delete(`https://backend-sms-chi.vercel.app/event/${selectedEvent._id}`);
        setEvents(events.filter((e) => e._id !== selectedEvent._id));
        setIsEditModalOpen(false);
        setSelectedEvent(null);
        setEventData({ title: '', start: new Date(), end: new Date(), allDay: false, teacherId: '' });
      } catch (err) {
        console.error('Error deleting event:', err);
      }
    }
  };

  const openAddModal = () => {
    setEventData({ title: '', start: new Date(), end: new Date(), allDay: false, teacherId: '' });
    setIsAddModalOpen(true);
  };

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col mobile-scheduler">
      {/* Header */}
      <header className="bg-white shadow-sm p-4">
        <h1 className="text-3xl font-bold text-gray-800">Event Scheduler</h1>
        <p className="text-gray-500 mt-1">Manage your events and appointments</p>
      </header>

      {/* Main Content */}
      <div className="flex-grow p-1 mobile-content" >
        <div className="bg-white rounded-xl shadow-lg p-6 h-[calc(100vh-120px)]">
          {/* Toolbar with View Options */}
          <div className="mb-4 flex justify-between items-center">
            <div className="space-x-2">
              <button
                onClick={() => setView('month')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  view === 'month'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setView('week')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  view === 'week'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setView('day')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  view === 'day'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Day
              </button>
            </div>
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              + Add Event
            </button>
          </div>

          {/* Calendar */}
          <Calendar<MyEvent>
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            view={view}
            onView={setView}
            date={date}
            onNavigate={handleNavigate}
            eventPropGetter={eventStyleGetter}
            className="custom-calendar"
            style={{ height: '93%' }}
            popup
            selectable
            onSelectEvent={(event) => {
              setSelectedEvent(event);
              setEventData({
                title: event.title,
                start: event.start,
                end: event.end,
                allDay: event.allDay,
                teacherId: event.teacherId || '',
              });
              setIsEditModalOpen(true);
            }}
            onSelectSlot={(slotInfo) => {
              setEventData({
                title: '',
                start: slotInfo.start,
                end: slotInfo.end,
                allDay: slotInfo.action === 'select' && moment(slotInfo.end).diff(slotInfo.start, 'hours') >= 24,
                teacherId: '',
              });
              setIsAddModalOpen(true);
            }}
          />

          {/* Add Event Modal */}
          {isAddModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Add Event</h2>
                  <button onClick={() => setIsAddModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                    ×
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <select
                      value={eventData.title}
                      onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Please select...</option>
                      <option value="Meeting">Meeting</option>
                      <option value="Workshop">Workshop</option>
                      <option value="Lecture">Lecture</option>
                    </select>
                  </div>
                  <div className="bg-blue-100 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-blue-800 mb-2">Date Options</h3>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={eventData.allDay}
                        onChange={(e) => setEventData({ ...eventData, allDay: e.target.checked })}
                        className="mr-2"
                      />
                      All day event
                    </label>
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700">Start Date</label>
                      <input
                        type="datetime-local"
                        value={moment(eventData.start).format('YYYY-MM-DDTHH:mm')}
                        onChange={(e) =>
                          setEventData({ ...eventData, start: new Date(e.target.value) })
                        }
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700">End Date</label>
                      <input
                        type="datetime-local"
                        value={moment(eventData.end).format('YYYY-MM-DDTHH:mm')}
                        onChange={(e) => setEventData({ ...eventData, end: new Date(e.target.value) })}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="bg-gray-200 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Teacher Options</h3>
                    <select
                      value={eventData.teacherId}
                      onChange={(e) => setEventData({ ...eventData, teacherId: e.target.value })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Please select...</option>
                      {teachers.map((teacher) => (
                        <option key={teacher._id} value={teacher._id}>
                          {`${teacher.firstName} ${teacher.lastName} (${teacher.username})`}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={handleAddEvent}
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Event Modal */}
          {isEditModalOpen && selectedEvent && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Edit Event</h2>
                  <button onClick={() => setIsEditModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                    ×
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <select
                      value={eventData.title}
                      onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Please select...</option>
                      <option value="Meeting">Meeting</option>
                      <option value="Workshop">Workshop</option>
                      <option value="Lecture">Lecture</option>
                    </select>
                  </div>
                  <div className="bg-blue-100 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-blue-800 mb-2">Date Options</h3>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={eventData.allDay}
                        onChange={(e) => setEventData({ ...eventData, allDay: e.target.checked })}
                        className="mr-2"
                      />
                      All day event
                    </label>
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700">Start Date</label>
                      <input
                        type="datetime-local"
                        value={moment(eventData.start).format('YYYY-MM-DDTHH:mm')}
                        onChange={(e) =>
                          setEventData({ ...eventData, start: new Date(e.target.value) })
                        }
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700">End Date</label>
                      <input
                        type="datetime-local"
                        value={moment(eventData.end).format('YYYY-MM-DDTHH:mm')}
                        onChange={(e) => setEventData({ ...eventData, end: new Date(e.target.value) })}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="bg-gray-200 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Teacher Options</h3>
                    <select
                      value={eventData.teacherId}
                      onChange={(e) => setEventData({ ...eventData, teacherId: e.target.value })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Please select...</option>
                      {teachers.map((teacher) => (
                        <option key={teacher._id} value={teacher._id}>
                          {`${teacher.firstName} ${teacher.lastName} (${teacher.username})`}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={handleEditEvent}
                      className="w-1/2 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleDeleteEvent}
                      className="w-1/2 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx global>{`
        .custom-calendar .rbc-calendar {
          height: 100%;
        }
        .rbc-toolbar {
          margin-bottom: 1rem;
          font-size: 1rem;
          font-weight: 500;
        }
        .rbc-toolbar button {
          border-radius: 0.375rem;
          padding: 0.5rem 1rem;
          transition: all 0.2s ease;
        }
        .rbc-toolbar button:hover {
          background-color: #e5e7eb;
        }
        .rbc-event {
          transition: all 0.2s ease;
        }
        .rbc-event:hover {
          transform: scale(1.02);
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .rbc-today {
          background-color: #eff6ff;
        }
        .rbc-month-view,
        .rbc-time-view {
          border-radius: 0.5rem;
          overflow: hidden;
        }
   @media (max-width: 640px) {
  .mobile-scheduler {
    width: 91vw !important; /* Full viewport width */
    margin: 0rem -2rem -2rem -2rem !important; /* Top margin 2rem, others -2rem */
  }
  .mobile-content {
    padding: 0.5rem !important; /* Reduced padding to maximize content width */
  }
    .custom-calendar {
    height: 85% !important; /* Set height to 100% for mobile view */
  }
}
      `}</style>
    </div>
  );
}