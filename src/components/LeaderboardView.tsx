import React, { useState, useEffect } from 'react';
import { LeaderboardEntry } from '../types/quiz';
import { CATEGORIES } from '../data/questions';
import { Trophy, Medal, Search, Flame, RefreshCw, Clock, CheckCircle } from 'lucide-react';

interface LeaderboardViewProps {
  entries: LeaderboardEntry[];
  onTakeQuizClick: () => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  entries,
  onTakeQuizClick,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [liveEntries, setLiveEntries] = useState<LeaderboardEntry[]>(entries);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setLiveEntries(entries);
  }, [entries]);

  // Simulate real-time activity feed every 30 seconds or on manual refresh
  const handleSimulateRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const filteredEntries = liveEntries.filter((entry) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      entry.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      entry.category === 'All Java Topics';

    const matchesSearch =
      entry.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.badge.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const top3 = filteredEntries.slice(0, 3);
  const restOfEntries = filteredEntries.slice(3);

  const formatSeconds = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s.toString().padStart(2, '0')}s`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Global Performance Standings</span>
            <span aria-hidden="true">·</span>
            <span>Live Sync Active</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-0.5 flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-amber-400" />
            <span>Real-Time Java Leaderboard</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Ranked by total score, accuracy percentage, and test completion duration.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSimulateRefresh}
            className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
            <span>Sync Live</span>
          </button>
          <button
            onClick={onTakeQuizClick}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-md"
          >
            Compete in Quiz
          </button>
        </div>
      </div>

      {/* Filter Bar & Search */}
      <div className="space-y-3">
        {/* Category Segmented Filter (Functional buttons per design guidelines) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search candidate or badge..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      {top3.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {top3.map((entry, idx) => {
            const rankColors = [
              { border: 'border-amber-500/60', text: 'text-amber-400', label: '1st Place' },
              { border: 'border-slate-400/60', text: 'text-slate-300', label: '2nd Place' },
              { border: 'border-amber-700/60', text: 'text-amber-600', label: '3rd Place' },
            ][idx];

            return (
              <div
                key={entry.id}
                className={`bg-slate-900 border ${rankColors.border} rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className={`font-mono font-bold uppercase tracking-wider ${rankColors.text}`}>
                      {rankColors.label}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">{entry.completedAt}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm text-amber-400">
                      {entry.userName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm leading-tight flex items-center gap-1.5">
                        <span>{entry.userName}</span>
                        {entry.isCurrentUser && (
                          <span className="text-[10px] text-amber-400 font-mono">(You)</span>
                        )}
                      </h4>
                      <span className="text-xs text-slate-400 block font-mono">{entry.badge}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Score</span>
                    <span className="text-lg font-black font-mono text-white tabular-nums">
                      {entry.score} <span className="text-xs text-slate-500 font-normal">pts</span>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Speed & Acc</span>
                    <span className="font-mono text-slate-300 tabular-nums">
                      {formatSeconds(entry.timeSeconds)} · {entry.accuracy}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Main Leaderboard Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="font-semibold text-slate-200">Rankings & Verification Record</div>
          <div className="font-mono">{filteredEntries.length} Candidates Recorded</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[11px] bg-slate-900/50">
                <th className="py-3 px-4 w-16">Rank</th>
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-4">Topic Category</th>
                <th className="py-3 px-4 text-right">Score</th>
                <th className="py-3 px-4 text-right">Accuracy</th>
                <th className="py-3 px-4 text-right">Time Taken</th>
                <th className="py-3 px-4 text-right">Completed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredEntries.map((entry, index) => {
                const rank = index + 1;
                return (
                  <tr
                    key={entry.id}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      entry.isCurrentUser ? 'bg-amber-500/5 font-medium' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-slate-400 tabular-nums">
                      {rank === 1 ? '🥇 1' : rank === 2 ? '🥈 2' : rank === 3 ? '🥉 3' : `#${rank}`}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{entry.userName}</span>
                        {entry.isCurrentUser && (
                          <span className="text-[10px] text-amber-400 font-mono bg-amber-500/10 px-1.5 py-0.5 rounded">
                            You
                          </span>
                        )}
                        <span className="text-slate-500 text-[11px] font-mono hidden sm:inline-block">
                          · {entry.badge}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-mono">{entry.category}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-amber-400 tabular-nums text-sm">
                      {entry.score}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-300 tabular-nums">
                      {entry.accuracy}%
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-300 tabular-nums">
                      {formatSeconds(entry.timeSeconds)}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-500 font-mono text-[11px]">
                      {entry.completedAt}
                    </td>
                  </tr>
                );
              })}

              {filteredEntries.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No leaderboard submissions match your current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
