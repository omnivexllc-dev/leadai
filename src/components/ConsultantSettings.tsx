/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, Briefcase, Mail, Phone, Calendar, Globe, Check, Settings2 } from 'lucide-react';
import { ConsultantProfile } from '../types';

interface ConsultantSettingsProps {
  profile: ConsultantProfile;
  onSave: (newProfile: ConsultantProfile) => void;
}

export default function ConsultantSettings({ profile, onSave }: ConsultantSettingsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ConsultantProfile>({ ...profile });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
            <Settings2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Your Professional Profile</h3>
            <p className="text-xs text-slate-500">Settings used to sign & custom-tailor outreach drafts</p>
          </div>
        </div>
        {!isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-250 hover:bg-slate-50 rounded-lg transition-all"
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setFormData({ ...profile });
                setIsEditing(false);
              }}
              className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-3 py-1.5 text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1"
            >
              Save Profile
            </button>
          </div>
        )}
      </div>

      {savedSuccess && (
        <div className="mb-4 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-850 text-xs rounded-lg flex items-center gap-1.5 transition-all font-medium font-medium">
          <Check className="w-4 h-4 text-emerald-600" /> Professional profile loaded and persistent in local context!
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" /> Full Name
            </label>
            <input
              type="text"
              required
              className="w-full bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg py-1.5 px-3 text-xs text-slate-800 outline-none shadow-inner"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" /> Agency or Brand Name
            </label>
            <input
              type="text"
              required
              className="w-full bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-505 rounded-lg py-1.5 px-3 text-xs text-slate-800 outline-none shadow-inner"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <Settings2 className="w-3.5 h-3.5 text-slate-400" /> Professional Title
            </label>
            <input
              type="text"
              required
              className="w-full bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-505 rounded-lg py-1.5 px-3 text-xs text-slate-800 outline-none shadow-inner"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" /> Email Address
            </label>
            <input
              type="email"
              required
              className="w-full bg-white border border-slate-250 focus:border-blue-505 focus:ring-1 focus:ring-blue-505 rounded-lg py-1.5 px-3 text-xs text-slate-800 outline-none shadow-inner"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone Number
            </label>
            <input
              type="text"
              className="w-full bg-white border border-slate-250 focus:border-blue-505 focus:ring-1 focus:ring-blue-505 rounded-lg py-1.5 px-3 text-xs text-slate-800 outline-none shadow-inner"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> Booking URL (e.g. Calendly)
            </label>
            <input
              type="text"
              placeholder="calendly.com/your-brand"
              className="w-full bg-white border border-slate-250 focus:border-blue-505 focus:ring-1 focus:ring-blue-505 rounded-lg py-1.5 px-3 text-xs text-slate-800 outline-none shadow-inner"
              value={formData.bookingLink}
              onChange={(e) => setFormData({ ...formData, bookingLink: e.target.value })}
            />
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs shadow-inner">
          <div className="space-y-0.5">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Consultant / Writer</p>
            <p className="font-bold text-slate-800">{profile.name}</p>
            <p className="text-[11px] text-slate-500">{profile.title}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Business / Brand</p>
            <p className="font-bold text-slate-800">{profile.company}</p>
            <p className="text-[11px] text-slate-500 flex items-center gap-1">
              <Globe className="w-3 h-3 text-slate-400" /> {profile.website || 'No website set'}
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Contact Channels</p>
            <p className="text-slate-700 font-semibold">{profile.email}</p>
            <p className="text-[11px] text-slate-500">{profile.phone || 'No phone set'}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Meeting Calendar Link</p>
            <p className="text-blue-600 font-bold truncate" title={profile.bookingLink}>
              {profile.bookingLink || 'Not configured'}
            </p>
            <p className="text-[11px] text-slate-450 font-medium">Appended to outreach calls</p>
          </div>
        </div>
      )}
    </div>
  );
}
