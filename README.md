# JavaMaster — Online Java Quiz & Assessment Platform

JavaMaster is a web-based Java programming quiz and assessment platform that enables students to practise Java, take timed quizzes, evaluate their performance, and view leaderboard rankings. The project combines an interactive React frontend with a Java backend foundation and a MySQL database.

## Project Overview

The platform is designed to provide Java programming assessments, automated scoring, performance feedback, and leaderboard functionality. It demonstrates core Java programming concepts alongside database connectivity and web application development.

Some features require backend integration and deployment testing before they can be considered fully operational.

## Objectives

- Provide an interactive platform for Java programming practice.
- Conduct timed quizzes with automatic submission.
- Generate performance reports and feedback.
- Display leaderboard rankings.
- Support question and user management.
- Demonstrate Java object-oriented programming, interfaces, exception handling, JDBC, and Servlets.

## User Roles & Functionalities

### 1. Admin

The frontend includes an administrative dashboard intended to support platform management.

Potential administrative responsibilities include:

- **User Management:** Manage user accounts and roles.
- **Quiz Content Management:** Maintain and review quiz questions.
- **System Settings:** Manage quiz-related configuration.
- **Performance Reports:** Review assessment statistics.
- **System Notifications:** Monitor relevant system alerts.

The availability of these functions depends on the existing implementation and backend integration.

### 2. Quiz Creator

The platform's intended quiz-creation functionality may include:

- **Create Quizzes:** Prepare quizzes with titles, questions, and durations.
- **Manage Content:** Maintain quiz questions and assessment content.
- **Review Results:** Review scores and submitted assessments.
- **Provide Feedback:** Share feedback with participants where supported.
- **Quiz History:** View created and published quizzes where supported.

Quiz creator workflows should be considered complete only after their implementation has been verified.

### 3. Participant

Participants can use the quiz interface to practise Java and evaluate their knowledge.

The intended functionality includes:

- **Take Quizzes:** Attempt Java programming assessments.
- **Review Performance:** View scores and feedback.
- **Quiz History:** Review previous attempts where persistence is implemented.
- **Leaderboard:** View rankings where leaderboard data is available.

## Main Features

The project includes a React-based quiz interface and a Java backend foundation.

The intended platform features include:

- Timed Java quizzes and automatic submission.
- Question navigation and answer selection.
- Java code snippets in quiz questions.
- Automated scoring and performance evaluation.
- Category-based question organization.
- Leaderboard display.
- Administrative question management.

Additional capabilities, such as question import/export, persistent quiz history, advanced analytics, configurable assessment settings, and complete user-management workflows, require verification against the current implementation.

## Technology Stack

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Lucide React
- Motion

### Backend

- Java
- Apache Maven
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

## System Architecture

The application separates the React frontend from the Java backend.

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

The frontend and backend are maintained separately. They can communicate through HTTP API endpoints once the required configuration and integration have been completed and verified.

## Project Structure

The following is a simplified overview of the project structure. Refer to the repository for the complete list of files.

```text
java_project/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── QuizCatalog.tsx
│   │   ├── QuizEngine.tsx
│   │   ├── QuizResultView.tsx
│   │   ├── LeaderboardView.tsx
│   │   └── AdminDashboard.tsx
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

## Database Design

The backend schema includes the following tables:

| Table | Description |
|---|---|
| `users` | Stores user account information and roles. |
| `questions` | Stores quiz questions and associated question data. |
| `quiz_attempts` | Stores quiz attempt information and scores. |
| `leaderboard_entries` | Stores leaderboard score and ranking information. |

Refer to [`backend-java/schema.sql`](backend-java/schema.sql) for the actual table definitions and seed data.

## Java Concepts

The backend codebase demonstrates several Java and web development concepts, including:

- **Encapsulation:** Organizing data and behaviour within classes.
- **Interfaces:** Defining contracts for scoring and database operations.
- **Polymorphism:** Supporting interchangeable implementations through interfaces.
- **Exception Handling:** Handling application and database errors with exceptions.
- **JDBC:** Connecting Java code to a relational database and executing SQL operations.
- **Servlets:** Handling HTTP requests in a Java web application.
- **Database Access Objects (DAO):** Separating database operations from application logic.
- **Connection Pooling:** Using HikariCP to manage database connections.

Other concepts, including inheritance, generics, multithreading, and synchronization, should be described as implemented features only when supported by the actual source code.

## Getting Started

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
node --version
npm --version
```

### 1. Clone the Repository

Open Windows Command Prompt or a terminal and run:

