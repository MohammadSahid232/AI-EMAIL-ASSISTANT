import React, { useEffect, useState } from 'react';
import { Users, Shield, Search, UserCheck } from 'lucide-react';
import { adminService } from '../services/adminService';
import { useToast } from '../context/ToastContext';

export const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getUsers();
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await adminService.updateUserRole(userId, newRole);
      addToast(`User role changed to ${newRole}`, 'success');
      loadUsers();
    } catch (err) {
      addToast('Failed to update role', 'error');
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      (u.name || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.role || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center space-x-2">
            <Users className="w-6 h-6 text-amber-400" />
            <span>User Management</span>
          </h1>
          <p className="text-xs text-slate-400">View registered accounts and assign role privileges</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>

      <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Joined Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900">
            {filteredUsers.map((u) => (
              <tr key={u._id} className="hover:bg-slate-900/50 transition-colors">
                <td className="p-4 font-semibold text-white flex items-center space-x-3">
                  <img src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'} className="w-8 h-8 rounded-lg object-cover" />
                  <span>{u.name}</span>
                </td>
                <td className="p-4 font-mono text-slate-400">{u.email}</td>
                <td className="p-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      u.role === 'admin'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="p-4 text-slate-500">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleRoleToggle(u._id, u.role)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/30 font-medium text-[11px] transition-all"
                  >
                    Set as {u.role === 'admin' ? 'User' : 'Admin'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
