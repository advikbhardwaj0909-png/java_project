import React, { useState } from 'react';
import { RUBRIC_DATA, SQL_SCHEMA_DDL } from '../data/architectureBlueprint';
import { CodeSnippet } from './CodeSnippet';
import { 
  Award, 
  Database, 
  Layers, 
  Cpu, 
  FileCode, 
  CheckCircle2, 
  ExternalLink,
  Github,
  BookOpen,
  Calendar,
  X
} from 'lucide-react';

interface ProjectRubricModalProps {
  onClose?: () => void;
}

export const ProjectRubricModal: React.FC<ProjectRubricModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'rubric' | 'dao' | 'schema' | 'threads'>('rubric');
  const [selectedRubricId, setSelectedRubricId] = useState<string>(RUBRIC_DATA[0].id);

  const selectedItem = RUBRIC_DATA.find((r) => r.id === selectedRubricId) || RUBRIC_DATA[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner / Review Guidelines alignment */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 relative">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-mono">
              <Award className="w-3.5 h-3.5" />
              <span>Academic Evaluation Specification</span>
              <span aria-hidden="true">·</span>
              <span>Java Project Review</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
              Project Architecture & Marking Rubric Explorer
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Full mapping to course review guidelines: OOP architecture, Collections & Generics, Multithreading & Synchronization, Database design, JDBC connectivity, and Web/Servlet integration.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-xs font-mono text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Review Timeline: Sep 05 - Oct 15</span>
            </div>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex items-center gap-2 pt-4 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('rubric')}
            className={`px-3.5 py-2 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'rubric'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Marking Rubrics (GUI & Web)</span>
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3.5 py-2 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'schema'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Relational DB Schema (DDL)</span>
          </button>
          <button
            onClick={() => setActiveTab('dao')}
            className={`px-3.5 py-2 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'dao'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>JDBC & DAO Classes</span>
          </button>
          <button
            onClick={() => setActiveTab('threads')}
            className={`px-3.5 py-2 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'threads'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Multithreading & Concurrency</span>
          </button>
        </div>
      </div>

      {/* TAB 1: MARKING RUBRIC DETAILS */}
      {activeTab === 'rubric' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Rubric Category List */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider font-mono">
              Course Evaluation Modules
            </h3>
            {RUBRIC_DATA.map((item) => {
              const isSelected = item.id === selectedRubricId;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedRubricId(item.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500 text-white ring-1 ring-amber-500/50'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono text-slate-500 text-[11px]">{item.category}</span>
                    <span className="font-mono font-bold text-amber-400">{item.marks} Marks</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white leading-snug">{item.title}</h4>
                </button>
              );
            })}
          </div>

          {/* Detailed Selected Rubric & Code Blueprint */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                  {selectedItem.category} · Weightage
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/40">
                  {selectedItem.marks} Marks Allocated
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mt-2">{selectedItem.title}</h2>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">{selectedItem.description}</p>
            </div>

            {/* Implementation Highlights */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                Key Technical Artifacts in This Platform:
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {selectedItem.implementationHighlights.map((hl, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Java Code Sample */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-2">
                Production-Grade Java Reference Implementation:
              </h4>
              <CodeSnippet
                code={selectedItem.javaCodeSample}
                language="java"
                filename={`${selectedItem.id.toUpperCase()}.java`}
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DATABASE SCHEMA (DDL) */}
      {activeTab === 'schema' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white">Relational Database Design & Connectivity</h2>
              <p className="text-xs text-slate-300 mt-1">
                Normalized relational tables for Users, Questions, Attempts, and Leaderboard snapshots. Compatible with MySQL, PostgreSQL, and H2 in-memory databases with foreign keys, constraints, and performance indexes.
              </p>
            </div>

            <CodeSnippet code={SQL_SCHEMA_DDL} language="sql" filename="schema_ddl.sql" />
          </div>
        </div>
      )}

      {/* TAB 3: JDBC DAO CLASSES */}
      {activeTab === 'dao' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white">Database Operations (DAO Architecture & JDBC)</h2>
              <p className="text-xs text-slate-300 mt-1">
                Clean separation of concerns using Data Access Objects, HikariCP Connection Pooling, PreparedStatement SQL injection mitigation, and atomic multi-query commit/rollback logic.
              </p>
            </div>

            <CodeSnippet
              code={`// Full DAO implementation for JDBC operations
package com.javamaster.dao;

import java.sql.*;
import java.util.*;
import javax.sql.DataSource;

public class QuestionDAOImpl implements IQuestionDAO {
    private final DataSource dataSource;

    public QuestionDAOImpl(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public List<Question> findByCategory(String category) throws SQLException {
        String sql = "SELECT * FROM questions WHERE category = ? ORDER BY id ASC";
        List<Question> list = new ArrayList<>();

        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setString(1, category);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Question q = new Question();
                    q.setId(rs.getString("question_id"));
                    q.setTitle(rs.getString("title"));
                    q.setQuestionText(rs.getString("question_text"));
                    q.setCodeSnippet(rs.getString("code_snippet"));
                    q.setCategory(rs.getString("category"));
                    q.setDifficulty(rs.getString("difficulty"));
                    q.setPoints(rs.getInt("points"));
                    q.setCorrectOptionIndex(rs.getInt("correct_option_index"));
                    q.setExplanation(rs.getString("explanation"));
                    list.add(q);
                }
            }
        }
        return list;
    }

    @Override
    public boolean saveResultTransactional(QuizSession session) throws SQLException {
        String sqlAttempt = "INSERT INTO quiz_attempts (attempt_id, user_id, score, max_score, accuracy_pct, time_taken_seconds) VALUES (?, ?, ?, ?, ?, ?)";
        String sqlLeaderboard = "INSERT INTO leaderboard_snapshots (entry_id, user_id, user_name, score, time_seconds, badge) VALUES (?, ?, ?, ?, ?, ?)";

        try (Connection conn = dataSource.getConnection()) {
            conn.setAutoCommit(false); // Begin ACID Transaction
            try (PreparedStatement ps1 = conn.prepareStatement(sqlAttempt);
                 PreparedStatement ps2 = conn.prepareStatement(sqlLeaderboard)) {
                
                // 1. Insert attempt
                ps1.setString(1, session.getId());
                ps1.setString(2, session.getUserId());
                ps1.setDouble(3, session.getScore());
                ps1.setInt(4, session.getMaxScore());
                ps1.setDouble(5, session.getAccuracyPercentage());
                ps1.setInt(6, 300);
                ps1.executeUpdate();

                // 2. Insert leaderboard entry
                ps2.setString(1, "lb-" + System.currentTimeMillis());
                ps2.setString(2, session.getUserId());
                ps2.setString(3, session.getUserName());
                ps2.setDouble(4, session.getScore());
                ps2.setInt(5, 300);
                ps2.setString(6, "Java Virtuoso");
                ps2.executeUpdate();

                conn.commit(); // Commit transaction atomically
                return true;
            } catch (SQLException ex) {
                conn.rollback(); // Rollback on failure
                throw ex;
            } finally {
                conn.setAutoCommit(true);
            }
        }
    }
}`}
              language="java"
              filename="QuestionDAOImpl.java"
            />
          </div>
        </div>
      )}

      {/* TAB 4: MULTITHREADING ARCHITECTURE */}
      {activeTab === 'threads' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white">Multithreading & Synchronization Engine</h2>
              <p className="text-xs text-slate-300 mt-1">
                Addresses rubric requirements for thread safety, ScheduledExecutorService countdown timers, ConcurrentHashMap session cache, and synchronized/ReentrantLock ranking updates.
              </p>
            </div>

            <CodeSnippet
              code={`package com.javamaster.concurrency;

