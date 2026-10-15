# JavaMaster — Online Java Quiz & Assessment Platform

JavaMaster is a web-based Java programming quiz and assessment platform that enables students to practise Java, take timed quizzes, evaluate their performance, and view leaderboard rankings. Administrators can manage users, quiz content, and system settings.

##  Project Overview

The platform provides timed Java programming assessments, automated scoring, performance reports, and a leaderboard. It is designed to demonstrate core Java programming concepts alongside database connectivity and web application development.

##  Objectives

- Provide an interactive platform for Java programming practice.
- Conduct timed quizzes with automatic submission.
- Generate detailed performance reports and feedback.
- Display leaderboard rankings.
- Manage users, questions, and system settings.
- Demonstrate Java OOP, Collections, Generics, Multithreading, JDBC, and Servlets.

##  User Roles & Functionalities

### 1. Admin

- **User Management:** Create, update, suspend, and manage user accounts and roles.
- **Quiz Content Management:** Review quiz content and approve or reject submissions.
- **System Settings:** Configure quiz duration, randomization, and marking policies.
- **Performance Reports:** Review assessment statistics.
- **System Alerts:** Monitor relevant system notifications.

### 2. Quiz Creator

- **Create Quizzes:** Create quizzes with titles, questions, and durations.
- **Manage Content:** Maintain quiz questions and assessment content.
- **Review Results:** Review scores and submitted assessments.
- **Participant Interaction:** Provide feedback and communicate with participants.
- **Quiz History:** View created and published quizzes.

### 3. Participant

- **Take Quizzes:** Attempt timed Java programming assessments.
- **Review Performance:** View scores, explanations, and performance reports.
- **Quiz History:** Review previous attempts and results.
- **Leaderboard:** View rankings and personal standing.
- **Interact with Creators:** Communicate with quiz creators where supported.

##  Main Features

- Timed Java quizzes with automatic submission.
- Question navigation and answer selection.
- Java code snippets in quiz questions.
- Automated scoring and performance evaluation.
- Category-wise performance analysis.
- Searchable and filterable leaderboard.
- Admin question bank management.
- Question import and export.
- Configurable assessment settings.
- Project rubric and architecture documentation.

*Feature availability depends on the current implementation. Features that require backend integration must be tested before being considered complete.*

##  Technology Stack

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Lucide React
- Motion

### Backend

- Java
- Maven
- Jakarta Servlets 6.0
- Apache Tomcat 10.1+
- JDBC
- MySQL Connector/J
- HikariCP
- Gson
- JUnit 5

### Database

- MySQL
- Database name: `quiz_platform`

##  System Architecture

```text
User
 |
 v
React + TypeScript Frontend
 |
 | HTTP / JSON
 v
Java Backend
Apache Tomcat + Servlets
 |
 v
Service Layer
Scoring and Business Logic
 |
 v
DAO Layer
JDBC Database Operations
 |
 v
MySQL Database
quiz_platform
```

The existing React frontend is maintained separately from the Java backend. The frontend can communicate with the backend through HTTP API endpoints once integration is configured and verified.

##  Project Structure

```text
JavaMaster/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── QuizCatalog.tsx
│   │   ├── QuizEngine.tsx
│   │   ├── QuizResultView.tsx
│   │   ├── LeaderboardView.tsx
│   │   ├── AdminDashboard.tsx
│   │   └── ProjectRubricModal.tsx
│   ├── data/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
├── backend-java/
│   ├── pom.xml
│   ├── schema.sql
│   ├── README.md
│   └── src/
│       ├── main/
│       │   ├── java/com/javamaster/
│       │   │   ├── model/
│       │   │   ├── service/
│       │   │   ├── dao/
│       │   │   ├── util/
│       │   │   ├── exception/
│       │   │   └── servlet/
│       │   ├── resources/
│       │   └── webapp/WEB-INF/
│       └── test/
├── package.json
├── vite.config.ts
└── README.md
```

##  Database Design

The backend schema includes the following tables:

| Table | Description |
|---|---|
| `users` | Stores user account information and roles. |
| `questions` | Stores quiz questions, options, categories, difficulty, explanations, and points. |
| `quiz_attempts` | Stores completed quiz attempts and scores. |
| `leaderboard_entries` | Stores leaderboard score and ranking information. |

Refer to `backend-java/schema.sql` for the actual table definitions and seed data.

##  Java Concepts

The backend is designed to demonstrate:

- **Encapsulation:** Private fields and controlled access through methods.
- **Inheritance:** Shared behaviour through parent and child classes.
- **Polymorphism:** Interchangeable scoring implementations.
- **Interfaces:** Contracts for scoring and database operations.
- **Exception Handling:** Custom exceptions and database error handling.
- **Collections:** Lists, maps, and other Java collection classes.
- **Generics:** Reusable generic DAO abstractions.
- **Multithreading:** Concurrent task execution where appropriate.
- **Synchronization:** Thread-safe access to shared data.
- **JDBC:** Database connectivity and SQL operations.
- **Servlets:** HTTP request handling and web integration.

##  Getting Started

### Prerequisites

Install the following software:

