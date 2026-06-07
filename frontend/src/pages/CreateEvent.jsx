import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, ArrowLeft, Info, HelpCircle } from 'lucide-react';
import API from '../services/api';

export default function CreateEvent() {
  const [eventName, setEventName] = useState('');
  const [eventPlace, setEventPlace] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [attendanceMode, setAttendanceMode] = useState('REGISTERED');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end <= start) {
      setError('End Time must be after the Start Time.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        eventName,
        eventPlace,
        startTime: startTime + ':00', // ensure LocalDateTime format ISO
        endTime: endTime + ':00',
        attendanceMode,
      };

      const response = await API.post('/faculty/events', payload);
      const newEvent = response.data;

      // Redirect logic: If REGISTERED, take them directly to the Excel upload page
      if (attendanceMode === 'REGISTERED') {
        navigate(`/events/${newEvent.id}/upload`);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 max-w-xl mx-auto px-4 py-8 w-full">
      <div className="mb-6 flex items-center justify-between">
        <Link to="/dashboard" className="inline-flex items-center space-x-1.5 text-slate-500 hover:text-slate-800 font-semibold text-sm transition-colors">
          <ArrowLeft className="h-4.5 w-4.5" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <div className="glass p-8 rounded-2xl border border-slate-200/80 shadow-md">
        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-200/60">
          <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
            <Calendar className="h-5.5 w-5.5" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800">Create Attendance Event</h2>
            <p className="text-slate-400 text-xs mt-0.5 font-bold uppercase tracking-wider">Configure QR event constraints</p>
          </div>
        </div>

        {error && (
          <div className="mb-5 bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Event Title</label>
            <input
              type="text"
              required
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="e.g. Seminar on AI Ethics / CS 101 Lecture"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-slate-800 text-sm font-medium bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Event Place / Venue</label>
            <input
              type="text"
              value={eventPlace}
              onChange={(e) => setEventPlace(e.target.value)}
              placeholder="e.g. Seminar Hall-1 / Room 402 / Virtual"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-slate-800 text-sm font-medium bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Start Date & Time</label>
              <input
                type="datetime-local"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-slate-800 text-sm font-medium bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">End Date & Time</label>
              <input
                type="datetime-local"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-slate-800 text-sm font-medium bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Attendance Mode</label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`border-2 rounded-xl p-4.5 flex flex-col justify-between cursor-pointer transition-all ${
                attendanceMode === 'REGISTERED' 
                  ? 'border-emerald-500 bg-emerald-50/40 text-slate-800' 
                  : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
              }`}>
                <input
                  type="radio"
                  name="attendanceMode"
                  value="REGISTERED"
                  checked={attendanceMode === 'REGISTERED'}
                  onChange={() => setAttendanceMode('REGISTERED')}
                  className="sr-only"
                />
                <div>
                  <span className="font-extrabold text-sm block mb-1">Registered</span>
                  <span className="text-[11px] leading-normal font-semibold">Upload Excel. Verifies emails match pre-registered lists.</span>
                </div>
              </label>

              <label className={`border-2 rounded-xl p-4.5 flex flex-col justify-between cursor-pointer transition-all ${
                attendanceMode === 'OPEN' 
                  ? 'border-emerald-500 bg-emerald-50/40 text-slate-800' 
                  : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
              }`}>
                <input
                  type="radio"
                  name="attendanceMode"
                  value="OPEN"
                  checked={attendanceMode === 'OPEN'}
                  onChange={() => setAttendanceMode('OPEN')}
                  className="sr-only"
                />
                <div>
                  <span className="font-extrabold text-sm block mb-1">Open Entry</span>
                  <span className="text-[11px] leading-normal font-semibold">Students enter Name, Email, Dept dynamically at check-in.</span>
                </div>
              </label>
            </div>
          </div>

          {/* Dynamic mode info banner */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start space-x-3 text-xs text-slate-500 leading-relaxed font-semibold">
            <Info className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            {attendanceMode === 'REGISTERED' ? (
              <p>
                <strong>Registered Mode:</strong> After clicking create, you will be taken to the upload page. You must upload an Excel spreadsheet (.xlsx) with columns: <strong>Name, Email, Department</strong>. Only students listed can mark attendance.
              </p>
            ) : (
              <p>
                <strong>Open Entry Mode:</strong> Students scan the QR code and register themselves during the event window. No Excel upload required.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-200 transition-all text-sm disabled:opacity-50"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
            ) : (
              <span>Create Event & Generate QR</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