import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.locks.ReentrantReadWriteLock;
import java.util.*;

public class ConcurrentQuizManager {
    // Thread-safe session cache using lock-free ConcurrentHashMap
    private final ConcurrentMap<String, QuizSession> activeSessions = new ConcurrentHashMap<>();
    
    // Read-Write lock for leaderboard updates (O(1) concurrent reads, serialized writes)
    private final ReentrantReadWriteLock rwLock = new ReentrantReadWriteLock();
    private final List<LeaderboardEntry> leaderboard = new ArrayList<>();

    // Multi-threaded countdown timer scheduler
    private final ScheduledExecutorService timerService = 
        Executors.newScheduledThreadPool(Runtime.getRuntime().availableProcessors());

    public void startSessionTimer(String sessionId, int durationSeconds, Runnable onExpireCallback) {
        AtomicInteger remaining = new AtomicInteger(durationSeconds);
        
        timerService.scheduleAtFixedRate(() -> {
            int current = remaining.decrementAndGet();
            if (current <= 0) {
                onExpireCallback.run(); // Triggers auto-submit
            }
        }, 0, 1, TimeUnit.SECONDS);
    }

    public void updateLeaderboard(LeaderboardEntry newEntry) {
        rwLock.writeLock().lock();
        try {
            leaderboard.add(newEntry);
            leaderboard.sort((a, b) -> Double.compare(b.getScore(), a.getScore()));
        } finally {
            rwLock.writeLock().unlock();
        }
    }

    public List<LeaderboardEntry> getLeaderboardSnapshot() {
        rwLock.readLock().lock();
        try {
            return Collections.unmodifiableList(new ArrayList<>(leaderboard));
        } finally {
            rwLock.readLock().unlock();
        }
    }
}`}
              language="java"
              filename="ConcurrentQuizManager.java"
            />
          </div>
        </div>
      )}
    </div>
  );
};