- Node.js and npm
- Java Development Kit (JDK)
- Apache Maven
- MySQL Server
- Apache Tomcat 10.1+

Verify the installations in Windows Command Prompt:

```bat
java -version
mvn -version
mysql --version
```

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd JavaMaster
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual GitHub repository URL.

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Set Up the MySQL Database

Ensure that MySQL is running, then execute the existing schema:

```bat
mysql -u root -p < backend-java\schema.sql
```

Verify the tables:

```bat
mysql -u root -p -e "SHOW TABLES IN quiz_platform;"
```

### 4. Configure Database Credentials

Check the database configuration in:

`backend-java/src/main/resources/db.properties`

Set the appropriate local credentials. If the implementation supports environment-variable overrides, you can configure them in Windows Command Prompt:

```bat
set DB_URL=jdbc:mysql://localhost:3306/quiz_platform
set DB_USERNAME=root
set DB_PASSWORD=YOUR_MYSQL_PASSWORD
```

Replace `YOUR_MYSQL_PASSWORD` with your local MySQL password. Do not commit real credentials to GitHub.

### 5. Build and Test the Java Backend

Run unit tests:

```bat
mvn -f backend-java\pom.xml clean test
```

Package the backend:

```bat
mvn -f backend-java\pom.xml clean package
```

The expected WAR file is:

```text
backend-java\target\javamaster-backend.war
```

### 6. Deploy on Apache Tomcat

1. Install Apache Tomcat 10.1+.
2. Copy `javamaster-backend.war` into Tomcat's `webapps` directory.
3. Ensure MySQL is running and the database credentials are configured.
4. Start Tomcat using its `bin\catalina.bat` script.

The backend context path is expected to be:

```text
/javamaster-backend
```

### 7. Run the Frontend

From the project root:

```bash
npm run dev
```

Open the local URL displayed by Vite.

To build the frontend:

```bash
npm run build
```

To check TypeScript:

```bash
npx tsc --noEmit
```

## 🔌 API Endpoints

The Phase 1 backend report identifies the following endpoints:

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/questions` | Retrieve quiz questions. |
| GET | `/api/questions?category=Core+OOP` | Retrieve questions filtered by category. |

After deploying to Tomcat, test:

```text
http://localhost:8080/javamaster-backend/api/questions
```

For category filtering:

```text
http://localhost:8080/javamaster-backend/api/questions?category=Core+OOP
```

A successful response should contain JSON question records. Verify the live endpoint before describing it as fully operational.

##  College Review 1 Rubric Mapping

| Requirement | Project Evidence |
|---|---|
| OOP Implementation — 10 marks | Models, inheritance, interfaces, polymorphism, exception handling |
| Collections & Generics — 6 marks | Collection usage and generic DAO abstractions |
| Multithreading & Synchronization — 4 marks | Concurrent services and thread-safe operations |
| Database Operation Classes — 7 marks | DAO interfaces and implementations |
| Database Connectivity (JDBC) — 3 marks | Connection manager and JDBC operations |
| JDBC Implementation — 3 marks | Verified database operations |
| Problem Understanding & Solution Design — 8 marks | Requirements and architecture |
| Core Java Concepts — 10 marks | Java models, services, and business logic |
| Database Integration — 8 marks | MySQL schema and persistent operations |
| Servlets & Web Integration — 7 marks | Servlet endpoints and frontend integration |

Use the actual rubric provided by your faculty as the final authority for mark allocation. Demonstrate working implementations and tests rather than relying only on class names or documentation.

##  Security Considerations

- Never commit passwords or secret credentials.
- Use prepared statements for SQL queries.
- Validate data on the server.
- Protect administrative endpoints with authentication and authorization.
- Configure CORS for trusted origins in production.
- Avoid exposing correct answers before quiz submission.
- Use HTTPS and secure session handling for public deployment.

##  Future Enhancements

- Complete user registration and authentication.
- Implement role-based access control.
- Persist quiz attempts and scores in MySQL.
- Connect the leaderboard to real database records.
- Complete quiz creator and approval workflows.
- Add integration tests and improved error handling.
- Deploy the application to a secure hosting environment.

##  Project Status

JavaMaster includes an existing React + TypeScript frontend and a generated Java backend foundation. The reported backend build and scoring unit tests succeeded in the development environment.

Live MySQL connectivity, Tomcat deployment, and frontend-to-backend integration should be verified in the target environment before the complete application is described as production-ready.

##  License

No license has been specified yet. Add a `LICENSE` file if you intend to distribute the project publicly.

##  Team Members & Contributions

| S. No. | Name | Role | Contribution |
|---:|---|---|---|
| 1 | Manu Sharma | Team Leader | PPT Designing and Project Presentation |
| 2 | Sneha Gupta | Team Member | Database Design and Creation |
| 3 | Tusha Varshney | Team Member | Frontend Development and UI Design |
| 4 | Preeti Jha | Team Member | Backend Development and Java Integration |

###  Team Collaboration

Our team worked collaboratively to develop JavaMaster, an online Java quiz and assessment platform. Each member contributed to a specific area of the project, including presentation design, database development, frontend implementation, and backend development.

Together, these contributions support the development of an interactive, organized, and user-friendly Java learning and assessment platform.
