# JavaMaster — Online Java Quiz & Assessment Platform

JavaMaster is a web-based Java programming quiz and assessment platform designed to help students practise Java, attempt timed quizzes, evaluate their performance, and explore quiz rankings. The project combines a React and TypeScript frontend with a Java Servlet backend foundation and a MySQL database.

**Repository:** [java_project](https://github.com/advikbhardwaj0909-png/java_project)

## Table of Contents

- [Project Overview](#project-overview)
- [Objectives](#objectives)
- [Main Features](#main-features)
- [User Roles](#user-roles)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Database Design](#database-design)
- [Java Concepts](#java-concepts)
- [Getting Started](#getting-started)
- [Backend Setup](#backend-setup)
- [API Endpoints](#api-endpoints)
- [Security Considerations](#security-considerations)
- [Current Status and Limitations](#current-status-and-limitations)
- [Future Enhancements](#future-enhancements)
- [Team Members and Contributions](#team-members-and-contributions)
- [License](#license)

## Project Overview

JavaMaster provides an interface for practising Java through topic-based quizzes and a timed assessment workflow. The frontend includes a quiz catalog, a question interface, result-related screens, a leaderboard view, and administrative screens.

The separate Java backend contains servlet-based API functionality, scoring logic, database-access components, and a MySQL schema.

The project aims to bring Java practice, assessment, and question management into one organized platform.

> **Implementation note:** The frontend, backend foundation, database deployment, and live integration are separate parts of the project. Features that depend on a working database or backend connection must be verified in the target environment.

## Objectives

- Provide an interactive platform for Java programming practice.
- Offer a timed quiz interface with question navigation.
- Evaluate answers using scoring logic.
- Present assessment results and leaderboard information through the interface.
- Organize quiz questions by topics and categories.
- Demonstrate Java web development, database access, and unit testing.

## Main Features

### Quiz Interface

- Quiz catalog with curated assessment tracks.
- Custom topic-based quiz interface.
- Timed quiz screen and question navigation.
- Multiple-choice answer selection.
- Java code snippets displayed in quiz questions.
- Question flagging and review controls.
- Scoring logic with unit tests.

### Administration Interface

- Administrative dashboard and question-management screens.
- Admin sign-in interface.
- Question-bank management controls.

The availability of these administrative operations, including authentication and persistent database updates, must be verified against the deployed backend.

### Assessment and Rankings

- Result-related interface.
- Leaderboard interface.
- Database schema prepared for quiz attempts and leaderboard entries.

Saving quiz attempts, loading rankings from persistent database records, and complete end-to-end assessment workflows require backend implementation and integration verification.

## User Roles

The interface and project design cover three intended user roles:

| Role | Intended responsibilities |
|---|---|
| Admin | Manage platform content and administrative functions. |
| Quiz Creator | Prepare and maintain quiz content where creator workflows are implemented. |
| Participant | Take quizzes and review available results and rankings. |

Complete authentication, authorization, and role-specific access controls should not be considered operational until they have been implemented and tested.

## Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | Component-based user interface |
| TypeScript | Type checking and application development |
| Vite | Development server and frontend build |
| Tailwind CSS | User interface styling |
| Lucide React | Icons |
| Motion | UI animations |

### Backend

| Technology | Purpose |
|---|---|
| Java | Backend programming language |
| Apache Maven | Dependency management and build |
| Jakarta Servlets 6.0 | HTTP request handling |
| Apache Tomcat 10.1+ | Servlet container |
| JDBC | Database access |
| MySQL Connector/J | MySQL connectivity |
| HikariCP | Database connection pooling |
| Gson | JSON processing |
| JUnit 5 | Unit testing |

### Database

- Database: MySQL
- Database name: `quiz_platform`
- Schema file: `backend-java/schema.sql`

## System Architecture

The frontend and Java backend are maintained separately. The following diagram represents the intended application architecture; live connectivity must be verified independently.

```text
                    User
                     |
                     v
       React + TypeScript Frontend
                     |
                HTTP / JSON
                     |
                     v
             Apache Tomcat
              Java Servlets
                     |
                     v
               Service Layer
            Scoring and Logic
                     |
                     v
                 DAO Layer
              JDBC Operations
                     |
                     v
                HikariCP
             Connection Pool
                     |
                     v
                MySQL 8
              quiz_platform
```

The servlet layer handles HTTP requests, the service layer contains application logic, and the DAO layer is responsible for database operations.

## Project Structure

The repository uses a root-level React frontend and a separate Maven backend.

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
├── .env.example
├── .gitignore
├── index.html
├── metadata.json
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

This is a simplified view of the expected structure. Consult the actual repository for the complete file list.

## Database Design

The backend schema defines four main tables:

| Table | Purpose |
|---|---|
| `users` | Stores user account information and roles. |
| `questions` | Stores quiz questions and related question data. |
| `quiz_attempts` | Stores quiz attempt information and scores. |
| `leaderboard_entries` | Stores leaderboard score and ranking information. |

The exact columns, data types, constraints, and relationships are defined in [`backend-java/schema.sql`](backend-java/schema.sql).

The presence of these tables in the schema does not by itself confirm that all corresponding application workflows are connected to MySQL.

## Java Concepts

The backend codebase demonstrates or is structured around the following concepts. Refer to the actual source code and tests when explaining their implementation.

- **Encapsulation:** Organizing data and behaviour within classes.
- **Interfaces:** Defining contracts for services and database-access components.
- **Polymorphism:** Using interface-based implementations, including scoring logic.
- **Exception Handling:** Handling application and database errors.
- **JDBC:** Executing SQL operations from Java.
- **Servlets:** Handling HTTP requests.
- **DAO Pattern:** Separating database-access logic from application logic.
- **Connection Pooling:** Managing database connections with HikariCP.
- **Unit Testing:** Testing scoring logic using JUnit 5.
- **Collections:** Organizing question and application data using suitable Java collection types.

Only claim inheritance, generics, multithreading, synchronization, or other advanced concepts as implemented when the source code provides clear evidence.

## Getting Started

### Prerequisites

Install the following software:

- Git
- Node.js and npm
- Java Development Kit (JDK)
- Apache Maven
- MySQL Server
- Apache Tomcat 10.1+

The backend is intended for a Java 17-compatible environment. Use a JDK compatible with the project's Maven configuration and installed Tomcat version.

Verify the installations in Windows Command Prompt:

```bat
git --version
node --version
npm --version
java -version
mvn -version
mysql --version
```

### 1. Clone the Repository

```bash
git clone https://github.com/advikbhardwaj0909-png/java_project.git
cd java_project
```

### 2. Install Frontend Dependencies

Run the following command from the repository root:

```bash
npm install
```

### 3. Start the Frontend

```bash
npm run dev
```

Open the local URL printed by Vite in your terminal.

To create a production frontend build:

```bash
npm run build
```

To check TypeScript:

```bash
npx tsc --noEmit
```

These commands verify the frontend build and type checking. They do not verify that the Java backend is deployed or connected.

## Backend Setup

### 1. Configure MySQL

Start MySQL Server and create the database using the provided schema.

From the repository root, run in Windows Command Prompt:

```bat
mysql -u root -p < backend-java\schema.sql
```

Enter your local MySQL password when prompted.

Verify that the database tables exist:

```bat
mysql -u root -p -e "SHOW TABLES IN quiz_platform;"
```

If the schema import fails, inspect `backend-java/schema.sql` and the MySQL error message before proceeding.

### 2. Configure Database Credentials

Inspect the actual database configuration used by `DBConnectionManager.java`. The expected configuration location in the project documentation is:

`backend-java/src/main/resources/db.properties`

Confirm that this file exists and check which configuration properties the backend reads.

If the backend uses a properties file, configure the local database URL, username, and password using the exact property names expected by the code.

If the backend supports environment-variable overrides, Windows Command Prompt can set example values as follows:

```bat
set DB_URL=jdbc:mysql://localhost:3306/quiz_platform
set DB_USERNAME=root
set DB_PASSWORD=YOUR_MYSQL_PASSWORD
```

These environment variables work only if the implementation explicitly reads these names. Replace the example password with your local password.

**Security:** Never commit real passwords, database credentials, or API keys to GitHub.

### 3. Build and Test the Backend

From the repository root:

```bat
mvn -f backend-java\pom.xml clean test
```

To package the backend:

```bat
mvn -f backend-java\pom.xml clean package
```

If the build succeeds, the expected WAR file is:

```text
backend-java/target/javamaster-backend.war
```

The actual build result and test output should be checked in your environment.

### 4. Deploy to Apache Tomcat

1. Install and configure Apache Tomcat 10.1 or a compatible version.
2. Build the backend WAR using Maven.
3. Copy `javamaster-backend.war` into Tomcat's `webapps` directory.
4. Ensure MySQL is running and the database credentials are configured.
5. Start Tomcat using its `bin\catalina.bat` script.
6. Check the Tomcat logs for deployment or database errors.

The expected context path is:

```text
/javamaster-backend
```

Confirm the deployed context path and servlet URL mappings before testing the API.

## API Endpoints

The initial backend implementation identifies the following question endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/questions` | Retrieve quiz questions. |
| GET | `/api/questions?category=Core+OOP` | Retrieve questions filtered by category. |

After deploying the WAR locally, the expected test URL is:

```text
http://localhost:8080/javamaster-backend/api/questions
```

To test category filtering:

```text
http://localhost:8080/javamaster-backend/api/questions?category=Core+OOP
```

A successful response should return JSON question data according to the servlet implementation and available database records.

**Live API availability has not been confirmed by this documentation.** Test the deployed endpoints before describing them as operational.

Saving quiz attempts, updating persistent leaderboard data, and completing administrative actions require additional implementation and verification.

## Security Considerations

The following are recommended practices for a secure deployment:

- Never commit credentials or secrets.
- Use prepared statements for SQL queries.
- Validate incoming data on the server.
- Implement authentication and authorization for administrative operations.
- Restrict CORS to trusted origins.
- Avoid exposing correct answers before quiz submission.
- Use HTTPS and secure session handling in production.
- Handle database and application errors without exposing sensitive details.

These recommendations should not be interpreted as confirmation that every control has already been implemented.

## Current Status and Limitations

The project includes a React and TypeScript frontend and a Java backend foundation.

The development report records a successful Maven build and passing scoring unit tests in the development environment. These results should be confirmed using the current source code and test output.

The following areas still require verification in the target environment:

- MySQL connectivity and schema setup.
- Apache Tomcat deployment.
- Live frontend-to-backend communication.
- End-to-end administrator authentication.
- Persistent quiz attempt and score storage.
- Leaderboard data loaded from the database.
- Integration tests across the frontend, backend, and database.

Update this section as each item is implemented and tested.

## Future Enhancements

Potential improvements include:

- Complete user registration and authentication.
- Role-based access control.
- Persistent quiz attempts and scores in MySQL.
- A leaderboard based on stored results.
- Complete quiz creator and approval workflows.
- Integration tests and improved error handling.
- Secure application deployment.

## Team Members and Contributions

| S. No. | Name | Role | Contribution |
|---:|---|---|---|
| 1 | Manu Sharma | Team Leader | PPT Designing and Project Presentation |
| 2 | Sneha Gupta | Team Member | Database Design and Creation |
| 3 | Tusha Varshney | Team Member | Frontend Development and UI Design |
| 4 | Preeti Jha | Team Member | Backend Development and Java Integration |

### Team Collaboration

Our team worked collaboratively to develop JavaMaster, an online Java quiz and assessment platform. Each member contributed to a specific area of the project, including presentation design, database development, frontend implementation, and backend development.

Together, these contributions support the development of an organized and user-friendly Java learning and assessment platform.

## License

No license has been specified in this README. If you intend to distribute the project publicly, choose an appropriate open-source license and add the corresponding `LICENSE` file.
