import React, { useState } from 'react';
import { Question, UserAccount, SystemSettings, Category, Difficulty } from '../types/quiz';
import { CATEGORIES } from '../data/questions';
import { CodeSnippet } from './CodeSnippet';
import { 
  Users, 
  HelpCircle, 
  Settings, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Shield, 
  Save, 
  Download, 
  Upload, 
  Check, 
  AlertCircle,
  X
} from 'lucide-react';

interface AdminDashboardProps {
  questions: Question[];
  users: UserAccount[];
  settings: SystemSettings;
  onUpdateQuestions: (questions: Question[]) => void;
  onUpdateUsers: (users: UserAccount[]) => void;
  onUpdateSettings: (settings: SystemSettings) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  questions,
  users,
  settings,
  onUpdateQuestions,
  onUpdateUsers,
  onUpdateSettings,
}) => {
  const [adminTab, setAdminTab] = useState<'users' | 'questions' | 'settings'>('questions');

  // Question bank state
  const [questionSearch, setQuestionSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isCreatingQuestion, setIsCreatingQuestion] = useState(false);

  // User management state
  const [userSearch, setUserSearch] = useState('');
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'student' | 'instructor' | 'admin'>('student');

  // System settings state
  const [localSettings, setLocalSettings] = useState<SystemSettings>(settings);
  const [savedSettingsNotice, setSavedSettingsNotice] = useState(false);

  // Filtered questions
  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(questionSearch.toLowerCase()) ||
      q.questionText.toLowerCase().includes(questionSearch.toLowerCase()) ||
      q.tags.some((t) => t.toLowerCase().includes(questionSearch.toLowerCase()));
    const matchesCat = categoryFilter === 'All' || q.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  // Filtered users
  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  // Question CRUD handlers
  const handleSaveQuestion = (q: Question) => {
    if (editingQuestion) {
      // update
      const updated = questions.map((item) => (item.id === q.id ? q : item));
      onUpdateQuestions(updated);
      setEditingQuestion(null);
    } else {
      // create
      const newQ = { ...q, id: 'q-' + Date.now() };
      onUpdateQuestions([newQ, ...questions]);
      setIsCreatingQuestion(false);
    }
  };

  const handleDeleteQuestion = (id: string) => {
    if (window.confirm('Are you sure you want to delete this question from the question bank?')) {
      onUpdateQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const handleExportQuestions = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(questions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'javamaster-question-bank.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportQuestions = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed) && parsed.length > 0) {
            onUpdateQuestions(parsed);
            alert(`Successfully imported ${parsed.length} questions into the bank!`);
          }
        } catch (err) {
          alert('Failed to parse question JSON file.');
        }
      };
    }
  };

  // User CRUD handlers
  const handleToggleUserStatus = (userId: string) => {
    const updated = users.map((u) =>
      u.id === userId ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } as UserAccount : u
    );
    onUpdateUsers(updated);
  };

  const handleChangeUserRole = (userId: string, role: 'student' | 'instructor' | 'admin') => {
    const updated = users.map((u) => (u.id === userId ? { ...u, role } : u));
    onUpdateUsers(updated);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    const newUser: UserAccount = {
      id: 'user-' + Date.now(),
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      role: newUserRole,
      joinedDate: new Date().toISOString().split('T')[0],
      quizzesTaken: 0,
      averageScore: 0,
      status: 'active',
    };

    onUpdateUsers([...users, newUser]);
    setNewUserName('');
    setNewUserEmail('');
    setIsCreatingUser(false);
  };

  // Settings Save
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(localSettings);
    setSavedSettingsNotice(true);
    setTimeout(() => setSavedSettingsNotice(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Administrative Governance</span>
            <span aria-hidden="true">·</span>
            <span>Role: System Administrator</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-0.5 flex items-center gap-2.5">
            <Shield className="w-6 h-6 text-amber-400" />
            <span>Administrator Control Center</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Oversee user accounts, curate Java question repository, and configure examination settings.
          </p>
        </div>

        {/* Sub-tab switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
          <button
            onClick={() => setAdminTab('questions')}
            className={`px-3.5 py-1.5 rounded-md font-medium transition-colors flex items-center gap-2 cursor-pointer ${
              adminTab === 'questions' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Question Bank ({questions.length})</span>
          </button>
          <button
            onClick={() => setAdminTab('users')}
            className={`px-3.5 py-1.5 rounded-md font-medium transition-colors flex items-center gap-2 cursor-pointer ${
              adminTab === 'users' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>User Accounts ({users.length})</span>
          </button>
          <button
            onClick={() => setAdminTab('settings')}
            className={`px-3.5 py-1.5 rounded-md font-medium transition-colors flex items-center gap-2 cursor-pointer ${
              adminTab === 'settings' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>System Settings</span>
          </button>
        </div>
      </div>

      {/* 1. QUESTION BANK TAB */}
      {adminTab === 'questions' && (
        <div className="space-y-6">
          {/* Action and Filter Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 max-w-xl">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter by title, tags, or content..."
                  value={questionSearch}
                  onChange={(e) => setQuestionSearch(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-slate-400" />
                <span>Import JSON</span>
                <input type="file" accept=".json" onChange={handleImportQuestions} className="hidden" />
              </label>

              <button
                onClick={handleExportQuestions}
                className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>Export JSON</span>
              </button>

              <button
                onClick={() => {
                  setEditingQuestion(null);
                  setIsCreatingQuestion(true);
                }}
                className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Question</span>
              </button>
            </div>
          </div>

          {/* Question List */}
          <div className="grid grid-cols-1 gap-4">
            {filteredQuestions.map((q) => (
              <div
                key={q.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
                      <span className="text-amber-400 font-semibold">{q.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-slate-300">{q.difficulty}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-slate-400">{q.points} Marks</span>
                      {q.tags.map((t) => (
                        <React.Fragment key={t}>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono text-slate-500">{t}</span>
                        </React.Fragment>
                      ))}
                    </div>
                    <h3 className="text-base font-bold text-white">{q.title}</h3>
                    <p className="text-xs text-slate-300 line-clamp-2">{q.questionText}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setEditingQuestion(q);
                        setIsCreatingQuestion(true);
                      }}
                      className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
                      title="Edit question"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Delete question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {q.codeSnippet && (
                  <div className="mt-3">
                    <CodeSnippet code={q.codeSnippet} language="java" filename={`${q.id}.java`} />
                  </div>
                )}

                {/* Options overview */}
                <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {q.options.map((opt, i) => (
                    <div
                      key={i}
                      className={`p-2 rounded border font-mono ${
                        i === q.correctOptionIndex
                          ? 'border-emerald-600/60 bg-emerald-950/20 text-emerald-300 font-semibold'
                          : 'border-slate-800 bg-slate-950/40 text-slate-400'
                      }`}
                    >
                      <span className="font-bold mr-1.5">{String.fromCharCode(65 + i)}.</span>
                      <span>{opt}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {filteredQuestions.length === 0 && (
              <div className="text-center py-12 text-slate-500 bg-slate-900 border border-slate-800 rounded-xl">
                No questions found matching your filter. Click "Add Question" to create one.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. USER ACCOUNTS MANAGEMENT TAB */}
      {adminTab === 'users' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative max-w-sm flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search user name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              onClick={() => setIsCreatingUser(true)}
              className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register User</span>
            </button>
          </div>

          {/* User Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[11px] bg-slate-950/60">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Registration</th>
                    <th className="py-3 px-4 text-right">Quizzes Taken</th>
                    <th className="py-3 px-4 text-right">Avg Score</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-sans">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{user.name}</div>
                        <div className="text-slate-400 font-mono text-[11px]">{user.email}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={user.role}
                          onChange={(e) =>
                            handleChangeUserRole(user.id, e.target.value as 'student' | 'instructor' | 'admin')
                          }
                          className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 capitalize cursor-pointer focus:outline-none focus:border-amber-500"
                        >
                          <option value="student">Student</option>
                          <option value="instructor">Instructor</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-400">{user.joinedDate}</td>
                      <td className="py-3.5 px-4 text-right font-mono text-slate-300 tabular-nums">
                        {user.quizzesTaken}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-amber-400 font-bold tabular-nums">
                        {user.averageScore}%
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-mono capitalize ${
                            user.status === 'active'
                              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                              : 'bg-rose-950/80 text-rose-300 border border-rose-800'
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleToggleUserStatus(user.id)}
                          className={`text-xs px-2.5 py-1 rounded border transition-colors cursor-pointer ${
                            user.status === 'active'
                              ? 'border-rose-900/60 text-rose-400 hover:bg-rose-950/40'
                              : 'border-emerald-900/60 text-emerald-400 hover:bg-emerald-950/40'
                          }`}
                        >
                          {user.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. SYSTEM SETTINGS TAB */}
      {adminTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="space-y-6 max-w-3xl">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              Quiz Examination Policies & Engine Parameters
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Default Quiz Duration (Minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={localSettings.defaultQuizDurationMinutes}
                  onChange={(e) =>
                    setLocalSettings({ ...localSettings, defaultQuizDurationMinutes: parseInt(e.target.value) || 10 })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
                <span className="text-[11px] text-slate-500">Duration allocated when test commences.</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Pass Percentage Threshold (%)
                </label>
                <input
                  type="number"
                  min="30"
                  max="100"
                  value={localSettings.passPercentageThreshold}
                  onChange={(e) =>
                    setLocalSettings({ ...localSettings, passPercentageThreshold: parseInt(e.target.value) || 70 })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
                <span className="text-[11px] text-slate-500">Minimum score required for certification.</span>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-800">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.autoSubmitOnTimeUp}
                  onChange={(e) => setLocalSettings({ ...localSettings, autoSubmitOnTimeUp: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-slate-950 border-slate-800"
                />
                <div>
                  <span className="text-xs font-medium text-slate-200 block">
                    Auto-Submit on Timer Expiration
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Automatically submit completed answers when remaining time drops to 00:00.
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.randomizeQuestions}
                  onChange={(e) => setLocalSettings({ ...localSettings, randomizeQuestions: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-slate-950 border-slate-800"
                />
                <div>
                  <span className="text-xs font-medium text-slate-200 block">
                    Randomize Question Sequence
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Shuffle question order per session to preserve assessment integrity.
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.penaltyForWrongAnswer}
                  onChange={(e) => setLocalSettings({ ...localSettings, penaltyForWrongAnswer: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-slate-950 border-slate-800"
                />
                <div>
                  <span className="text-xs font-medium text-slate-200 block">
                    Negative Marking Penalty (25%)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Deduct 2.5 marks for incorrect answers according to competitive rubric.
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.academicRubricEnabled}
                  onChange={(e) => setLocalSettings({ ...localSettings, academicRubricEnabled: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-slate-950 border-slate-800"
                />
                <div>
                  <span className="text-xs font-medium text-slate-200 block">
                    Enable Academic Project Rubric Blueprint
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Display student review rubric mapping and Java architecture breakdown.
                  </span>
                </div>
              </label>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2">
                {savedSettingsNotice && (
                  <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                    <Check className="w-3.5 h-3.5" />
                    <span>Configuration successfully saved to storage!</span>
                  </span>
                )}
              </div>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>Save System Settings</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Question Create/Edit Modal */}
      {isCreatingQuestion && (
        <QuestionEditorModal
          initialQuestion={editingQuestion}
          onSave={handleSaveQuestion}
          onClose={() => {
            setIsCreatingQuestion(false);
            setEditingQuestion(null);
          }}
        />
      )}

      {/* User Create Modal */}
      {isCreatingUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAddUser}
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Register New User Account</h3>
              <button
                type="button"
                onClick={() => setIsCreatingUser(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                placeholder="e.g. ramesh@college.edu"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">System Role</label>
              <select
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value as 'student' | 'instructor' | 'admin')}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="student">Student / Test Taker</option>
                <option value="instructor">Instructor / Evaluator</option>
                <option value="admin">System Administrator</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setIsCreatingUser(false)}
                className="px-3.5 py-2 rounded-lg border border-slate-800 text-xs text-slate-300 hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer shadow-md"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

// Sub-component for Question Form Modal
interface QuestionEditorModalProps {
  initialQuestion: Question | null;
  onSave: (q: Question) => void;
  onClose: () => void;
}

const QuestionEditorModal: React.FC<QuestionEditorModalProps> = ({
  initialQuestion,
  onSave,
  onClose,
}) => {
  const [title, setTitle] = useState(initialQuestion?.title || '');
  const [questionText, setQuestionText] = useState(initialQuestion?.questionText || '');
  const [codeSnippet, setCodeSnippet] = useState(initialQuestion?.codeSnippet || '');
  const [category, setCategory] = useState<Category>(initialQuestion?.category || 'Core OOP');
  const [difficulty, setDifficulty] = useState<Difficulty>(initialQuestion?.difficulty || 'Intermediate');
  const [points, setPoints] = useState(initialQuestion?.points || 10);
  const [tagsInput, setTagsInput] = useState(initialQuestion?.tags.join(', ') || '#Java, #OOP');
  const [explanation, setExplanation] = useState(initialQuestion?.explanation || '');
  const [options, setOptions] = useState<string[]>(
    initialQuestion?.options || ['', '', '', '']
  );
  const [correctOptionIndex, setCorrectOptionIndex] = useState(
    initialQuestion?.correctOptionIndex ?? 0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !questionText.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
      .map((t) => (t.startsWith('#') ? t : `#${t}`));

    const q: Question = {
      id: initialQuestion?.id || 'q-' + Date.now(),
      title: title.trim(),
      questionText: questionText.trim(),
      codeSnippet: codeSnippet.trim() ? codeSnippet.trim() : undefined,
      category,
      difficulty,
      points,
      tags,
      explanation: explanation.trim() || 'Refer to the Java language specification.',
      options,
      correctOptionIndex,
    };

    onSave(q);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl my-8 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-bold text-white text-base">
            {initialQuestion ? 'Edit Java Question' : 'Create New Java Question'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Question Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Diamond Problem in Multiple Interface Inheritance"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Points / Marks</label>
              <input
                type="number"
                min="1"
                max="50"
                value={points}
                onChange={(e) => setPoints(parseInt(e.target.value) || 10)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Question Narrative / Prompt</label>
            <textarea
              rows={3}
              required
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Describe the problem, execution behavior, or output prediction..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500 font-sans"
            ></textarea>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Java Code Snippet (Optional)</label>
            <textarea
              rows={4}
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              placeholder="public class Test { public static void main(String[] args) { ... } }"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-amber-300 font-mono focus:outline-none focus:border-amber-500"
            ></textarea>
          </div>

          {/* Options */}
          <div className="space-y-2">
            <label className="block text-slate-300 font-medium">
              Options (Choose radio for the correct answer):
            </label>
            {options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="correctOption"
                  checked={correctOptionIndex === i}
                  onChange={() => setCorrectOptionIndex(i)}
                  className="w-4 h-4 text-emerald-500 bg-slate-950 border-slate-800 cursor-pointer"
                />
                <span className="font-mono text-slate-400 w-5">{String.fromCharCode(65 + i)}.</span>
                <input
                  type="text"
                  required
                  value={opt}
                  onChange={(e) => {
                    const next = [...options];
                    next[i] = e.target.value;
                    setOptions(next);
                  }}
                  placeholder={`Option ${String.fromCharCode(65 + i)}`}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Topic Tags (comma-separated)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="#Polymorphism, #Inheritance, #Interfaces"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Detailed Explanation & JLS Rationale</label>
            <textarea
              rows={2}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Explain why the option is correct, how JVM executes it, and common student misconceptions..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500 font-sans"
            ></textarea>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-800 text-slate-300 hover:bg-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold cursor-pointer shadow-md"
            >
              Save Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
