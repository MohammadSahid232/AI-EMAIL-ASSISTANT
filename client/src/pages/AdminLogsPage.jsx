import React, { useEffect, useState } from 'react';
import { Terminal, ShieldAlert } from 'lucide-react';
import { adminService } from '../services/adminService';

export const AdminLogsPage = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await adminService.getSystemLogs();
        if (res.data.success) {
          setLogs(res.data.logs);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center space-x-2">
          <Terminal className="w-6 h-6 text-emerald-400" />
          <span>System Audit Logs</span>
        </h1>
        <p className="text-xs text-slate-400">Server events, API endpoints, and authentication traffic</p>
      </div>

      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-3">
        {logs.map((log) => (
          <div key={log._id} className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                log.level === 'error' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {log.level}
              </span>
              <span className="text-slate-100">{log.message}</span>
            </div>
            <div className="flex items-center space-x-4 text-slate-500 text-[11px]">
              <span>{log.method} {log.endpoint}</span>
              <span>IP: {log.ip}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
