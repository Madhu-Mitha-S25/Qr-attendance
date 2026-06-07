import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Radio, Download, Users, CheckCircle, XCircle, Clock } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import API from '../services/api';

export default function LiveDashboard() {
  const { id } = useParams();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pollingActive, setPollingActive] = useState(true);
  const pollingInterval = useRef(null);

  useEffect(() => {
    fetchLiveStats();
    
    // Start Polling every 3 seconds for live dashboard updates
    pollingInterval.current = setInterval(fetchLiveStats, 3000);

    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, [id]);

  const fetchLiveStats = async () => {
    try {
      const response = await API.get(`/faculty/attendance/event/${id}`);
      setStats(response.data);
      setError('');
    } catch (err) {
      setError('Connection interrupted. Retrying live sync...');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!stats) return;
    try {
      const response = await API.get(`/faculty/attendance/event/${id}/export`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const safeName = stats.eventName.replace(/[^a-zA-Z0-9-_]/g, '_');
      link.download = `${safeName}_attendance.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Error exporting attendance report: ' + err.message);
    }
  };

  const getPieData = () => {
    if (!stats) return [];
    return [
      { name: 'Present', value: stats.presentCount },
      { name: 'Absent', value: stats.absentCount },
    ];
  };

  const getBarData = () => {
    if (!stats) return [];
    const deptMap = {};
    stats.records.forEach(r => {
      if (r.present) {
        deptMap[r.department] = (deptMap[r.department] || 0) + 1;
      }
    });
    return Object.keys(deptMap).map(dept => ({
      department: dept,
      Attendees: deptMap[dept]
    }));
  };

  const formatTime = (isoString) => {
    if (!isoString) return '-';
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const COLORS = ['#10b981', '#f43f5e']; // Emerald-500, Rose-500

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Header and Live indicator */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <Link to="/dashboard" className="text-slate-500 hover:text-slate-800 p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Live Monitor</h1>
              <span className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-emerald-50 border-emerald-200 text-emerald-700 animate-pulse`}>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                <span>Live Syncing</span>
              </span>
            </div>
            {stats && <p className="text-slate-500 text-sm mt-1 font-semibold">{stats.eventName}</p>}
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            onClick={handleExport}
            disabled={!stats}
            className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-5 rounded-xl shadow-md transition-all text-sm disabled:opacity-50"
          >
            <Download className="h-4.5 w-4.5" />
            <span>Download Attendance Excel</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl text-sm font-medium animate-pulse flex items-center space-x-2">
          <span className="h-2 w-2 rounded-full bg-rose-500"></span>
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm mt-3 font-semibold">Loading live workspace...</p>
        </div>
      ) : !stats ? (
        <div className="text-center py-10">No statistics available.</div>
      ) : (
        <div className="space-y-8">
          {/* Counters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="glass p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Participants</div>
                <div className="text-3xl font-black text-slate-800 mt-1">{stats.totalParticipants}</div>
              </div>
              <div className="p-3 bg-slate-100 text-slate-600 rounded-xl">
                <Users className="h-6 w-6" />
              </div>
            </div>

            <div className="glass p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Present</div>
                <div className="text-3xl font-black text-emerald-600 mt-1">{stats.presentCount}</div>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <CheckCircle className="h-6 w-6" />
              </div>
            </div>

            <div className="glass p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Absent</div>
                <div className="text-3xl font-black text-rose-500 mt-1">
                  {stats.attendanceMode === 'REGISTERED' ? stats.absentCount : 'N/A'}
                </div>
              </div>
              <div className="p-3 bg-rose-50 text-rose-500 rounded-xl">
                <XCircle className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Visualisations Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pie Chart / Attendance Ratio */}
            <div className="glass p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center">
              <h3 className="text-md font-bold text-slate-700 mb-4 self-start">Attendance Ratio</h3>
              {stats.presentCount === 0 && stats.absentCount === 0 ? (
                <div className="h-64 flex items-center justify-center text-slate-400 font-semibold text-sm">
                  Waiting for check-ins...
                </div>
              ) : (
                <div className="h-64 w-full flex justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getPieData()}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {getPieData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Bar Chart / Department Check-ins */}
            <div className="glass p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center">
              <h3 className="text-md font-bold text-slate-700 mb-4 self-start">Attendees by Department</h3>
              {getBarData().length === 0 ? (
                <div className="h-64 flex items-center justify-center text-slate-400 font-semibold text-sm">
                  No check-ins by department yet...
                </div>
              ) : (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getBarData()}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="department" stroke="#94a3b8" fontSize={11} fontWeight={600} />
                      <YAxis stroke="#94a3b8" fontSize={11} fontWeight={600} allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="Attendees" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          {/* Student Log Table */}
          <div className="glass rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200/60 bg-white">
              <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
                <Clock className="h-5 w-5 text-emerald-600" />
                <span>Attendance Log Timeline</span>
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-slate-800 text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/60 text-slate-400 font-bold text-xs uppercase tracking-wider">
                    <th className="py-4.5 px-6">Name</th>
                    <th className="py-4.5 px-6">Email Address</th>
                    <th className="py-4.5 px-6">Department</th>
                    <th className="py-4.5 px-6">Check-in Time</th>
                    <th className="py-4.5 px-6 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60">
                  {stats.records.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-10 text-slate-400 font-semibold">
                        No student check-ins recorded.
                      </td>
                    </tr>
                  ) : (
                    stats.records.map((record, index) => (
                      <tr key={record.email + index} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4.5 px-6 font-bold text-slate-800">{record.name}</td>
                        <td className="py-4.5 px-6 text-slate-500 font-medium">{record.email}</td>
                        <td className="py-4.5 px-6 text-slate-600 font-semibold">{record.department}</td>
                        <td className="py-4.5 px-6 text-slate-400 font-medium">
                          {record.attendanceTime ? formatTime(record.attendanceTime) : '-'}
                        </td>
                        <td className="py-4.5 px-6 text-center">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                            record.present 
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                              : 'bg-rose-50 border-rose-200 text-rose-600'
                          }`}>
                            {record.present ? 'Present' : 'Absent'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
