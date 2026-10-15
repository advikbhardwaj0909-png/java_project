export interface RubricItem {
  id: string;
  category: 'GUI Rubric' | 'Web Rubric';
  title: string;
  marks: number;
  description: string;
  implementationHighlights: string[];
  javaCodeSample: string;
}

export const RUBRIC_DATA: RubricItem[] = [
  {
    id: 'rubric-oop',
    category: 'GUI Rubric',
    title: 'OOP Implementation (Polymorphism, Inheritance, ExceptionHandling, Interfaces)',
    marks: 10,
    description: 'Comprehensive object-oriented design using interface contracts (QuizService, Evaluator), abstract base classes (AbstractAssessment), inheritance hierarchies, dynamic dispatch, and custom typed exceptions.',
    implementationHighlights: [
      'Interfaces: IQuizService, IQuestionRepository, IScoringStrategy',
      'Inheritance: TimedJavaQuiz extends AbstractAssessment implements Schedulable',
      'Polymorphism: Strategy pattern for scoring algorithms (StandardScoring, PenaltyScoring)',
      'Custom Exceptions: QuizTimeExpiredException, InvalidQuestionFormatException, DatabaseConnectionException'
    ],
    javaCodeSample: `// Interface contract for polymorphism
public interface IScoringEngine {
    EvaluationResult evaluate(QuizSession session, List<Question> answerKey);
}

// Concrete Strategy implementing penalty-based scoring
public class PenaltyScoringStrategy implements IScoringEngine {
    private final double penaltyRate = 0.25;

    @Override
    public EvaluationResult evaluate(QuizSession session, List<Question> answerKey) {
        double totalScore = 0;
        int correctCount = 0;
        
        for (Question q : answerKey) {
            Integer userChoice = session.getUserAnswers().get(q.getId());
            if (userChoice != null) {
                if (userChoice == q.getCorrectOptionIndex()) {
                    totalScore += q.getPoints();
                    correctCount++;
                } else {
                    totalScore -= (q.getPoints() * penaltyRate);
                }
            }
        }
        return new EvaluationResult(Math.max(0, totalScore), correctCount);
    }
}`
  },
  {
    id: 'rubric-collections',
    category: 'GUI Rubric',
    title: 'Collections & Generics',
    marks: 6,
    description: 'Use of generic collections (List<T>, Map<K,V>, ConcurrentHashMap<K,V>, PriorityQueue<T>) with type safety, custom Comparators, and wildcard bounds.',
    implementationHighlights: [
      'ConcurrentHashMap<String, QuizSession> for lock-free active user session tracking',
      'PriorityQueue<LeaderboardEntry> using custom Comparator for O(log k) real-time rankings',
      'Generic Repository interface: IRepository<T, ID> with bounded wildcards <? extends T>'
    ],
    javaCodeSample: `// Generic thread-safe session cache with Collections
public class QuizSessionCache<T extends Identifiable<String>> {
    private final ConcurrentMap<String, T> activeSessions = new ConcurrentHashMap<>();

    public void storeSession(T session) {
        activeSessions.put(session.getId(), session);
    }

    public Optional<T> getSession(String id) {
        return Optional.ofNullable(activeSessions.get(id));
    }

    public List<T> getSortedBy(Comparator<? super T> comparator) {
        return activeSessions.values().stream()
            .sorted(comparator)
            .collect(Collectors.toUnmodifiableList());
    }
}`
  },
  {
    id: 'rubric-threads',
    category: 'GUI Rubric',
    title: 'Multithreading & Synchronization',
    marks: 4,
    description: 'Background countdown timers using ScheduledExecutorService, thread-safe score submission with ReentrantReadWriteLock, and concurrent leaderboard updates.',
    implementationHighlights: [
      'ScheduledExecutorService timer heartbeat for precision second-by-second countdown',
      'AtomicInteger for thread-safe concurrent submission tallies',
      'ReentrantLock / synchronized blocks guarding shared leaderboard leader updates'
    ],
    javaCodeSample: `public class QuizTimerService {
    private final ScheduledExecutorService scheduler = 
        Executors.newScheduledThreadPool(Runtime.getRuntime().availableProcessors());
    
    public ScheduledFuture<?> startCountdown(String sessionId, int durationSeconds, Consumer<Integer> tickListener) {
        AtomicInteger remaining = new AtomicInteger(durationSeconds);
        
        return scheduler.scheduleAtFixedRate(() -> {
            int current = remaining.decrementAndGet();
            tickListener.accept(current);
            if (current <= 0) {
                // Auto-submit session asynchronously
                throw new QuizTimeExpiredException("Session timed out: " + sessionId);
            }
        }, 0, 1, TimeUnit.SECONDS);
    }
}`
  },
  {
    id: 'rubric-db-classes',
    category: 'GUI Rubric',
    title: 'Classes for Database Operations (DAO Pattern)',
    marks: 7,
    description: 'Data Access Object (DAO) architecture separating business logic from persistence. Prepared statements, connection pooling, and entity mappers.',
    implementationHighlights: [
      'QuestionDAO: CRUD operations, category filtering with parameterized queries',
      'QuizResultDAO: Transactional batch submission and score recording',
      'UserAccountDAO: Authentication and role-based access retrieval'
    ],
    javaCodeSample: `public class QuestionDAOImpl implements IQuestionDAO {
    private final DataSource dataSource;

    public QuestionDAOImpl(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public List<Question> findByCategory(String category) throws SQLException {
        String sql = "SELECT * FROM questions WHERE category = ? ORDER BY id ASC";
        List<Question> questions = new ArrayList<>();
        
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, category);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    questions.add(mapResultSetToQuestion(rs));
                }
            }
        }
        return questions;
    }
}`
  },
  {
    id: 'rubric-jdbc-conn',
    category: 'GUI Rubric',
    title: 'Database Connectivity (JDBC)',
    marks: 6,
    description: 'Driver loading, HikariCP connection pooling, JDBC transaction boundaries with rollback handling for atomic score and audit logging.',
    implementationHighlights: [
      'Connection pooling with connection validation and timeout management',
      'ACID transaction control: conn.setAutoCommit(false), conn.commit(), conn.rollback()',
      'AutoCloseable try-with-resources to prevent connection pool exhaustion leaks'
    ],
    javaCodeSample: `public class DBConnectionPool {
    private static HikariDataSource dataSource;

    static {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:mysql://localhost:3306/quiz_platform?useSSL=false");
        config.setUsername("db_admin");
        config.setPassword("secret_pass");
        config.setMaximumPoolSize(10);
        config.setConnectionTimeout(30000);
        dataSource = new HikariDataSource(config);
    }

    public static Connection getConnection() throws SQLException {
        return dataSource.getConnection();
    }
}`
  },
  {
    id: 'rubric-web-servlets',
    category: 'Web Rubric',
    title: 'Servlets & Web Integration',
    marks: 7,
    description: 'HttpServlet architecture for request routing, session lifecycle, RESTful JSON payloads, and authentication filters.',
    implementationHighlights: [
      'QuizServlet: handles GET /api/quiz?category=x and POST /api/quiz/submit',
      'AuthFilter: validates user session token before granting test-taker access',
      'LeaderboardServlet: delivers SSE or polling updates for real-time rank feeds'
    ],
    javaCodeSample: `@WebServlet("/api/quiz/submit")
public class QuizSubmitServlet extends HttpServlet {
    private final IScoringEngine scoringEngine = new PenaltyScoringStrategy();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        HttpSession session = req.getSession(false);
        if (session == null || session.getAttribute("user") == null) {
            resp.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Login required");
            return;
        }
        
        // Parse JSON payload using Jackson/Gson
        QuizSubmission submission = JsonUtils.fromJson(req.getReader(), QuizSubmission.class);
        QuizResult result = scoringEngine.evaluate(submission);
        
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        resp.getWriter().write(JsonUtils.toJson(result));
    }
}`
  }
];

export const SQL_SCHEMA_DDL = `-- ==========================================================
-- Java Online Quiz Platform - Relational Database Schema (DDL)
-- Compliant with JDBC & DAO Architecture
-- ==========================================================

CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS questions (
    question_id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    question_text TEXT NOT NULL,
    code_snippet TEXT,
    category VARCHAR(50) NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    options_json JSON NOT NULL,
    correct_option_index INT NOT NULL,
    explanation TEXT NOT NULL,
    points INT DEFAULT 10
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
    attempt_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    category_filter VARCHAR(50),
    total_questions INT NOT NULL,
    score DECIMAL(5,2) NOT NULL,
    max_score INT NOT NULL,
    accuracy_pct DECIMAL(5,2) NOT NULL,
    time_taken_seconds INT NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS leaderboard_snapshots (
    entry_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    score DECIMAL(5,2) NOT NULL,
    time_seconds INT NOT NULL,
    badge VARCHAR(50),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE INDEX idx_questions_category ON questions(category);
CREATE INDEX idx_attempts_user ON quiz_attempts(user_id);
CREATE INDEX idx_attempts_score ON quiz_attempts(score DESC, time_taken_seconds ASC);
`;
