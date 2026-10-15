import { Question, Category } from '../types/quiz';

export const INITIAL_QUESTIONS: Question[] = [
  // 1. Core OOP
  {
    id: 'q-oop-1',
    title: 'Dynamic Method Dispatch & Polymorphism',
    questionText: 'What is the output of the following Java program when executed?',
    codeSnippet: `class Parent {
    int value = 10;
    void print() {
        System.out.print("Parent:" + value + " ");
    }
}

class Child extends Parent {
    int value = 20;
    @Override
    void print() {
        System.out.print("Child:" + value + " ");
    }
}

public class Main {
    public static void main(String[] args) {
        Parent p = new Child();
        System.out.print(p.value + " ");
        p.print();
    }
}`,
    options: [
      '20 Child:20',
      '10 Child:20',
      '10 Parent:10',
      '20 Parent:10'
    ],
    correctOptionIndex: 1,
    category: 'Core OOP',
    tags: ['#Polymorphism', '#DynamicDispatch', '#VariableShadowing'],
    difficulty: 'Intermediate',
    explanation: 'In Java, instance variables are resolved at compile time based on the reference type (Parent p has value = 10), so p.value prints 10. Instance methods, however, undergo dynamic method dispatch at runtime based on the actual object (Child instance), invoking Child\'s overridden print() method which prints Child:20.',
    points: 10
  },
  {
    id: 'q-oop-2',
    title: 'Interface Default Methods & Diamond Conflict',
    questionText: 'Given the following two interfaces and class implementation, what is the compilation outcome?',
    codeSnippet: `interface Engine {
    default void start() {
        System.out.println("Engine started");
    }
}

interface Motor {
    default void start() {
        System.out.println("Motor started");
    }
}

class HybridCar implements Engine, Motor {
    // No explicit start() implementation here
}`,
    options: [
      'Compiles successfully; Engine.start() takes precedence because it was listed first.',
      'Compilation error: HybridCar inherits unrelated defaults for start() from types Engine and Motor.',
      'Compiles successfully and calls both start() methods in sequence.',
      'Runtime exception thrown on object instantiation.'
    ],
    correctOptionIndex: 1,
    category: 'Core OOP',
    tags: ['#Interfaces', '#DefaultMethods', '#DiamondProblem'],
    difficulty: 'Intermediate',
    explanation: 'When a class implements two interfaces containing identical default method signatures without an inheritance relationship between them, Java compiler generates an error due to ambiguity. HybridCar must explicitly override the start() method and choose or resolve the conflict (e.g. Engine.super.start()).',
    points: 10
  },
  {
    id: 'q-oop-3',
    title: 'Constructor Chaining and Initialization Order',
    questionText: 'What will be printed when new Sub() is executed?',
    codeSnippet: `class Super {
    Super() {
        printFive();
    }
    void printFive() {
        System.out.print("Super ");
    }
}

class Sub extends Super {
    int x = 5;
    @Override
    void printFive() {
        System.out.print("Sub:" + x + " ");
    }
}

public class Test {
    public static void main(String[] args) {
        new Sub();
    }
}`,
    options: [
      'Super',
      'Sub:5',
      'Sub:0',
      'NullPointerException'
    ],
    correctOptionIndex: 2,
    category: 'Core OOP',
    tags: ['#Constructors', '#InitializationOrder', '#Polymorphism'],
    difficulty: 'Advanced',
    explanation: 'When Sub is instantiated, Super\'s constructor executes first before Sub\'s instance fields (int x = 5) are initialized. During Super() invocation, dynamic dispatch calls Sub.printFive(). At this exact moment, x is still holding its default primitive value (0), hence "Sub:0" is printed.',
    points: 10
  },

  // 2. Collections & Generics
  {
    id: 'q-col-1',
    title: 'HashMap Internal Collision Resolution',
    questionText: 'In Java 8+, what data structure does HashMap transition a bucket into when the number of colliding elements in that bucket exceeds TREEIFY_THRESHOLD (8) and table capacity is at least 64?',
    codeSnippet: `// Standard Java HashMap bucket entry distribution:
Map<Key, Value> map = new HashMap<>();`,
    options: [
      'Doubly Linked List',
      'Red-Black Self-Balancing Binary Search Tree',
      'SkipList',
      'B+ Tree'
    ],
    correctOptionIndex: 1,
    category: 'Collections & Generics',
    tags: ['#HashMap', '#Collections', '#DataStructures'],
    difficulty: 'Intermediate',
    explanation: 'Since Java 8, to mitigate Worst-Case O(n) hash collision performance attacks, HashMap converts linked list buckets into balanced Red-Black Trees (TreeNode) when bucket size reaches 8 and capacity >= 64, reducing search complexity from O(n) to O(log n).',
    points: 10
  },
  {
    id: 'q-col-2',
    title: 'Generics PECS Principle (Producer Extends, Consumer Super)',
    questionText: 'Consider the method copyElements. Which generic type parameter declaration conforms to the PECS rule so that numbers can be safely read from source and written to destination?',
    codeSnippet: `public static void copy(
    List<_______> src, 
    List<_______> dest
) {
    for (Number n : src) {
        dest.add(n);
    }
}`,
    options: [
      'src: <? extends Number>, dest: <? super Number>',
      'src: <? super Number>, dest: <? extends Number>',
      'src: <? extends Object>, dest: <? extends Number>',
      'src: <T extends Number>, dest: <T super Number>'
    ],
    correctOptionIndex: 0,
    category: 'Collections & Generics',
    tags: ['#Generics', '#PECS', '#Wildcards'],
    difficulty: 'Advanced',
    explanation: 'According to Joshua Bloch\'s PECS principle (Producer Extends, Consumer Super): src produces items (we read Numbers from it), so it uses <? extends Number>. dest consumes items (we write Numbers into it), so it must use <? super Number>.',
    points: 10
  },
  {
    id: 'q-col-3',
    title: 'Fail-Fast vs Fail-Safe Iterators',
    questionText: 'Which collection produces a Fail-Safe iterator that will NOT throw ConcurrentModificationException when modified during iteration?',
    codeSnippet: `Iterator<String> it = list.iterator();
while(it.hasNext()) {
    String s = it.next();
    list.add("new element"); // Will this throw CME?
}`,
    options: [
      'java.util.ArrayList',
      'java.util.concurrent.CopyOnWriteArrayList',
      'java.util.LinkedList',
      'java.util.HashSet'
    ],
    correctOptionIndex: 1,
    category: 'Collections & Generics',
    tags: ['#Iterators', '#FailFast', '#Concurrency'],
    difficulty: 'Intermediate',
    explanation: 'CopyOnWriteArrayList creates an immutable snapshot of the backing array when the iterator is constructed. Modifications make a fresh copy of the array without affecting active iterators, making it fail-safe with zero ConcurrentModificationException risk.',
    points: 10
  },

  // 3. Multithreading & Concurrency
  {
    id: 'q-thr-1',
    title: 'Volatile Keyword & Java Memory Model (JMM)',
    questionText: 'What guarantee does the "volatile" keyword in Java strictly provide regarding shared variables across threads?',
    codeSnippet: `private volatile boolean flag = true;
private volatile int counter = 0;`,
    options: [
      'Guarantees compound operations like counter++ are completely atomic.',
      'Guarantees visibility of writes across threads and establishes a happens-before relationship, preventing instruction reordering.',
      'Locks the object monitor just like a synchronized block.',
      'Moves the variable from heap memory directly to the CPU L1 cache exclusively.'
    ],
    correctOptionIndex: 1,
    category: 'Multithreading & Concurrency',
    tags: ['#Multithreading', '#Volatile', '#MemoryModel'],
    difficulty: 'Intermediate',
    explanation: 'Volatile ensures visibility: when one thread writes to a volatile variable, the new value is immediately flushed to main memory and visible to subsequent reads. It also prevents instruction reordering via memory barriers, but does NOT make compound operations (like counter++) atomic.',
    points: 10
  },
  {
    id: 'q-thr-2',
    title: 'ReentrantLock and Deadlock Prevention',
    questionText: 'Which method on ReentrantLock allows a thread to attempt acquiring a lock without blocking indefinitely, helping prevent deadlocks?',
    codeSnippet: `Lock lockA = new ReentrantLock();
Lock lockB = new ReentrantLock();

// How should a thread safely attempt acquisition with timeout?`,
    options: [
      'lockA.tryLock(100, TimeUnit.MILLISECONDS)',
      'lockA.acquireIfFree()',
      'lockA.waitLock()',
      'lockA.safeAcquire()'
    ],
    correctOptionIndex: 0,
    category: 'Multithreading & Concurrency',
    tags: ['#ReentrantLock', '#Deadlock', '#Concurrency'],
    difficulty: 'Advanced',
    explanation: 'tryLock(long timeout, TimeUnit unit) returns true if the lock was acquired within the specified waiting time, and false otherwise. If it fails, the thread can release already held locks and back off, completely preventing classic AB-BA circular wait deadlocks.',
    points: 10
  },
  {
    id: 'q-thr-3',
    title: 'Thread State Transition & wait() Contract',
    questionText: 'What happens if a thread calls object.wait() without holding the monitor lock for that object?',
    codeSnippet: `Object lock = new Object();
// Thread executes without synchronized(lock):
lock.wait();`,
    options: [
      'The thread transitions to WAITING state normally.',
      'Throws an IllegalMonitorStateException at runtime.',
      'Deadlocks the JVM process.',
      'The thread ignores the call and continues execution.'
    ],
    correctOptionIndex: 1,
    category: 'Multithreading & Concurrency',
    tags: ['#Synchronization', '#ThreadStates', '#MonitorLock'],
    difficulty: 'Intermediate',
    explanation: 'According to Java Object specification, calling wait(), notify(), or notifyAll() on an object requires the calling thread to own that object\'s monitor lock (inside a synchronized block/method). Failure to do so immediately throws IllegalMonitorStateException.',
    points: 10
  },

  // 4. JDBC & Database Connectivity
  {
    id: 'q-jdbc-1',
    title: 'PreparedStatement vs Statement Security',
    questionText: 'Why is PreparedStatement preferred over Statement for executing parameterized SQL queries in Java JDBC applications?',
    codeSnippet: `String sql = "SELECT * FROM users WHERE username = ? AND password = ?";
PreparedStatement ps = conn.prepareStatement(sql);
ps.setString(1, user);
ps.setString(2, pass);`,
    options: [
      'It compiles the query template ahead of time and treats parameters strictly as data values, preventing SQL Injection.',
      'It bypasses database authorization checks for faster throughput.',
      'It automatically manages connection pooling without third-party libraries.',
      'It only works with NoSQL databases.'
    ],
    correctOptionIndex: 0,
    category: 'JDBC & Database',
    tags: ['#JDBC', '#PreparedStatement', '#SQLInjection', '#Security'],
    difficulty: 'Beginner',
    explanation: 'PreparedStatement pre-compiles the SQL query structure in the database engine. Parameter values supplied via ps.setString() are bound as literals, rendering SQL injection payloads inert. Additionally, pre-compiled plans can be reused for superior database performance.',
    points: 10
  },
  {
    id: 'q-jdbc-2',
    title: 'JDBC Transaction Management & Rollback',
    questionText: 'To manually control transaction atomicity in JDBC, which method MUST be called on the Connection object before executing batch statements?',
    codeSnippet: `Connection conn = DriverManager.getConnection(DB_URL, USER, PASS);
// Step required to enable multi-statement atomic transactions:
// ____________________
try {
    // execute multiple queries...
    conn.commit();
} catch (SQLException ex) {
    conn.rollback();
}`,
    options: [
      'conn.setAutoCommit(false)',
      'conn.enableTransactions()',
      'conn.beginTransaction()',
      'conn.setManualMode(true)'
    ],
    correctOptionIndex: 0,
    category: 'JDBC & Database',
    tags: ['#JDBC', '#Transactions', '#ACID', '#Rollback'],
    difficulty: 'Intermediate',
    explanation: 'By default, JDBC connections operate in auto-commit mode where each SQL statement is committed immediately upon execution. Calling conn.setAutoCommit(false) groups subsequent statements into a single atomic transaction until commit() or rollback() is explicitly called.',
    points: 10
  },
  {
    id: 'q-jdbc-3',
    title: 'JDBC DAO Pattern & ResultSet Resource Management',
    questionText: 'Under Java 7+, how should Connection, PreparedStatement, and ResultSet be closed properly without writing nested finally blocks?',
    codeSnippet: `try (Connection c = ds.getConnection();
     PreparedStatement ps = c.prepareStatement(QUERY);
     ResultSet rs = ps.executeQuery()) {
    while (rs.next()) {
        // process data
    }
} catch (SQLException e) {
    // handle error
}`,
    options: [
      'Using try-with-resources because all three interfaces implement java.lang.AutoCloseable.',
      'Using System.gc() to garbage collect open database sockets.',
      'By annotating the DAO method with @Transactional.',
      'By closing the ResultSet only; the Connection automatically stays open in cache.'
    ],
    correctOptionIndex: 0,
    category: 'JDBC & Database',
    tags: ['#JDBC', '#DAO', '#AutoCloseable', '#ResourceManagement'],
    difficulty: 'Intermediate',
    explanation: 'Connection, PreparedStatement, and ResultSet implement AutoCloseable. Wrapping them in a try-with-resources statement guarantees deterministic resource closure in reverse order of acquisition even if an exception occurs.',
    points: 10
  },

  // 5. Exception Handling & IO
  {
    id: 'q-exc-1',
    title: 'Checked vs Unchecked Exception Hierarchy',
    questionText: 'Which class in the Java exception hierarchy represents unchecked exceptions that do NOT require mandatory handling or declaration in the method "throws" clause?',
    codeSnippet: `Throwable
 ├── Error
 └── Exception
      ├── IOException (Checked)
      └── ? (Unchecked)`,
    options: [
      'java.lang.RuntimeException',
      'java.lang.ClassNotFoundException',
      'java.lang.SQLException',
      'java.lang.InterruptedException'
    ],
    correctOptionIndex: 0,
    category: 'Exception Handling & IO',
    tags: ['#Exceptions', '#RuntimeException', '#ClassHierarchy'],
    difficulty: 'Beginner',
    explanation: 'RuntimeException and its subclasses (e.g. NullPointerException, IllegalArgumentException, IndexOutOfBoundsException) and Error are unchecked exceptions. All other subclasses of Exception are checked exceptions and must be caught or declared.',
    points: 10
  },
  {
    id: 'q-exc-2',
    title: 'Finally Block Return Value Precedence',
    questionText: 'What value does the testMethod() return when executed?',
    codeSnippet: `public static int testMethod() {
    try {
        int x = 10 / 0; // ArithmeticException
        return 1;
    } catch (ArithmeticException e) {
        return 2;
    } finally {
        return 3;
    }
}`,
    options: [
      'Throws ArithmeticException',
      'Returns 2',
      'Returns 3',
      'Compilation error'
    ],
    correctOptionIndex: 2,
    category: 'Exception Handling & IO',
    tags: ['#Exceptions', '#Finally', '#ControlFlow'],
    difficulty: 'Intermediate',
    explanation: 'The finally block always executes when control leaves a try or catch block. When a return statement is present inside a finally block, it overrides and suppresses any return value or unhandled exception previously encountered in the try or catch block.',
    points: 10
  },

  // 6. Java 8+ Streams & Lambdas
  {
    id: 'q-str-1',
    title: 'Streams Terminal vs Intermediate Operations',
    questionText: 'Which of the following operations on a Java Stream is a TERMINAL operation that triggers execution of the stream pipeline?',
    codeSnippet: `List<String> names = List.of("Alice", "Bob", "Charlie");
names.stream()
     .filter(s -> s.length() > 3)
     .map(String::toUpperCase)
     // Which operation triggers evaluation?`,
    options: [
      'peek()',
      'map()',
      'collect()',
      'sorted()'
    ],
    correctOptionIndex: 2,
    category: 'Java 8+ Streams & Lambdas',
    tags: ['#Streams', '#Lambdas', '#FunctionalProgramming'],
    difficulty: 'Beginner',
    explanation: 'Streams are lazily evaluated. Intermediate operations (like filter, map, sorted, peek) return another Stream and do not execute until a terminal operation (like collect, count, forEach, reduce) is invoked.',
    points: 10
  },
  {
    id: 'q-str-2',
    title: 'FlatMap vs Map Transformation',
    questionText: 'What is the resulting output when flatMap is applied over a list of string lists?',
    codeSnippet: `List<List<String>> list = List.of(
    List.of("A", "B"),
    List.of("C", "D")
);

List<String> result = list.stream()
    .flatMap(Collection::stream)
    .toList();

System.out.println(result);`,
    options: [
      '[[A, B], [C, D]]',
      '[A, B, C, D]',
      '[A, C]',
      'Compilation error'
    ],
    correctOptionIndex: 1,
    category: 'Java 8+ Streams & Lambdas',
    tags: ['#Streams', '#FlatMap', '#Collections'],
    difficulty: 'Intermediate',
    explanation: 'flatMap transforms each element into a stream of values and flattens all resulting individual streams into a single composite stream, flattening [[A, B], [C, D]] into [A, B, C, D].',
    points: 10
  },

  // 7. JVM & Web Architecture
  {
    id: 'q-jvm-1',
    title: 'JVM Memory Model: Stack vs Heap Allocation',
    questionText: 'In the standard JVM runtime data area, where are local primitive variables and object instances stored respectively?',
    codeSnippet: `public void execute() {
    int count = 42;             // Where is count?
    User user = new User();     // Where is User object?
}`,
    options: [
      'count is stored in the Thread Stack frame; User instance is stored in the Shared Heap.',
      'Both count and User instance are stored exclusively in the Thread Stack.',
      'Both count and User instance are stored in the Metaspace.',
      'count is stored in the Heap; User instance is stored in the CPU register.'
    ],
    correctOptionIndex: 0,
    category: 'JVM & Web Architecture',
    tags: ['#JVM', '#MemoryModel', '#StackAndHeap'],
    difficulty: 'Intermediate',
    explanation: 'Local variables and primitive values inside method execution are allocated within the thread\'s Stack frame. Object instances created via "new" are allocated on the shared Heap (the reference pointer user sits on the stack pointing to the heap object).',
    points: 10
  },
  {
    id: 'q-jvm-2',
    title: 'Java Servlet Lifecycle in Web Applications',
    questionText: 'In a Java EE/Jakarta Web Application, what is the exact execution lifecycle sequence of a Servlet when handled by the Servlet Container (e.g. Tomcat/Jetty)?',
    codeSnippet: `public class QuizServlet extends HttpServlet {
    // Lifecycle methods invoked by container
}`,
    options: [
      'init() -> service() (called for each request) -> destroy()',
      'service() -> init() -> doFilter() -> destroy()',
      'construct() -> execute() -> finish()',
      'doGet() -> doPost() -> finalize()'
    ],
    correctOptionIndex: 0,
    category: 'JVM & Web Architecture',
    tags: ['#Servlets', '#WebArchitecture', '#Lifecycle'],
    difficulty: 'Intermediate',
    explanation: 'The Servlet container loads the servlet class, instantiates it, calls init(ServletConfig) once, invokes service(req, res) for each incoming HTTP request (which delegates to doGet/doPost), and finally calls destroy() before unloading the servlet.',
    points: 10
  }
];

export const CATEGORIES: Category[] = [
  'Core OOP',
  'Collections & Generics',
  'Multithreading & Concurrency',
  'JDBC & Database',
  'Exception Handling & IO',
  'Java 8+ Streams & Lambdas',
  'JVM & Web Architecture'
];
