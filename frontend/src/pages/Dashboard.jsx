import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Download, QrCode, Upload, Radio, Users, CheckCircle, Clock } from 'lucide-react';
import API from '../services/api';

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await API.get('/faculty/events');
      setEvents(response.data);
    } catch (err) {
      setError('Failed to fetch events list. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (eventId, eventName) => {
    try {
      const response = await API.get(`/faculty/attendance/event/${eventId}/export`, {
        responseType: 'blob',
      });
      
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Sanitise file name
      const safeName = eventName.replace(/[^a-zA-Z0-9-_]/g, '_');
      link.download = `${safeName}_attendance.xlsx`;
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Error exporting attendance report: ' + err.message);
    }
  };

  const isEventActive = (startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    return now >= start && now <= end;
  };

  const formatDateTime = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
  };

  // Aggregated Stats
  const activeEventsCount = events.filter(e => isEventActive(e.startTime, e.endTime)).length;
  const totalAttended = events.reduce((sum, e) => sum + e.presentCount, 0);

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Faculty Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Create and manage your QR events, uploads, and live logs</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link
            to="/events/new"
            className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-5 rounded-xl shadow-md shadow-emerald-100 hover:shadow transition-all duration-200 text-sm"
          >
            <Plus className="h-5 w-5" />
            <span>Create New Event</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="glass p-6 rounded-2xl shadow-sm border border-slate-200/60 flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Radio className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">{activeEventsCount}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Events</div>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl shadow-sm border border-slate-200/60 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">{events.length}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Events</div>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl shadow-sm border border-slate-200/60 flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">{totalAttended}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Attendees Marked</div>
          </div>
        </div>
      </div>

      {/* Event Cards Section */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm mt-3 font-semibold">Loading events...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="glass text-center py-16 px-6 border border-slate-200 rounded-2xl shadow-sm">
          <Calendar className="h-14 w-14 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-700">No events found</h3>
          <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto">Create your first QR code attendance session to begin taking attendance.</p>
          <Link to="/events/new" className="mt-5 inline-flex items-center space-x-2 bg-slate-900 text-white font-semibold py-2.5 px-4 rounded-xl text-sm hover:bg-slate-800 shadow">
            <Plus className="h-4.5 w-4.5" />
            <span>Create Event</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const active = isEventActive(event.startTime, event.endTime);
            const isExpired = new Date() > new Date(event.endTime);
            const isRegisteredMode = event.attendanceMode === 'REGISTERED';

            return (
              <div 
                key={event.id} 
                className="glass rounded-2xl shadow-sm border border-slate-200/80 hover:border-slate-300 transition-all duration-200 overflow-hidden flex flex-col justify-between"
              >
                {/* Banner Mode */}
                <div className="px-6 pt-5">
                  <div className="flex justify-between items-center mb-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold border ${
                      isRegisteredMode 
                        ? 'bg-blue-50 border-blue-200 text-blue-700' 
                        : 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    }`}>
                      {isRegisteredMode ? 'Registered List' : 'Open Attendance'}
                    </span>
                    
                    <span className={`inline-flex items-center space-x-1 text-xs font-bold ${
                      active 
                        ? 'text-emerald-600' 
                        : isExpired 
                          ? 'text-slate-400' 
                          : 'text-amber-500'
                    }`}>
                      <span className={`h-2 w-2 rounded-full ${
                        active 
                          ? 'bg-emerald-500 animate-pulse' 
                          : isExpired 
                            ? 'bg-slate-300' 
                            : 'bg-amber-400'
                      }`}></span>
                      <span>{active ? 'Active Now' : isExpired ? 'Closed' : 'Upcoming'}</span>
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-800 line-clamp-1 mb-2" title={event.eventName}>
                    {event.eventName}
                  </h3>

                  {/* Timings */}
                  <div className="space-y-1.5 text-xs text-slate-500 font-semibold mb-5">
                    <div className="flex items-center space-x-1.5">
                      <Clock className="h-4 w-4 text-slate-400" />
                      <span>Start: {formatDateTime(event.startTime)}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Clock className="h-4 w-4 text-slate-400" />
                      <span>End: {formatDateTime(event.endTime)}</span>
                    </div>
                  </div>

                  {/* Summary Metric Counter */}
                  <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl text-center mb-6">
                    <div>
                      <div className="text-lg font-black text-slate-800">{event.presentCount}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Present</div>
                    </div>
                    {isRegisteredMode ? (
                      <div>
                        <div className="text-lg font-black text-slate-800">{event.absentCount}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Absent</div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-lg font-black text-slate-800">{event.totalParticipants}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Joins</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions Grid */}
                <div className="border-t border-slate-200/60 bg-slate-50/50 p-4.5 grid grid-cols-2 gap-2 text-center">
                  <Link
                    to={`/events/${event.id}/qr/${event.qrToken}`}
                    className="flex items-center justify-center space-x-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold py-2 rounded-xl text-xs transition-colors"
                  >
                    <QrCode className="h-4 w-4 text-slate-500" />
                    <span>View QR</span>
                  </Link>

                  <Link
                    to={`/events/${event.id}/live`}
                    className="flex items-center justify-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs shadow-sm transition-colors"
                  >
                    <Radio className="h-4 w-4" />
                    <span>Live Log</span>
                  </Link>

                  {isRegisteredMode && (
                    <Link
                      to={`/events/${event.id}/upload`}
                      className="flex items-center justify-center space-x-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold py-2 rounded-xl text-xs transition-colors"
                    >
                      <Upload className="h-4 w-4 text-slate-500" />
                      <span>Upload List</span>
                    </Link>
                  )}

                  <button
                    onClick={() => handleExport(event.id, event.eventName)}
                    className={`flex items-center justify-center space-x-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold py-2 rounded-xl text-xs transition-colors ${
                      !isRegisteredMode ? 'col-span-2' : ''
                    }`}
                  >
                    <Download className="h-4 w-4 text-slate-500" />
                    <span>Report</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
