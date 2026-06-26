/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Layers, ChevronRight, Plus, Trash2, Calendar, FileText, CheckSquare, Sparkles, MessageSquare, ArrowLeftRight } from 'lucide-react';
import { Lead, CRMStage, LeadStatus, CRMNote, CRMTask } from '../types';

interface CRMKanbanTabProps {
  leads: Lead[];
  onUpdateLeadStage: (leadId: string, stage: CRMStage, status: LeadStatus) => void;
  onAddNote: (leadId: string, note: CRMNote) => void;
  onAddTask: (leadId: string, task: CRMTask) => void;
  onToggleTask: (leadId: string, taskId: string) => void;
  isDark: boolean;
}

const CRM_STAGES: CRMStage[] = ['New Lead', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];

const STAGE_STATUS_MAP: { [key in CRMStage]: LeadStatus } = {
  'New Lead': 'New',
  'Contacted': 'Outreached',
  'Qualified': 'Interested',
  'Proposal Sent': 'Interested',
  'Won': 'Closed',
  'Lost': 'Closed'
};

export default function CRMKanbanTab({
  leads,
  onUpdateLeadStage,
  onAddNote,
  onAddTask,
  onToggleTask,
  isDark
}: CRMKanbanTabProps) {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const [taskTitle, setTaskTitle] = useState('');

  const handleStageChange = (leadId: string, stage: CRMStage) => {
    const status = STAGE_STATUS_MAP[stage];
    onUpdateLeadStage(leadId, stage, status);
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead(prev => prev ? { ...prev, crmStage: stage, status } : null);
    }
  };

  const handleAddNoteSubmit = (e: React.FormEvent, leadId: string) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    const newNote: CRMNote = {
      id: `note-${Date.now()}`,
      content: noteContent,
      createdAt: new Date().toISOString(),
      author: 'Workspace CRM'
    };

    onAddNote(leadId, newNote);
    setNoteContent('');
    
    // Update local modal state
    if (selectedLead) {
      setSelectedLead(prev => prev ? { ...prev, notes: [...(prev.notes || []), newNote] } : null);
    }
  };

  const handleAddTaskSubmit = (e: React.FormEvent, leadId: string) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const newTask: CRMTask = {
      id: `task-${Date.now()}`,
      title: taskTitle,
      dueDate: new Date(Date.now() + 24 * 3600 * 1000).toISOString().split('T')[0], // tomorrow
      completed: false
    };

    onAddTask(leadId, newTask);
    setTaskTitle('');

    if (selectedLead) {
      setSelectedLead(prev => prev ? { ...prev, tasks: [...(prev.tasks || []), newTask] } : null);
    }
  };

  const handleTaskToggleClick = (leadId: string, taskId: string) => {
    onToggleTask(leadId, taskId);
    if (selectedLead) {
      setSelectedLead(prev => {
        if (!prev) return null;
        const updatedTasks = (prev.tasks || []).map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
        return { ...prev, tasks: updatedTasks };
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div>
        <h3 className={`text-sm font-bold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <Layers className="w-4.5 h-4.5 text-blue-500" /> LeadGenius SaaS CRM Kanban Pipeline
        </h3>
        <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Track deal negotiations across high-converting stages. Drag-and-drop simulated via drop-down handlers. Manage customer tasks and log interactions.
        </p>
      </div>

      {/* Kanban Grid Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
        {CRM_STAGES.map((stage) => {
          const stageLeads = leads.filter(l => l.crmStage === stage);

          return (
            <div
              key={stage}
              className={`p-3 rounded-xl border flex flex-col h-[520px] shrink-0 min-w-[210px] ${
                isDark ? 'bg-slate-950 border-slate-900' : 'bg-slate-50 border-slate-150'
              }`}
            >
              {/* Column header */}
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-200 dark:border-slate-900">
                <span className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {stage}
                </span>
                <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${
                  isDark ? 'bg-slate-900 text-slate-400' : 'bg-white text-slate-500'
                }`}>
                  {stageLeads.length}
                </span>
              </div>

              {/* Card List */}
              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {stageLeads.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className={`p-3 rounded-lg border shadow-sm cursor-pointer hover:border-blue-500 transition-all ${
                      isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                    }`}
                  >
                    <span className="text-[8px] px-1.5 py-0.5 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold rounded block w-max">
                      {lead.industry}
                    </span>
                    <h5 className={`text-xs font-bold mt-1.5 truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {lead.businessName}
                    </h5>
                    
                    <div className="flex justify-between items-center mt-3 text-[9px] text-slate-400">
                      <span>Score: {lead.websiteScore}/10</span>
                      <span className="font-semibold text-emerald-500">{lead.budgetPotential.split(' ')[0]}</span>
                    </div>

                    {/* Stage selector inside card for fast transfers */}
                    <div className="mt-3.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1">
                      <ArrowLeftRight className="w-3 h-3 text-slate-400 shrink-0" />
                      <select
                        onClick={(e) => e.stopPropagation()} // don't open modal on select click
                        value={lead.crmStage}
                        onChange={(e) => handleStageChange(lead.id, e.target.value as CRMStage)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 text-[9px] rounded p-0.5 text-slate-500 outline-none"
                      >
                        {CRM_STAGES.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}

                {stageLeads.length === 0 && (
                  <div className="text-center py-12 text-slate-400 dark:text-slate-600 text-[10px]">
                    Empty stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CRM Interaction Detail Overlay Drawer modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-2xl rounded-2xl border shadow-xl flex flex-col max-h-[90vh] overflow-hidden ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            {/* Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div>
                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[9px] font-bold rounded">
                  {selectedLead.industry}
                </span>
                <h4 className={`text-sm font-black mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {selectedLead.businessName} — Lead Card
                </h4>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Close
              </button>
            </div>

            {/* Content body scroll */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Stages transfer row */}
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 flex justify-between items-center text-xs">
                <span className="font-bold text-slate-500 uppercase text-[10px]">Sales Deal Pipeline Stage:</span>
                <select
                  value={selectedLead.crmStage}
                  onChange={(e) => handleStageChange(selectedLead.id, e.target.value as CRMStage)}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded p-1 text-xs outline-none font-bold text-blue-600"
                >
                  {CRM_STAGES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Tasks manager & notes manager */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tasks Module */}
                <div className="space-y-4">
                  <span className="flex items-center gap-1.5 text-[10px] uppercase font-black text-slate-400 tracking-wide">
                    <CheckSquare className="w-3.5 h-3.5 text-blue-500" /> CRM Action Checklist
                  </span>
                  
                  {/* Task builder form */}
                  <form onSubmit={(e) => handleAddTaskSubmit(e, selectedLead.id)} className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Schedule redesign zoom preview"
                      className={`flex-1 py-1 px-2.5 rounded border text-xs outline-none ${
                        isDark ? 'bg-slate-950 border-slate-850 text-white' : 'bg-white border-slate-200 text-slate-800'
                      }`}
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="px-3 py-1 bg-blue-600 text-white font-bold text-xs rounded shadow"
                    >
                      Add
                    </button>
                  </form>

                  {/* Tasks List */}
                  <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                    {(selectedLead.tasks || []).map((t) => (
                      <div
                        key={t.id}
                        onClick={() => handleTaskToggleClick(selectedLead.id, t.id)}
                        className={`p-2 rounded border text-xs flex gap-2.5 items-center cursor-pointer ${
                          t.completed 
                            ? 'bg-slate-50/50 dark:bg-slate-950/20 text-slate-400 line-through border-slate-100 dark:border-slate-900'
                            : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-150 dark:border-slate-850'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={t.completed}
                          readOnly
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="flex-1 truncate font-medium">{t.title}</span>
                      </div>
                    ))}
                    {(selectedLead.tasks || []).length === 0 && (
                      <p className="text-[10px] text-slate-400 dark:text-slate-600">No active tasks scheduled.</p>
                    )}
                  </div>
                </div>

                {/* Notes Module */}
                <div className="space-y-4">
                  <span className="flex items-center gap-1.5 text-[10px] uppercase font-black text-slate-400 tracking-wide">
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-500" /> Log Interactions / Notes
                  </span>

                  {/* Note builder form */}
                  <form onSubmit={(e) => handleAddNoteSubmit(e, selectedLead.id)} className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Spoke with Sarah; requested mockup"
                      className={`flex-1 py-1 px-2.5 rounded border text-xs outline-none ${
                        isDark ? 'bg-slate-950 border-slate-850 text-white' : 'bg-white border-slate-200 text-slate-800'
                      }`}
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="px-3 py-1 bg-indigo-600 text-white font-bold text-xs rounded shadow"
                    >
                      Log
                    </button>
                  </form>

                  {/* Notes List */}
                  <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                    {(selectedLead.notes || []).map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-lg border text-[11px] ${
                          isDark ? 'bg-slate-950 border-slate-850 text-slate-300' : 'bg-slate-50 border-slate-150 text-slate-700'
                        }`}
                      >
                        <p className="font-semibold text-slate-900 dark:text-slate-100">{n.content}</p>
                        <p className="text-[9px] text-slate-400 mt-1">
                          Log by {n.author} • {new Date(n.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                    {(selectedLead.notes || []).length === 0 && (
                      <p className="text-[10px] text-slate-400 dark:text-slate-600">No recorded notes yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