```bash
git clone https://github.com/advikbhardwaj0909-png/java_project.git
cd java_project
```

### 2. Install Frontend Dependencies

From the project root, run:

```bash
npm install
```

### 3. Set Up the MySQL Database

Ensure that MySQL Server is running. From the project root, execute the existing schema:

```bat
mysql -u root -p < backend-java\schema.sql
```

Enter your local MySQL password when prompted.

Verify the database tables:

```bat
mysql -u root -p -e "SHOW TABLES IN quiz_platform;"
```

### 4. Configure Database Credentials

Check the database configuration used by the backend. The reported configuration location is:

`backend-java/src/main/resources/db.properties`

Confirm the actual configuration file and the property names expected by `DBConnectionManager.java` before changing any settings.

If the implementation supports environment-variable configuration, you may set local values in Windows Command Prompt:

```bat
set DB_URL=jdbc:mysql://localhost:3306/quiz_platform
set DB_USERNAME=root
set DB_PASSWORD=YOUR_MYSQL_PASSWORD
```

Replace `YOUR_MYSQL_PASSWORD` with your local MySQL password. These example environment variables will work only if the backend reads those exact names.

**Security note:** Never commit real database credentials, passwords, or API keys to GitHub.

### 5. Build and Test the Java Backend

From the project root, run the backend unit tests:

```bat
mvn -f backend-java\pom.xml clean test
```

To package the backend:

```bat
mvn -f backend-java\pom.xml clean package
```

The expected WAR file is:

```text
backend-java\target\javamaster-backend.war
```

The file is generated only if the Maven build completes successfully.

### 6. Deploy on Apache Tomcat

1. Install Apache Tomcat 10.1 or a compatible version.
2. Copy `javamaster-backend.war` into Tomcat's `webapps` directory.
3. Ensure MySQL is running and the backend database configuration is correct.
4. Start Tomcat using its `bin\catalina.bat` script.
5. Check the Tomcat logs if deployment fails.

The expected backend context path is:

```text
/javamaster-backend
```

Confirm the deployed context path and servlet mappings before testing the API.

### 7. Run the Frontend

From the project root, run:

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

These commands check the frontend independently. A successful frontend build does not by itself verify backend integration.

## API Endpoints

The initial backend implementation identifies the following question endpoints:

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/questions` | Retrieve quiz questions. |
| GET | `/api/questions?category=Core+OOP` | Retrieve questions filtered by category. |

After deploying the backend, the expected local test URL is:

```text
http://localhost:8080/javamaster-backend/api/questions
```

For category filtering:

```text
http://localhost:8080/javamaster-backend/api/questions?category=Core+OOP
```

A successful response should contain JSON question records. The actual response depends on the deployed servlet, database configuration, and available data. Verify these endpoints in the target environment before describing them as operational.

## Security Considerations

- Never commit passwords or secret credentials.
- Use prepared statements for SQL queries.
- Validate incoming data on the server.
- Protect administrative endpoints with authentication and authorization.
- Configure CORS for trusted origins in production.
- Avoid exposing correct answers before quiz submission.
- Use HTTPS and secure session handling for public deployment.

These are security recommendations; verify which protections are implemented in the current codebase.

## Future Enhancements

Potential future improvements include:

- Complete user registration and authentication.
- Implement role-based access control.
- Persist quiz attempts and scores in MySQL.
- Connect the leaderboard to real database records.
- Complete quiz creator and approval workflows.
- Add integration tests and improved error handling.
- Deploy the application to a secure hosting environment.

## Project Status

JavaMaster includes a React and TypeScript frontend and a Java backend foundation. The reported backend build and scoring unit tests succeeded in the development environment.

Live MySQL connectivity, Tomcat deployment, and frontend-to-backend integration still require verification in the target environment.

The project's completion status should be updated as these tests are performed.

## License

No license has been specified yet. Add a `LICENSE` file if you intend to distribute the project publicly.

## Team Members & Contributions

| S. No. | Name | Role | Contribution |
|---:|---|---|---|
| 1 | Manu Sharma | Team Leader | PPT Designing and Project Presentation |
| 2 | Sneha Gupta | Team Member | Database Design and Creation |
| 3 | Tusha Varshney | Team Member | Frontend Development and UI Design |
| 4 | Preeti Jha | Team Member | Backend Development and Java Integration |

### Team Collaboration

Our team worked collaboratively to develop JavaMaster, an online Java quiz and assessment platform. Each member contributed to a specific area of the project, including presentation design, database development, frontend implementation, and backend development.

Together, these contributions support the development of an interactive, organized, and user-friendly Java learning and assessment platform.
