import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Plus, X, Edit2, Trash2, Bell, Search, Filter } from 'lucide-react';

export default function ToolHome() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    participants: '',
    reminder: '30'
  });

  useEffect(() => {
    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [events]);

  const checkReminders = () => {
    const now = new Date();
    events.forEach(event => {
      const eventDateTime = new Date(`${event.date}T${event.time}`);
      const timeDiff = (eventDateTime - now) / (1000 * 60);
      
      if (timeDiff > 0 && timeDiff <= parseInt(event.reminder) && !event.reminderShown) {
        alert(`Reminder: "${event.title}" starts in ${Math.round(timeDiff)} minutes!`);
        updateEventReminder(event.id);
      }
    });
  };

  const updateEventReminder = (id) => {
    setEvents(events.map(e => e.id === id ? { ...e, reminderShown: true } : e));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.date || !formData.time) {
      alert('Please fill in all required fields');
      return;
    }
    
    const participantList = formData.participants
      .split(',')
      .map(p => p.trim())
      .filter(p => p);

    if (editingEvent) {
      setEvents(events.map(event => 
        event.id === editingEvent.id 
          ? { ...formData, participants: participantList, id: event.id, reminderShown: false }
          : event
      ));
      setEditingEvent(null);
    } else {
      const newEvent = {
        ...formData,
        participants: participantList,
        id: Date.now(),
        reminderShown: false
      };
      setEvents([...events, newEvent]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      participants: '',
      reminder: '30'
    });
    setShowForm(false);
    setEditingEvent(null);
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      ...event,
      participants: event.participants.join(', ')
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(event => event.id !== id));
    }
  };

  const getEventStatus = (event) => {
    const eventDateTime = new Date(`${event.date}T${event.time}`);
    const now = new Date();
    
    if (eventDateTime < now) return 'past';
    if (eventDateTime.toDateString() === now.toDateString()) return 'today';
    return 'upcoming';
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const status = getEventStatus(event);
    const matchesFilter = filterStatus === 'all' || status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA - dateB;
  });

  return (
    <div className="min-h-screen bg-(--background) p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto pt-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="heading mb-1 animate-fade-up text-center">Event Manager</h1>
          <p className="description animate-fade-up text-center">Schedule, track, and manage your events efficiently</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 border border-(--border) rounded-lg p-4 sm:p-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-(--muted-foreground) w-5 h-5" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-(--border) rounded-lg text-(--muted-foreground)"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-(--muted-foreground) w-5 h-5" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2 border-2 border-gray-300 rounded-lg  text-(--muted-foreground) appearance-none  "
            >
              <option value="all">All Events</option>
              <option value="today">Today</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-(--primary) text-white px-6 py-2 rounded-md  transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span className="font-primary">New Event</span>
          </button>
        </div>

        {/* Event Form */}
        {showForm && (
          <div className="bg-(--card) border-2 border-(--border) rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="subheading">
                {editingEvent ? 'Edit Event' : 'Create New Event'}
              </h2>
              <button onClick={resetForm} className="text-(--muted-foreground) hover:text-red-500 cursor-pointer">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-(--muted-foreground) font-medium mb-2">Event Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-(--border) rounded-lg  text-(--muted-foreground)"
                    placeholder="Enter event title"
                  />
                </div>

                <div>
                  <label className="block text-(--muted-foreground) font-medium mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-(--border) rounded-lg  text-(--muted-foreground)"
                    placeholder="Enter location"
                  />
                </div>
              </div>

              <div>
                <label className="block text-(--muted-foreground) font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-(--border) rounded-lg  text-(--muted-foreground)"
                  placeholder="Enter event description"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-(--muted-foreground) font-medium mb-2">Date *</label>
                 <div className="relative w-full">
                   <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 border border(--border) rounded-lg  text-(--muted-foreground)"
                  />
                 </div>

                </div>

                <div>
                  <label className="block text-(--muted-foreground) font-medium mb-2">Time *</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-(--muted-foreground)"
                  />
                </div>

                <div>
                  <label className="block text-(--muted-foreground) font-medium mb-2">Reminder (minutes)</label>
                  <select
                    value={formData.reminder}
                    onChange={(e) => setFormData({ ...formData, reminder: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg  text-(--muted-foreground)"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="1440">1 day</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-(--muted-foreground) font-medium mb-2">Participants (comma-separated)</label>
                <input
                  type="text"
                  value={formData.participants}
                  onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none text-black"
                  placeholder="John Doe, Jane Smith, etc."
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={resetForm}
                  className="px-6 py-1 font-semibold border-2 border-red-500 text-red-500 rounded-lg hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-(--primary) text-white rounded-lg font-semibold transition cursor-pointer"
                >
                  {editingEvent ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Events List */}
        <div className="space-y-4 border border-(--border) rounded-xl p-4 sm:p-6">
          {sortedEvents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {searchTerm || filterStatus !== 'all' 
                  ? 'No events found matching your criteria' 
                  : 'No events yet. Create your first event!'}
              </p>
            </div>
          ) : (
            sortedEvents.map(event => {
              const status = getEventStatus(event);
              const statusColors = {
                past: 'bg-gray-100 border-gray-300',
                today: 'bg-blue-50 border-blue-300',
                upcoming: 'bg-green-50 border-green-300'
              };

              return (
                <div
                  key={event.id}
                  className={`border-2 rounded-lg p-4 sm:p-6 ${statusColors[status]} transition hover:shadow-lg`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl sm:text-2xl font-bold text-black mb-2">{event.title}</h3>
                      
                      {event.description && (
                        <p className="text-gray-700 mb-3">{event.description}</p>
                      )}

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-black">
                          <Calendar className="w-4 h-4" />
                          <span className="font-medium">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>

                        <div className="flex items-center gap-2 text-black">
                          <Clock className="w-4 h-4" />
                          <span className="font-medium">{event.time}</span>
                        </div>

                        {event.location && (
                          <div className="flex items-center gap-2 text-black">
                            <span className="font-medium">📍 {event.location}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-black">
                          <Bell className="w-4 h-4" />
                          <span className="font-medium">Reminder: {event.reminder} min before</span>
                        </div>

                        {event.participants.length > 0 && (
                          <div className="flex items-start gap-2 text-black">
                            <Users className="w-4 h-4 mt-1" />
                            <div>
                              <span className="font-medium">Participants ({event.participants.length}):</span>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {event.participants.map((participant, idx) => (
                                  <span
                                    key={idx}
                                    className="bg-white border border-gray-300 px-2 py-1 rounded text-sm"
                                  >
                                    {participant}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex sm:flex-col gap-2">
                      <button
                        onClick={() => handleEdit(event)}
                        className="flex items-center gap-2 px-4 py-2 border-2 border-black text-black rounded-lg hover:bg-black hover:text-white transition"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="flex items-center gap-2 px-4 py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

