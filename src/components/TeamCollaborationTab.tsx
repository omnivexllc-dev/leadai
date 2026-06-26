/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Users, Shield, Plus, Activity, Mail, CheckCircle2 } from 'lucide-react';
import { TeamMember, ActivityLog } from '../types';

interface TeamCollaborationTabProps {
  members: TeamMember[];
  onInviteMember: (member: TeamMember) => void;
  activities: ActivityLog[];
  isDark: boolean;
}

export default function TeamCollaborationTab({
  members,
  onInviteMember,
  activities,
  isDark
}: TeamCollaborationTabProps) {
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<'Sales Team Member' | 'Admin'>('Sales Team Member');
  const [toast, setToast] = useState<string | null>(null);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !inviteName) return;

    const newMember: TeamMember = {
      id: `team-${Date.now()}`,
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      status: 'Invited',
      joinedAt: new Date().toISOString()
    };

    onInviteMember(newMember);
    setInviteName('');
    setInviteEmail('');
    setShowInvite(false);
    setToast(`Workspace invitation sent to ${inviteEmail}!`);
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Col 1 & 2: Seat Allocation and Members Grid */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className={`text-sm font-bold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Users className="w-4.5 h-4.5 text-blue-500" /> Workspace Team Collaboration Seats
            </h3>
            <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Organize team permissions, review member activities, and assign leads.
            </p>
          </div>

          <button
            onClick={() => setShowInvite(!showInvite)}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-md flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" /> Invite Seat
          </button>
        </div>

        {/* Invite Member Drawer form */}
        {showInvite && (
          <div className={`p-5 rounded-xl border shadow-md animate-slideDown ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <form onSubmit={handleInvite} className="space-y-4">
              <h4 className={`text-xs uppercase font-black tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Invite New Agency Collaborator
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Victoria Mercer"
                    className={`w-full py-2 px-3 rounded-lg text-xs outline-none focus:ring-2 border ${
                      isDark
                        ? 'bg-slate-950 border-slate-800 focus:border-blue-500 focus:ring-blue-500/20 text-white'
                        : 'bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/10 text-slate-800'
                    }`}
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="victoria@agency.com"
                    className={`w-full py-2 px-3 rounded-lg text-xs outline-none focus:ring-2 border ${
                      isDark
                        ? 'bg-slate-950 border-slate-800 focus:border-blue-500 focus:ring-blue-500/20 text-white'
                        : 'bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/10 text-slate-800'
                    }`}
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Seat Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as any)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs text-slate-700 dark:text-slate-200 outline-none"
                  >
                    <option value="Sales Team Member">Sales Rep</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowInvite(false)}
                  className="px-4 py-1.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow cursor-pointer"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Member cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {members.map((m) => (
            <div
              key={m.id}
              className={`p-4 rounded-xl border shadow-sm flex items-center gap-4 ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              {/* Avatar image */}
              <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-200 dark:border-slate-800">
                {m.avatar ? (
                  <img src={m.avatar} alt={m.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-indigo-500 text-white font-bold text-base flex items-center justify-center">
                    {m.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Detail specs */}
              <div className="min-w-0 flex-1 space-y-0.5">
                <div className="flex justify-between items-center">
                  <h4 className={`text-xs font-black truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{m.name}</h4>
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                    m.status === 'Active' 
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/40 dark:border-emerald-900' 
                      : 'bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-950/40 dark:border-amber-900'
                  }`}>
                    {m.status}
                  </span>
                </div>
                <p className="text-slate-400 text-[10px] font-mono truncate">{m.email}</p>
                <div className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold mt-1">
                  <Shield className="w-3.5 h-3.5 text-blue-500" /> {m.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Col 3: Shared activities ledger log */}
      <div className="space-y-6">
        <div>
          <h3 className={`text-sm font-bold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Activity className="w-4.5 h-4.5 text-indigo-500" /> Workspace Activity Log
          </h3>
          <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Historical records of pipeline mutations and email sequence updates.
          </p>
        </div>

        <div className={`p-4 rounded-xl border shadow-sm flex flex-col justify-between max-h-[380px] overflow-y-auto ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="space-y-3.5 pr-1">
            {activities.map((act) => (
              <div
                key={act.id}
                className="flex gap-2.5 items-start text-xs font-sans text-slate-600 dark:text-slate-400"
              >
                <div className="mt-1">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full block" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[11px] leading-tight">
                    <span className="text-slate-800 dark:text-slate-200">{act.userName}</span>
                    <span className="text-slate-500 font-normal"> {act.action}</span>
                  </p>
                  <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold mt-0.5 truncate underline">
                    {act.target}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-800 flex items-center gap-2 animate-fadeIn text-xs font-bold">
          <Users className="w-4 h-4 text-blue-400 shrink-0" />
          <span>{toast}</span>
          <button onClick={() => setToast(null)} className="ml-2 text-slate-400 hover:text-white cursor-pointer">✕</button>
        </div>
      )}
    </div>
  );
}
