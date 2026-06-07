import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, AlertTriangle, XCircle, Clock, Send, Award, Calendar } from 'lucide-react';
import axios from 'axios';

export default function StudentForm() {
  const { token } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Status screens
  const [status, setStatus] = useState(null); // 'SUCCESS', 'ALREADY_MARKED', 'CLOSED', 'NOT_REGISTERED', 'ERROR'
  const [statusMsg, setStatusMsg] = useState('');
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    fetchEventDetails();
  }, [token]);

  useEffect(() => {
    if (!event) return;

    const timer = setInterval(() => {
      const difference = new Date(event.endTime) - new Date();
      if (difference <= 0) {
        setTimeLeft(null);
        setStatus('CLOSED');
        clearInterval(timer);
      } else {
        const hours = Math.floor((difference / (1000 * 60 * 60)));
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [event]);

  const fetchEventDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/public/events/${token}`);
      const data = response.data;
      setEvent(data);

      if (data.expired) {
        setStatus('CLOSED');
      } else if (data.notStarted) {
        setError('Attendance session has not started yet.');
      }
    } catch (err) {
      setError('Invalid QR code or session link. Please verify and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    setStatusMsg('');

    const payload = {
      name: event.attendanceMode === 'OPEN' ? name : null,
      email: email.trim(),
      department: event.attendanceMode === 'OPEN' ? department : null,
    };

    try {
      await axios.post(`http://localhost:8080/api/public/attendance/mark/${token}`, payload);
      setStatus('SUCCESS');
    } catch (err) {
      const statusValue = err.response?.status;
      const responseMsg = err.response?.data?.message || '';

      if (statusValue === 409 || responseMsg.includes('Already Marked')) {
        setStatus('ALREADY_MARKED');
      } else if (statusValue === 400 && responseMsg.includes('Not Registered')) {
        setStatus('NOT_REGISTERED');
      } else if (statusValue === 400 && responseMsg.includes('Closed')) {
        setStatus('CLOSED');
      } else {
        setStatus('ERROR');
        setStatusMsg(responseMsg || 'An error occurred while logging attendance.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 min-h-screen">
        <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 text-sm mt-3 font-semibold">Loading attendance sheet...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 min-h-screen">
        <div className="w-full max-w-md glass p-8 rounded-2xl shadow-xl text-center">
          <XCircle className="h-14 w-14 text-rose-500 mx-auto mb-4" />
          <h2 className="text-2xl font-extrabold text-slate-800">Invalid Link</h2>
          <p className="text-slate-500 text-sm mt-2 font-medium leading-relaxed">{error}</p>
        </div>
      </div>
    );
  }

  // Helper render for status screens
  if (status === 'SUCCESS') {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 min-h-screen">
        <div className="w-full max-w-md glass p-8 rounded-2xl shadow-xl text-center border border-white/60">
          <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow shadow-emerald-100">
            <CheckCircle className="h-9 w-9" />
          </div>
          <h2 className="text-2xl font-black text-slate-800">Check-in Complete</h2>
          <p className="text-emerald-700 font-bold text-sm mt-1 bg-emerald-50 py-1.5 px-3 rounded-lg inline-block">
            Attendance Marked
          </p>
          <div className="mt-6 p-4 bg-slate-50 border border-slate-200/60 rounded-xl text-left text-xs font-semibold text-slate-500 space-y-1.5">
            <div><span className="text-slate-400 font-bold uppercase tracking-wider block text-[9px] mb-0.5">Event:</span> {event?.eventName}</div>
            <div><span className="text-slate-400 font-bold uppercase tracking-wider block text-[9px] mb-0.5">Time Logged:</span> {new Date().toLocaleTimeString()}</div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'ALREADY_MARKED') {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 min-h-screen">
        <div className="w-full max-w-md glass p-8 rounded-2xl shadow-xl text-center border border-white/60">
          <div className="h-16 w-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow shadow-amber-100">
            <AlertTriangle className="h-9 w-9" />
          </div>
          <h2 className="text-2xl font-black text-slate-800">Duplicate Check</h2>
          <p className="text-amber-700 font-bold text-sm mt-1 bg-amber-50 py-1.5 px-3 rounded-lg inline-block">
            Attendance Already Marked
          </p>
          <p className="text-slate-500 text-xs font-semibold mt-4 leading-relaxed max-w-xs mx-auto">
            You have already recorded your check-in for this event. Duplicate submissions are prevented.
          </p>
        </div>
      </div>
    );
  }

  if (status === 'CLOSED') {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 min-h-screen">
        <div className="w-full max-w-md glass p-8 rounded-2xl shadow-xl text-center border border-white/60">
          <div className="h-16 w-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow shadow-rose-100">
            <XCircle className="h-9 w-9" />
          </div>
          <h2 className="text-2xl font-black text-slate-800">Session Expired</h2>
          <p className="text-rose-700 font-bold text-sm mt-1 bg-rose-50 py-1.5 px-3 rounded-lg inline-block">
            Attendance Session Closed
          </p>
          <p className="text-slate-500 text-xs font-semibold mt-4 leading-relaxed max-w-xs mx-auto">
            This attendance logging window has expired or has been manually closed by the coordinator.
          </p>
        </div>
      </div>
    );
  }

  if (status === 'NOT_REGISTERED') {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 min-h-screen">
        <div className="w-full max-w-md glass p-8 rounded-2xl shadow-xl text-center border border-white/60">
          <div className="h-16 w-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow shadow-rose-100">
            <XCircle className="h-9 w-9" />
          </div>
          <h2 className="text-2xl font-black text-slate-800">Unregistered Email</h2>
          <p className="text-rose-700 font-bold text-sm mt-1 bg-rose-50 py-1.5 px-3 rounded-lg inline-block">
            Participant Not Registered
          </p>
          <p className="text-slate-500 text-xs font-semibold mt-4 leading-relaxed max-w-xs mx-auto">
            The email address you entered was not found on the registered participant list uploaded by the faculty coordinator.
          </p>
          <button
            onClick={() => setStatus(null)}
            className="mt-6 text-xs font-bold text-emerald-600 hover:underline bg-emerald-50 px-3.5 py-2 rounded-lg"
          >
            Try Another Email
          </button>
        </div>
      </div>
    );
  }

  const isRegisteredMode = event.attendanceMode === 'REGISTERED';

  return (
    <div className="flex-1 flex flex-col justify-center py-12 px-6 sm:px-8 bg-slate-50 relative overflow-hidden min-h-screen">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse delay-1000"></div>

      <div className="w-full max-w-md glass p-8 rounded-2xl shadow-xl border border-white/60 relative z-10 mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-slate-800 line-clamp-2">{event.eventName}</h2>
          <span className="inline-flex mt-2 items-center space-x-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-full text-xs font-bold">
            <Calendar className="h-3.5 w-3.5" />
            <span>Attendance Active</span>
          </span>
        </div>

        {/* Live Timer */}
        {timeLeft && (
          <div className="mb-6 py-3 px-4.5 bg-slate-900 border border-slate-800 text-white rounded-xl flex items-center justify-between shadow-inner">
            <span className="text-xs font-bold tracking-wide uppercase text-slate-400 flex items-center space-x-1">
              <Clock className="h-4 w-4 text-emerald-500" />
              <span>Time Remaining:</span>
            </span>
            <span className="font-mono text-emerald-400 font-bold text-sm">
              {timeLeft.hours.toString().padStart(2, '0')}:
              {timeLeft.minutes.toString().padStart(2, '0')}:
              {timeLeft.seconds.toString().padStart(2, '0')}
            </span>
          </div>
        )}

        {status === 'ERROR' && (
          <div className="mb-5 bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl text-sm font-medium">
            {statusMsg}
          </div>
        )}

        <form onSubmit={handleMarkAttendance} className="space-y-4">
          {isRegisteredMode ? (
            <div>
              <p className="text-slate-500 text-xs font-semibold mb-4 text-center leading-relaxed">
                This event is restricted to registered participants. Please submit your registered email to log check-in.
              </p>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Registered Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@college.edu"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-slate-800 text-sm font-medium bg-white/70"
                />
              </div>
            </div>
          ) : (
            <>
              <p className="text-slate-500 text-xs font-semibold mb-4 text-center leading-relaxed">
                This session is open. Enter your profile details below to check in.
              </p>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rahul Verma"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-slate-800 text-sm font-medium bg-white/70"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rahul.v@college.edu"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-slate-800 text-sm font-medium bg-white/70"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Department</label>
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Mechanical Engineering / BioTech"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-slate-800 text-sm font-medium bg-white/70"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-100 transition-all text-sm disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {submitting ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Send className="h-4.5 w-4.5" />
                <span>Mark Present</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
