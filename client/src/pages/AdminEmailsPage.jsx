import React, { useEffect, useState } from 'react';
import { Mail, Search, Eye, User, X, Sparkles } from 'lucide-react';
import { adminService } from '../services/adminService';

export const AdminEmailsPage = () => {
  const [emails, setEmails] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const res = await adminService.getEmailLogs();
        if (res.data.success) {
          setEmails(res.data.emails);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmails();
  }, []);

  const filteredEmails = emails.filter((e) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    const userName = e.userId?.name || '';
    const userEmail = e.userId?.email || '';
    return (
      (e.type || '').toLowerCase().includes(q) ||
      (e.prompt || '').toLowerCase().includes(q) ||
      (e.generatedText || '').toLowerCase().includes(q) ||
      userName.toLowerCase().includes(q) ||
      userEmail.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center space-x-2">
            <Mail className="w-6 h-6 text-blue-400" />
            <span>Client Email Generations Data</span>
          </h1>
          <p className="text-xs text-slate-400">Admin Inspection & Audit Log of Client AI Generations</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client, prompt, type..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
            <tr>
              <th className="p-4">Client User</th>
              <th className="p-4">Tool Type</th>
              <th className="p-4">Prompt Excerpt</th>
              <th className="p-4">Generated Output</th>
              <th className="p-4">Timestamp</th>
              <th className="p-4 text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900 font-mono">
            {filteredEmails.map((e) => (
              <tr key={e._id} className="hover:bg-slate-900/50">
                <td className="p-4 font-sans text-white font-semibold">
                  {e.userId?.name || 'Executive Client'}
                  <span className="block text-[10px] text-slate-500 font-mono">{e.userId?.email || 'user@example.com'}</span>
                </td>
                <td className="p-4 text-blue-400 font-bold">{e.type}</td>
                <td className="p-4 text-slate-400 truncate max-w-xs">{e.prompt}</td>
                <td className="p-4 text-slate-300 truncate max-w-md">{e.generatedText}</td>
                <td className="p-4 text-slate-500 font-sans text-[11px]">
                  {new Date(e.createdAt).toLocaleString()}
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => setSelectedEmail(e)}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-blue-400 border border-blue-500/30"
                    title="Inspect Full Data"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal to view full client prompt & generated output */}
      {selectedEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-bold text-white">Client Data Details</h3>
              </div>
              <button onClick={() => setSelectedEmail(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-500 block">Client Name:</span>
                <span className="text-white font-bold">{selectedEmail.userId?.name || 'Executive Client'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Tool Action:</span>
                <span className="text-blue-400 font-bold">{selectedEmail.type}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Client Prompt
              </label>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 max-h-36 overflow-y-auto whitespace-pre-wrap">
                {selectedEmail.prompt}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Generated Output
              </label>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 max-h-48 overflow-y-auto whitespace-pre-wrap">
                {selectedEmail.generatedText}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
