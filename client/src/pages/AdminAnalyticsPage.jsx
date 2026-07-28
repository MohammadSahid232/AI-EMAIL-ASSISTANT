import React, { useEffect, useState } from 'react';
import { BarChart3, Cpu } from 'lucide-react';
import { adminService } from '../services/adminService';

export const AdminAnalyticsPage = () => {
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    const fetchApiUsage = async () => {
      try {
        const res = await adminService.getApiUsage();
        if (res.data.success) {
          setMetrics(res.data.metrics);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchApiUsage();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center space-x-2">
          <BarChart3 className="w-6 h-6 text-purple-400" />
          <span>API Usage & Latency Analytics</span>
        </h1>
        <p className="text-xs text-slate-400">Tool execution metrics and performance benchmarks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {metrics.map((m, i) => (
          <div key={i} className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white">{m.tool}</h4>
              <p className="text-xs text-slate-400 mt-1">Total Calls: {m.requests}</p>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-purple-500/10 text-purple-400 border border-purple-500/30">
                Latency: {m.latency}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
