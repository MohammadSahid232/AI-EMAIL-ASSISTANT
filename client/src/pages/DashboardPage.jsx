import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Send,
  FileText,
  Reply,
  BookmarkCheck,
  Zap,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Sparkles,
  CheckCheck,
  RefreshCw,
  Gauge,
  Languages,
  Search
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid
} from 'recharts';
import { Header } from '../components/layout/Header';
import { GlassCard } from '../components/common/GlassCard';
import { Skeleton } from '../components/common/Skeleton';
import { dashboardService } from '../services/dashboardService';

export const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChartTab, setActiveChartTab] = useState('daily');
  const [activitySearch, setActivitySearch] = useState('');

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statsRes, analyticsRes, activitiesRes] = await Promise.all([
          dashboardService.getStatistics(),
          dashboardService.getAnalytics(),
          dashboardService.getActivities()
        ]);
        setStats(statsRes.data.stats);
        setAnalytics(analyticsRes.data.analytics);
        setActivities(activitiesRes.data.activities);
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const cards = [
    { title: 'Total Emails Generated', value: stats?.totalEmailsGenerated ?? 14, icon: Send, color: 'from-blue-500 to-indigo-600', label: '+18% vs last week' },
    { title: 'Summaries Created', value: stats?.summariesCreated ?? 8, icon: FileText, color: 'from-purple-500 to-brand-600', label: '+12% vs last week' },
    { title: 'Replies Generated', value: stats?.repliesGenerated ?? 12, icon: Reply, color: 'from-indigo-500 to-purple-600', label: '+24% vs last week' },
    { title: 'Saved Templates', value: stats?.savedTemplates ?? 5, icon: BookmarkCheck, color: 'from-amber-500 to-orange-600', label: 'Active Library' },
    { title: 'AI Usage Today', value: stats?.aiUsageToday ?? 6, icon: Zap, color: 'from-emerald-500 to-teal-600', label: 'Healthy quota' }
  ];

  const quickActions = [
    { name: 'Generate Email', path: '/app/generate-email', icon: Send, color: 'text-brand-500 bg-brand-500/10' },
    { name: 'Reply Generator', path: '/app/reply-generator', icon: Reply, color: 'text-indigo-500 bg-indigo-500/10' },
    { name: 'Summarize Email', path: '/app/summarizer', icon: FileText, color: 'text-purple-500 bg-purple-500/10' },
    { name: 'Grammar Check', path: '/app/grammar-checker', icon: CheckCheck, color: 'text-emerald-500 bg-emerald-500/10' },
    { name: 'Rewrite Style', path: '/app/rewrite-email', icon: RefreshCw, color: 'text-amber-500 bg-amber-500/10' },
    { name: 'Tone Analysis', path: '/app/tone-detection', icon: Gauge, color: 'text-rose-500 bg-rose-500/10' }
  ];

  return (
    <div className="flex-1 space-y-8 pb-12">
      <Header title="Dashboard Overview" />

      <div className="px-6 space-y-8 max-w-7xl mx-auto">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <GlassCard key={idx} className="p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{card.title}</span>
                    <div className={`p-2 rounded-xl bg-gradient-to-tr ${card.color} text-white shadow-md`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  {loading ? (
                    <Skeleton className="h-8 w-16 mt-3" />
                  ) : (
                    <div className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-white">
                      {card.value}
                    </div>
                  )}
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200/50 dark:border-slate-800/50 text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center space-x-1 font-medium">
                  <TrendingUp className="w-3 h-3" />
                  <span>{card.label}</span>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Analytics Chart & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Usage Analytics Chart */}
          <GlassCard className="lg:col-span-2 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI Activity Analytics</h3>
                  <p className="text-xs text-slate-500">Track email generation, summaries, and responses</p>
                </div>
                <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium">
                  <button
                    onClick={() => setActiveChartTab('daily')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      activeChartTab === 'daily'
                        ? 'bg-brand-500 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    Daily
                  </button>
                  <button
                    onClick={() => setActiveChartTab('weekly')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      activeChartTab === 'weekly'
                        ? 'bg-brand-500 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    Weekly
                  </button>
                  <button
                    onClick={() => setActiveChartTab('monthly')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      activeChartTab === 'monthly'
                        ? 'bg-brand-500 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    Monthly
                  </button>
                </div>
              </div>

              <div className="h-64 mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  {activeChartTab === 'daily' ? (
                    <AreaChart data={analytics?.dailyUsage || []}>
                      <defs>
                        <linearGradient id="colorEmails" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#536df8" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#536df8" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#131b2e',
                          borderColor: '#233256',
                          borderRadius: '12px',
                          color: '#fff'
                        }}
                      />
                      <Area type="monotone" dataKey="emails" stroke="#536df8" fillOpacity={1} fill="url(#colorEmails)" strokeWidth={3} />
                    </AreaChart>
                  ) : activeChartTab === 'weekly' ? (
                    <BarChart data={analytics?.weeklyUsage || []}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: '#131b2e', borderRadius: '12px', color: '#fff' }} />
                      <Bar dataKey="usage" fill="#536df8" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  ) : (
                    <BarChart data={analytics?.monthlyUsage || []}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: '#131b2e', borderRadius: '12px', color: '#fff' }} />
                      <Bar dataKey="usage" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          </GlassCard>

          {/* Quick Actions Panel */}
          <GlassCard className="p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Quick Launcher</h3>
              <p className="text-xs text-slate-500 mb-4">Jump straight into AI execution</p>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, idx) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={idx}
                      to={action.path}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-brand-500/10 border border-slate-200/60 dark:border-slate-700/60 transition-all flex flex-col items-center justify-center text-center group"
                    >
                      <div className={`p-2.5 rounded-xl ${action.color} group-hover:scale-110 transition-transform mb-2`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-brand-500">
                        {action.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Recent Activity Timeline */}
        <GlassCard className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/50 dark:border-slate-800/50 mb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Clock className="w-5 h-5 text-brand-500" />
              <span>Recent Activity History</span>
            </h3>
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={activitySearch}
                onChange={(e) => setActivitySearch(e.target.value)}
                placeholder="Search activities..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs text-slate-900 dark:text-slate-100 border border-slate-200/60 dark:border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-200/50 dark:divide-slate-800/50">
            {(() => {
              const filtered = activities.filter((act) => {
                const q = activitySearch.toLowerCase().trim();
                return !q ||
                  act.activity?.toLowerCase().includes(q) ||
                  act.details?.toLowerCase().includes(q);
              });
              if (filtered.length === 0) return (
                <div className="py-8 text-center text-xs text-slate-500">
                  {activitySearch ? `No activities match "${activitySearch}"` : 'No recent activity recorded yet. Run an AI generation to get started!'}
                </div>
              );
              return filtered.map((act, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0"></div>
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{act.activity}</span>
                      {act.details && (
                        <p className="text-slate-400 font-mono text-[11px] truncate max-w-md">{act.details}</p>
                      )}
                    </div>
                  </div>
                  <span className="text-slate-400 flex-shrink-0">
                    {new Date(act.time || act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ));
            })()}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
