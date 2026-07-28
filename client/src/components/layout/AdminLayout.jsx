import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Shield, Users, Mail, BarChart3, Terminal, Cpu, ArrowLeft, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const adminNav = [
    { name: 'System Overview', path: '/admin/dashboard', icon: Shield },
    { name: 'Client Accounts & Roles', path: '/admin/users', icon: Users },
    { name: 'Client Email Data Logs', path: '/admin/emails', icon: Mail },
    { name: 'API Usage Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'System Audit Logs', path: '/admin/logs', icon: Terminal }
  ];

  return (
    <div className="min-h-screen flex bg-slate-900 text-slate-100 font-sans">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0">
        <div>
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-slate-100 text-base">Admin Portal</h1>
                <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">Super Control</span>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-1">
            <button
              onClick={() => navigate('/app/dashboard')}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 mb-4 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to App Dashboard</span>
            </button>

            {adminNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
              AD
            </div>
            <div>
              <p className="text-xs font-semibold">{user?.name || 'Administrator'}</p>
              <p className="text-[10px] text-amber-400">System Admin</p>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 p-8 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};
