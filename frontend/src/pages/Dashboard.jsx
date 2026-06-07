import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Download, QrCode, Upload, Radio, Users, CheckCircle, Clock, Calendar, MapPin, Edit, Trash2 } from 'lucide-react';
import API from '../services/api';

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editEventId, setEditEventId] = useState(null);
  const [editEventName, setEditEventName] = useState('');
  const [editEventPlace, setEditEventPlace] = useState('');
  const [editStartTime, setEditStartTime] = useState('');
  const [editEndTime, setEditEndTime] = useState('');
  const [editAttendanceMode, setEditAttendanceMode] = useState('');
  const [editError, setEditError] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  const handleOpenEditModal = (event) => {
    setEditEventId(event.id);
    setEditEventName(event.eventName);
    setEditEventPlace(event.eventPlace || '');
    setEditStartTime(event.startTime ? event.startTime.substring(0, 16) : '');
    setEditEndTime(event.endTime ? event.endTime.substring(0, 16) : '');
    setEditAttendanceMode(event.attendanceMode);
    setEditError('');
    setIsEditModalOpen(true);
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    setEditError('');
    
    const start = new Date(editStartTime);
    const end = new Date(editEndTime);
    if (end <= start) {
      setEditError('End Time must be after the Start Time.');
      return;
    }
    
    setEditLoading(true);
    try {
      const payload = {
        eventName: editEventName,
        eventPlace: editEventPlace,
        startTime: editStartTime + ':00',
        endTime: editEndTime + ':00',
        attendanceMode: editAttendanceMode
      };
      
      await API.put(`/faculty/events/${editEventId}`, payload);
      setIsEditModalOpen(false);
      fetchEvents(); // reload list
    } catch (err) {
      setEditError(err.response?.data?.message || 'Failed to update event. Please try again.');
    } finally {
      setEditLoading(false);
    }
  };

  // Delete State
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleteEventItem, setDeleteEventItem] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleOpenDeleteConfirm = (event) => {
    setDeleteEventItem(event);
    setDeleteError('');
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteEvent = async () => {
    if (!deleteEventItem) return;
    setDeleteLoading(true);
    setDeleteError('');
    try {
      await API.delete(`/faculty/events/${deleteEventItem.id}`);
      setIsDeleteConfirmOpen(false);
      setDeleteEventItem(null);
      fetchEvents(); // reload list
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Failed to delete event. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

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

                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className="text-xl font-bold text-slate-800 line-clamp-1" title={event.eventName}>
                      {event.eventName}
                    </h3>
                    <div className="flex items-center space-x-1 shrink-0">
                      <button 
                        onClick={() => handleOpenEditModal(event)}
                        className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit Event"
                      >
                        <Edit className="h-4.5 w-4.5" />
                      </button>
                      <button 
                        onClick={() => handleOpenDeleteConfirm(event)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Event"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </div>

                  {event.eventPlace && (
                    <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-semibold mb-3">
                      <MapPin className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span className="truncate" title={event.eventPlace}>Venue: {event.eventPlace}</span>
                    </div>
                  )}

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

      {/* Edit Event Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-extrabold text-slate-800 text-lg">Edit Event Details</h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-650 font-bold text-lg p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleUpdateEvent} className="p-6 space-y-4">
              {editError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-2.5 rounded-xl text-xs font-semibold">
                  {editError}
                </div>
              )}
              
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Event Title</label>
                <input
                  type="text"
                  required
                  value={editEventName}
                  onChange={(e) => setEditEventName(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-slate-850 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Event Place / Venue</label>
                <input
                  type="text"
                  value={editEventPlace}
                  onChange={(e) => setEditEventPlace(e.target.value)}
                  placeholder="e.g. Seminar Hall-1 / Room 402"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-slate-850 text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Start Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={editStartTime}
                    onChange={(e) => setEditStartTime(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">End Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={editEndTime}
                    onChange={(e) => setEditEndTime(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm disabled:opacity-50"
                >
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && deleteEventItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center">
              <div className="h-14 w-14 bg-rose-105 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="h-7 w-7" />
              </div>
              <h3 className="font-extrabold text-slate-800 text-lg mb-2">Delete Event?</h3>
              <p className="text-slate-500 text-xs font-semibold leading-relaxed mb-4">
                Are you sure you want to delete <strong className="text-slate-700">"{deleteEventItem.eventName}"</strong>? 
                <br />
                This will permanently remove the event, its participant roster, and all logged attendance. This action cannot be undone.
              </p>
              
              {deleteError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-600 px-3.5 py-2 rounded-xl text-xs font-semibold mb-4 text-left">
                  {deleteError}
                </div>
              )}
              
              <div className="flex space-x-2.5 justify-center">
                <button
                  type="button"
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  disabled={deleteLoading}
                  className="px-4.5 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteEvent}
                  disabled={deleteLoading}
                  className="px-4.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm disabled:opacity-50"
                >
                  {deleteLoading ? 'Deleting...' : 'Delete Permanently'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
