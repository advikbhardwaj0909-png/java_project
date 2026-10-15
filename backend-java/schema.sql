-- ==========================================================
-- JavaMaster Online Quiz Platform
-- MySQL Database DDL & Seed Data Script
-- Compatible with MySQL 8.0+ & MariaDB 10.5+
-- ==========================================================

CREATE DATABASE IF NOT EXISTS quiz_platform 
    DEFAULT CHARACTER SET utf8mb4 
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE quiz_platform;

-- 1. Questions Table
CREATE TABLE IF NOT EXISTS questions (
    question_id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    question_text TEXT NOT NULL,
    code_snippet TEXT NULL,
    category VARCHAR(64) NOT NULL,
    difficulty VARCHAR(32) NOT NULL DEFAULT 'Intermediate',
    options_json JSON NOT NULL,
    correct_option_index INT NOT NULL,
    explanation TEXT NOT NULL,
    points INT NOT NULL DEFAULT 10,
    tags_json JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_questions_category (category),
    INDEX idx_questions_difficulty (difficulty)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    email VARCHAR(191) NOT NULL UNIQUE,
    role VARCHAR(32) NOT NULL DEFAULT 'student',
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    joined_date DATE NOT NULL,
    quizzes_taken INT NOT NULL DEFAULT 0,
    average_score DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Quiz Attempts Table
CREATE TABLE IF NOT EXISTS quiz_attempts (
    attempt_id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    user_name VARCHAR(128) NOT NULL,
    quiz_title VARCHAR(255) NOT NULL,
    category_filter VARCHAR(64) NULL,
    total_questions INT NOT NULL,
    score DECIMAL(6,2) NOT NULL,
    max_score INT NOT NULL,
    accuracy_percentage DECIMAL(5,2) NOT NULL,
    time_limit_minutes INT NOT NULL,
    time_taken_seconds INT NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_attempts_user (user_id),
    INDEX idx_attempts_score (score DESC, time_taken_seconds ASC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Leaderboard Snapshots Table
CREATE TABLE IF NOT EXISTS leaderboard_entries (
    entry_id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    user_name VARCHAR(128) NOT NULL,
    score INT NOT NULL,
    max_score INT NOT NULL,
    accuracy INT NOT NULL,
    time_seconds INT NOT NULL,
    category VARCHAR(64) NOT NULL DEFAULT 'All Java Topics',
    badge VARCHAR(64) NOT NULL DEFAULT 'Java Achiever',
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_lb_category (category),
    INDEX idx_lb_rank (score DESC, time_seconds ASC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================================
-- Seed Data for Questions Table (Aligned with Java Quiz Engine)
-- ==========================================================

INSERT INTO questions (
    question_id, title, question_text, code_snippet, category, difficulty, 
    options_json, correct_option_index, explanation, points, tags_json
) VALUES
(
    'q-oop-1',
    'Dynamic Method Dispatch & Polymorphism',
    'What is the output of the following Java program when executed?',
    'class Parent {\n    int value = 10;\n    void print() {\n        System.out.print("Parent:" + value + " ");\n    }\n}\n\nclass Child extends Parent {\n    int value = 20;\n    @Override\n    void print() {\n        System.out.print("Child:" + value + " ");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Parent p = new Child();\n        System.out.print(p.value + " ");\n        p.print();\n    }\n}',
    'Core OOP',
    'Intermediate',
    '["20 Child:20", "10 Child:20", "10 Parent:10", "20 Parent:10"]',
    1,
    'In Java, instance variables are resolved at compile time based on the reference type (Parent p has value = 10), so p.value prints 10. Instance methods, however, undergo dynamic method dispatch at runtime based on the actual object (Child instance), invoking Child\'s overridden print() method which prints Child:20.',
    10,
    '["#Polymorphism", "#DynamicDispatch", "#VariableShadowing"]'
),
(
    'q-oop-2',
    'Interface Default Methods & Diamond Conflict',
    'Given the following two interfaces and class implementation, what is the compilation outcome?',
    'interface Engine {\n    default void start() {\n        System.out.println("Engine started");\n    }\n}\n\ninterface Motor {\n    default void start() {\n        System.out.println("Motor started");\n    }\n}\n\nclass HybridCar implements Engine, Motor {\n    // No explicit start() implementation here\n}',
    'Core OOP',
    'Intermediate',
    '["Compiles successfully; Engine.start() takes precedence because it was listed first.", "Compilation error: HybridCar inherits unrelated defaults for start() from types Engine and Motor.", "Compiles successfully and calls both start() methods in sequence.", "Runtime exception thrown on object instantiation."]',
    1,
    'When a class implements two interfaces containing identical default method signatures without an inheritance relationship between them, the Java compiler generates an error due to ambiguity. HybridCar must explicitly override the start() method and choose or resolve the conflict (e.g. Engine.super.start()).',
    10,
    '["#Interfaces", "#DefaultMethods", "#DiamondProblem"]'
),
(
    'q-col-1',
    'HashMap Internal Collision Resolution',
    'In Java 8+, what data structure does HashMap transition a bucket into when the number of colliding elements in that bucket exceeds TREEIFY_THRESHOLD (8) and table capacity is at least 64?',
    '// Standard Java HashMap bucket entry distribution:\nMap<Key, Value> map = new HashMap<>();',
    'Collections & Generics',
    'Intermediate',
    '["Doubly Linked List", "Red-Black Self-Balancing Binary Search Tree", "SkipList", "B+ Tree"]',
    1,
    'Since Java 8, to mitigate Worst-Case O(n) hash collision performance attacks, HashMap converts linked list buckets into balanced Red-Black Trees (TreeNode) when bucket size reaches 8 and capacity >= 64, reducing search complexity from O(n) to O(log n).',
    10,
    '["#HashMap", "#Collections", "#DataStructures"]'
),
(
    'q-col-2',
    'Generics PECS Principle (Producer Extends, Consumer Super)',
    'Consider the method copyElements. Which generic type parameter declaration conforms to the PECS rule so that numbers can be safely read from source and written to destination?',
    'public static void copy(\n    List<_______> src, \n    List<_______> dest\n) {\n    for (Number n : src) {\n        dest.add(n);\n    }\n}',
    'Collections & Generics',
    'Advanced',
    '["src: <? extends Number>, dest: <? super Number>", "src: <? super Number>, dest: <? extends Number>", "src: <? extends Object>, dest: <? extends Number>", "src: <T extends Number>, dest: <T super Number>"]',
    0,
    'According to Joshua Bloch\'s PECS principle (Producer Extends, Consumer Super): src produces items (we read Numbers from it), so it uses <? extends Number>. dest consumes items (we write Numbers into it), so it must use <? super Number>.',
    10,
    '["#Generics", "#PECS", "#Wildcards"]'
),
(
    'q-thr-1',
    'Volatile Keyword & Java Memory Model (JMM)',
    'What guarantee does the "volatile" keyword in Java strictly provide regarding shared variables across threads?',
    'private volatile boolean flag = true;\nprivate volatile int counter = 0;',
    'Multithreading & Concurrency',
    'Intermediate',
    '["Guarantees compound operations like counter++ are completely atomic.", "Guarantees visibility of writes across threads and establishes a happens-before relationship, preventing instruction reordering.", "Locks the object monitor just like a synchronized block.", "Moves the variable from heap memory directly to the CPU L1 cache exclusively."]',
    1,
    'Volatile ensures visibility: when one thread writes to a volatile variable, the new value is immediately flushed to main memory and visible to subsequent reads. It also prevents instruction reordering via memory barriers, but does NOT make compound operations (like counter++) atomic.',
    10,
    '["#Multithreading", "#Volatile", "#MemoryModel"]'
),
(
    'q-thr-2',
    'ReentrantLock and Deadlock Prevention',
    'Which method on ReentrantLock allows a thread to attempt acquiring a lock without blocking indefinitely, helping prevent deadlocks?',
    'Lock lockA = new ReentrantLock();\nLock lockB = new ReentrantLock();\n\n// How should a thread safely attempt acquisition with timeout?',
    'Multithreading & Concurrency',
    'Advanced',
    '["lockA.tryLock(100, TimeUnit.MILLISECONDS)", "lockA.acquireIfFree()", "lockA.waitLock()", "lockA.safeAcquire()"]',
    0,
    'tryLock(long timeout, TimeUnit unit) returns true if the lock was acquired within the specified waiting time, and false otherwise. If it fails, the thread can release already held locks and back off, completely preventing classic AB-BA circular wait deadlocks.',
    10,
    '["#ReentrantLock", "#Deadlock", "#Concurrency"]'
),
(
    'q-jdbc-1',
    'PreparedStatement vs Statement Security',
    'Why is PreparedStatement preferred over Statement for executing parameterized SQL queries in Java JDBC applications?',
    'String sql = "SELECT * FROM users WHERE username = ? AND password = ?";\nPreparedStatement ps = conn.prepareStatement(sql);\nps.setString(1, user);\nps.setString(2, pass);',
    'JDBC & Database',
    'Beginner',
    '["It compiles the query template ahead of time and treats parameters strictly as data values, preventing SQL Injection.", "It bypasses database authorization checks for faster throughput.", "It automatically manages connection pooling without third-party libraries.", "It only works with NoSQL databases."]',
    0,
    'PreparedStatement pre-compiles the SQL query structure in the database engine. Parameter values supplied via ps.setString() are bound as literals, rendering SQL injection payloads inert. Additionally, pre-compiled plans can be reused for superior database performance.',
    10,
    '["#JDBC", "#PreparedStatement", "#SQLInjection", "#Security"]'
),
(
    'q-jdbc-2',
    'JDBC Transaction Management & Rollback',
    'To manually control transaction atomicity in JDBC, which method MUST be called on the Connection object before executing batch statements?',
    'Connection conn = DriverManager.getConnection(DB_URL, USER, PASS);\n// Step required to enable multi-statement atomic transactions:\n// ____________________\ntry {\n    // execute multiple queries...\n    conn.commit();\n} catch (SQLException ex) {\n    conn.rollback();\n}',
    'JDBC & Database',
    'Intermediate',
    '["conn.setAutoCommit(false)", "conn.enableTransactions()", "conn.beginTransaction()", "conn.setManualMode(true)"]',
    0,
    'By default, JDBC connections operate in auto-commit mode where each SQL statement is committed immediately upon execution. Calling conn.setAutoCommit(false) groups subsequent statements into a single atomic transaction until commit() or rollback() is explicitly called.',
    10,
    '["#JDBC", "#Transactions", "#ACID", "#Rollback"]'
),
(
    'q-exc-1',
    'Checked vs Unchecked Exception Hierarchy',
    'Which class in the Java exception hierarchy represents unchecked exceptions that do NOT require mandatory handling or declaration in the method "throws" clause?',
    'Throwable\n ├── Error\n └── Exception\n      ├── IOException (Checked)\n      └── ? (Unchecked)',
    'Exception Handling & IO',
    'Beginner',
    '["java.lang.RuntimeException", "java.lang.ClassNotFoundException", "java.lang.SQLException", "java.lang.InterruptedException"]',
    0,
    'RuntimeException and its subclasses (e.g. NullPointerException, IllegalArgumentException, IndexOutOfBoundsException) and Error are unchecked exceptions. All other subclasses of Exception are checked exceptions and must be caught or declared.',
    10,
    '["#Exceptions", "#RuntimeException", "#ClassHierarchy"]'
),
(
    'q-str-1',
    'Streams Terminal vs Intermediate Operations',
    'Which of the following operations on a Java Stream is a TERMINAL operation that triggers execution of the stream pipeline?',
    'List<String> names = List.of("Alice", "Bob", "Charlie");\nnames.stream()\n     .filter(s -> s.length() > 3)\n     .map(String::toUpperCase)\n     // Which operation triggers evaluation?',
    'Java 8+ Streams & Lambdas',
    'Beginner',
    '["peek()", "map()", "collect()", "sorted()"]',
    2,
    'Streams are lazily evaluated. Intermediate operations (like filter, map, sorted, peek) return another Stream and do not execute until a terminal operation (like collect, count, forEach, reduce) is invoked.',
    10,
    '["#Streams", "#Lambdas", "#FunctionalProgramming"]'
)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- ==========================================================
-- Sample Initial User Data
-- ==========================================================
INSERT INTO users (user_id, name, email, role, status, joined_date, quizzes_taken, average_score) VALUES
('user-advik', 'Advik Bhardwaj', 'advikbhardwaj0909@gmail.com', 'student', 'active', '2026-09-05', 8, 92.50),
('user-admin', 'Prof. Marcus Vance (Admin)', 'm.vance@university.edu', 'admin', 'active', '2026-08-15', 14, 98.00)
ON DUPLICATE KEY UPDATE name=VALUES(name);
