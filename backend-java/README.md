# JavaMaster Backend — Jakarta EE & JDBC Web Application

A robust, enterprise-structured Java backend for the **JavaMaster Online Quiz & Assessment Platform**. Built to fulfill college project review rubrics for Core Java, Object-Oriented Programming (OOP), Data Access Objects (DAO), Java Database Connectivity (JDBC), and Jakarta Servlets.

---

## 1. Technology Stack

* **Java Version**: Java 17 LTS (or Java 21)
* **Web Framework**: Jakarta Servlet API 6.0 (`jakarta.servlet-api`)
* **Servlet Container**: Apache Tomcat 10.1+ or Apache Tomcat 11
* **Database**: MySQL 8.0+ / MariaDB 10.5+
* **Persistence Layer**: Native JDBC with HikariCP 5.1 Connection Pooling
* **Build Tool**: Apache Maven 3.8+
* **JSON Serialization**: Google Gson 2.10.1
* **Unit Testing**: JUnit 5 (Jupiter)

---

## 2. Project Directory Structure

```
backend-java/
├── pom.xml                                      # Maven build configuration & dependencies
├── schema.sql                                   # MySQL DDL script & seed quiz questions
├── README.md                                    # Setup and operational documentation
└── src/
    ├── main/
    │   ├── java/com/javamaster/
    │   │   ├── model/
    │   │   │   ├── Question.java                # Encapsulated question entity bean
    │   │   │   └── EvaluationResult.java        # Evaluation metrics & category stats bean
    │   │   ├── service/
    │   │   │   ├── IScoringEngine.java          # Strategy interface for polymorphic scoring
    │   │   │   └── StandardScoringEngine.java   # Standard scoring implementation
    │   │   ├── dao/
    │   │   │   ├── IQuestionDAO.java            # DAO interface for Question entity
    │   │   │   └── QuestionDAOImpl.java         # JDBC implementation with PreparedStatements
    │   │   ├── util/
    │   │   │   └── DBConnectionManager.java     # HikariCP singleton connection pool manager
    │   │   ├── exception/
    │   │   │   ├── QuizPlatformException.java   # Base checked platform exception
    │   │   │   └── DatabaseOperationException.java # Specialized JDBC persistence exception
    │   │   └── servlet/
    │   │       ├── QuestionServlet.java         # Jakarta Servlet for GET /api/questions
    │   │       └── CorsFilter.java              # CORS Filter for React frontend integration
    │   ├── resources/
    │   │   ├── db.properties                    # Local database connection properties
    │   │   └── db.properties.example            # Environment template without credentials
    │   └── webapp/
    │       └── WEB-INF/
    │           └── web.xml                      # Servlet 6.0 deployment descriptor
    └── test/
        └── java/com/javamaster/service/
            └── StandardScoringEngineTest.java   # JUnit 5 test suite for scoring engine
```

---

## 3. Database Setup (MySQL)

### Step 3.1: Execute Schema & Seed Script
Open MySQL Workbench, phpMyAdmin, or your command-line client and execute `schema.sql`:

```bash
mysql -u root -p < schema.sql
```

This will create:
1. Database: `quiz_platform`
2. Tables: `questions`, `users`, `quiz_attempts`, `leaderboard_entries`
3. 10 seed questions covering Core OOP, Collections, Concurrency, JDBC, Exceptions, and Streams.

### Step 3.2: Configure Database Credentials
Edit `src/main/resources/db.properties` (or set environment variables):

```properties
db.driver=com.mysql.cj.jdbc.Driver
db.url=jdbc:mysql://localhost:3306/quiz_platform?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&characterEncoding=UTF-8
db.username=YOUR_MYSQL_USERNAME
db.password=YOUR_MYSQL_PASSWORD
```

Alternatively, set standard environment variables without modifying configuration files:
* `DB_URL`
* `DB_USERNAME`
* `DB_PASSWORD`

---

## 4. Build & Testing Commands

### Prerequisites
* JDK 17+ installed (`javac -version`)
* Maven 3.8+ installed (`mvn -version`)

### Run Unit Tests
```bash
cd backend-java
mvn clean test
```

### Package into WAR File
```bash
mvn clean package
```

The compiled web application archive will be generated at:
```
backend-java/target/javamaster-backend.war
```

---

## 5. Deployment to Apache Tomcat

1. Install **Apache Tomcat 10.1+** (supports the `jakarta.*` package namespace).
2. Copy `target/javamaster-backend.war` to the Tomcat `webapps/` directory:
   ```bash
   cp target/javamaster-backend.war $CATALINA_HOME/webapps/ROOT.war
   # or deploy as /javamaster-backend context
   cp target/javamaster-backend.war $CATALINA_HOME/webapps/
   ```
3. Start Tomcat:
   * **Linux/macOS**: `$CATALINA_HOME/bin/startup.sh`
   * **Windows**: `%CATALINA_HOME%\bin\startup.bat`
4. The API will be accessible at:
   `http://localhost:8080/api/questions` (or `http://localhost:8080/javamaster-backend/api/questions`)

---

## 6. API Endpoint Documentation

### `GET /api/questions`
Retrieves all questions or filters by category.

* **URL Parameters**:
  * `category` *(optional)*: Filter questions by category (e.g., `Core OOP`, `Collections & Generics`, `JDBC & Database`, `Multithreading & Concurrency`).
* **Response Headers**:
  * `Content-Type: application/json;charset=UTF-8`
* **Success Response (`200 OK`)**:
```json
[
  {
    "id": "q-oop-1",
    "title": "Dynamic Method Dispatch & Polymorphism",
    "questionText": "What is the output of the following Java program when executed?",
    "codeSnippet": "class Parent { ... }",
    "category": "Core OOP",
    "difficulty": "Intermediate",
    "options": [
      "20 Child:20",
      "10 Child:20",
      "10 Parent:10",
      "20 Parent:10"
    ],
    "correctOptionIndex": 1,
    "explanation": "In Java, instance variables are resolved at compile time...",
    "points": 10,
    "tags": ["#Polymorphism", "#DynamicDispatch"]
  }
]
```
* **Error Response (`500 Internal Server Error`)**:
```json
{
  "error": "Database error occurred while retrieving questions.",
  "details": "Communications link failure"
}
```

---

## 7. College Project Rubric Mapping

| Rubric Criteria | Specific Java Source Artifact |
| :--- | :--- |
| **OOP Implementation** | `Question.java` (Encapsulation), `IScoringEngine.java` (Interfaces & Polymorphism), `StandardScoringEngine.java` (Concrete implementation) |
| **Exception Handling** | `QuizPlatformException.java`, `DatabaseOperationException.java` |
| **Collections & Generics** | `List<Question>`, `List<String>`, `Map<String, Integer>`, `Map<String, CategoryStat>` |
| **DAO Pattern** | `IQuestionDAO.java`, `QuestionDAOImpl.java` |
| **JDBC Connectivity** | `DBConnectionManager.java` (HikariCP connection pool, `PreparedStatement`, `ResultSet`, AutoCloseable `try-with-resources`) |
| **Servlets & Web Integration** | `QuestionServlet.java` (`@WebServlet("/api/questions")`), `CorsFilter.java` (`@WebFilter("/*")`) |
