import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QrCode, ArrowLeft, Download, Printer, ExternalLink, Calendar, CheckSquare } from 'lucide-react';
import API from '../services/api';
import axios from 'axios';

export default function ViewQR() {
  const { id, token } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const response = await API.get('/faculty/events');
      const found = response.data.find(e => e.id.toString() === id);
      if (found) {
        setEvent(found);
      } else {
        setError('Event not found.');
      }
    } catch (err) {
      setError('Failed to fetch event metadata.');
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = async () => {
    if (!event) return;
    try {
      const qrUrl = `http://localhost:8080/api/public/events/qr/${token}`;
      const response = await axios.get(qrUrl, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'image/png' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const safeName = event.eventName.replace(/[^a-zA-Z0-9-_]/g, '_');
      link.download = `${safeName}_QR_Code.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download QR code: ' + err.message);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const qrImageUrl = `http://localhost:8080/api/public/events/qr/${token}`;
  const studentFormUrl = `http://localhost:5173/attend/${token}`;

  return (
    <div className="flex-1 max-w-2xl mx-auto px-4 py-8 w-full print:p-0">
      {/* Hide on print */}
      <div className="mb-6 print:hidden">
        <Link to="/dashboard" className="inline-flex items-center space-x-1.5 text-slate-500 hover:text-slate-800 font-semibold text-sm transition-colors">
          <ArrowLeft className="h-4.5 w-4.5" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 print:hidden">
          <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm mt-3 font-semibold">Loading QR Code...</p>
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl text-sm font-medium print:hidden">
          {error}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Printable Container */}
          <div 
            id="printable-qr-area" 
            className="glass p-8 rounded-2xl border border-slate-200/80 shadow-md flex flex-col items-center text-center bg-white print:border-none print:shadow-none print:bg-white"
          >
            {/* Styles inject for printing */}
            <style>{`
              @media print {
                body {
                  background-color: white !important;
                }
                header, footer, nav, button, a, .print\\:hidden {
                  display: none !important;
                }
                #printable-qr-area {
                  border: none !important;
                  box-shadow: none !important;
                  margin: 0 !important;
                  padding: 2cm !important;
                  width: 100% !important;
                  height: 100% !important;
                  display: flex !important;
                  flex-direction: column !important;
                  align-items: center !important;
                  justify-content: center !important;
                }
                .qr-title {
                  font-size: 24pt !important;
                  color: #0f172a !important;
                }
                .qr-subtitle {
                  font-size: 14pt !important;
                  color: #475569 !important;
                }
                .qr-image {
                  width: 8cm !important;
                  height: 8cm !important;
                }
              }
            `}</style>

            <h2 className="qr-title text-2xl font-black text-slate-800 line-clamp-2 px-4">{event.eventName}</h2>
            <p className="qr-subtitle text-slate-500 text-sm mt-1.5 font-bold uppercase tracking-wider">Scan QR Code to Check In</p>

            <div className="my-8 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl shadow-inner relative group">
              <img 
                src={qrImageUrl} 
                alt="Event QR Code" 
                className="qr-image h-64 w-64 object-contain"
              />
            </div>

            <div className="w-full max-w-sm space-y-4 print:hidden">
              <div className="text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200/60 p-3.5 rounded-xl break-all">
                <div className="font-bold text-slate-700 mb-1">Direct Link:</div>
                <a 
                  href={studentFormUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:underline inline-flex items-center space-x-1"
                >
                  <span>{studentFormUrl}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={downloadQR}
                  className="flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-colors text-sm"
                >
                  <Download className="h-4.5 w-4.5" />
                  <span>Download</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-colors text-sm"
                >
                  <Printer className="h-4.5 w-4.5" />
                  <span>Print Code</span>
                </button>
              </div>
            </div>

            <div className="hidden print:block text-slate-400 text-[10pt] mt-10 font-medium">
              Powered by SmartQR Attendance Management System
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
