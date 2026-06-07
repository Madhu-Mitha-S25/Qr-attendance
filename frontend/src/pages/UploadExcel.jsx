import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Upload, ArrowLeft, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import API from '../services/api';

export default function UploadExcel() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      // Get event details
      const response = await API.get('/faculty/events');
      const found = response.data.find(e => e.id.toString() === id);
      if (found) {
        setEvent(found);
      } else {
        setError('Event not found.');
      }
    } catch (err) {
      setError('Failed to fetch event metadata.');
    }
  };

  const handleFileChange = (e) => {
    setError('');
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const extension = selectedFile.name.split('.').pop().toLowerCase();
      if (extension !== 'xlsx') {
        setError('Please select a valid Excel file (.xlsx).');
        setFile(null);
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      await API.post(`/faculty/events/${id}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess('Participants registered successfully!');
      setTimeout(() => {
        navigate(`/events/${id}/qr/${event.qrToken}`);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error processing Excel sheet. Make sure headers are correct.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 max-w-xl mx-auto px-4 py-8 w-full">
      <div className="mb-6">
        <Link to="/dashboard" className="inline-flex items-center space-x-1.5 text-slate-500 hover:text-slate-800 font-semibold text-sm transition-colors">
          <ArrowLeft className="h-4.5 w-4.5" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <div className="glass p-8 rounded-2xl border border-slate-200/80 shadow-md">
        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-200/60">
          <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
            <Upload className="h-5.5 w-5.5" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800">Upload Student List</h2>
            <p className="text-slate-400 text-xs mt-0.5 font-bold uppercase tracking-wider">Populate event database</p>
          </div>
        </div>

        {event && (
          <div className="mb-6 p-4.5 bg-slate-50 border border-slate-200/65 rounded-xl">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Event details</div>
            <h3 className="text-lg font-bold text-slate-800 mt-0.5">{event.eventName}</h3>
            <span className="inline-flex px-2.5 py-0.5 mt-2 rounded-full text-xs font-bold bg-blue-50 border border-blue-200 text-blue-700">
              Registered Mode
            </span>
          </div>
        )}

        {error && (
          <div className="mb-5 bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 bg-emerald-50 border border-emerald-200 text-emerald-600 px-4 py-3 rounded-xl text-sm font-medium animate-pulse">
            {success}
          </div>
        )}

        {/* Excel Instructions */}
        <div className="mb-6 border border-slate-200 bg-emerald-50/20 p-5 rounded-xl space-y-3">
          <h4 className="text-sm font-bold text-slate-800 flex items-center space-x-1.5">
            <FileText className="h-4.5 w-4.5 text-emerald-600" />
            <span>Excel Sheet Requirements:</span>
          </h4>
          <ul className="text-xs font-semibold text-slate-500 list-disc list-inside space-y-1.5">
            <li>File must be in Excel 2007+ spreadsheet format (extension <code className="bg-white border px-1 py-0.5 rounded text-emerald-600">.xlsx</code>).</li>
            <li>Sheet must contain columns with headers: <strong className="text-slate-700">Name</strong>, <strong className="text-slate-700">Email</strong>, and <strong className="text-slate-700">Department</strong>.</li>
            <li>Columns are case-insensitive. Email address will be used for attendance verification check.</li>
          </ul>
        </div>

        <form onSubmit={handleUploadSubmit} className="space-y-6">
          <div className="border-2 border-dashed border-slate-200 hover:border-emerald-500/70 rounded-2xl p-8 text-center transition-all bg-white relative">
            <input
              type="file"
              id="excelFile"
              accept=".xlsx"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="space-y-2.5 pointer-events-none">
              <Upload className="h-10 w-10 text-slate-300 mx-auto" />
              {file ? (
                <div>
                  <p className="text-sm font-bold text-slate-700">{file.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-bold text-slate-600">Drag & drop your Excel sheet here</p>
                  <p className="text-xs text-slate-400 mt-1">or click to browse from files (.xlsx only)</p>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !file}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-200 transition-all text-sm disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <CheckCircle className="h-4.5 w-4.5" />
                <span>Upload & Save Students</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
