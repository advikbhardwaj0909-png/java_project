# JavaMaster — Online Java Quiz & Assessment Platform

JavaMaster is a web-based Java programming quiz platform designed to help students practise Java, attempt timed quizzes, and review their performance. The project combines a React and TypeScript frontend with a Java Servlet backend foundation and a MySQL database.

**Repository:** [java_project](https://github.com/advikbhardwaj0909-png/java_project)

## Table of Contents

- [Project Overview](#project-overview)
- [Objectives](#objectives)
- [Features](#features)
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
- [Team Members](#team-members)
- [License](#license)

## Project Overview

JavaMaster provides an interface for practising Java through topic-based quizzes and timed assessments.

The frontend includes a quiz catalog, a question interface, result screens, a leaderboard view, and administrative screens. The Java backend contains servlet-based API functionality, scoring logic, database-access components, and a MySQL schema.

The frontend and backend are separate parts of the project. Features that depend on live database connectivity or complete backend integration must be tested in the target environment.

## Objectives

- Provide an interactive platform for Java programming practice.
- Offer a timed quiz interface with question navigation.
- Evaluate answers using scoring logic.
- Organize questions by topics and categories.
- Present assessment results through the interface.
- Demonstrate Java web development, database access, and unit testing.

## Features

### Quiz Interface

- Quiz catalog with assessment tracks.
- Timed quiz interface and question navigation.
- Multiple-choice answer selection.
- Java code snippets in questions.
- Question flagging and review controls.
- Scoring logic with unit tests.

### Administration Interface

- Administrative dashboard and question-management screens.
- Admin sign-in interface.
- Question-bank management controls.

The administrative interface is present in the frontend. Complete authentication, authorization, and persistent database operations require implementation and verification.

### Assessment and Rankings

- Quiz result interface.
- Leaderboard interface.
- Database schema for questions, users, quiz attempts, and leaderboard entries.

Persistent quiz attempts and database-backed rankings should be considered incomplete until their backend workflows are connected and tested.

## Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | User interface |
| TypeScript | Type checking and application development |
| Vite | Development server and frontend build |
| Tailwind CSS | UI styling |
| Lucide React | Icons |
| Motion | UI animations |

### Backend

| Technology | Purpose |
|---|---|
| Java | Backend programming |
| Apache Maven | Dependency management and build |
| Jakarta Servlets 6.0 | HTTP request handling |
| Apache Tomcat 10.1+ | Servlet container |
| JDBC | Database access |
| MySQL Connector/J | MySQL connectivity |
| HikariCP | Database connection pooling |
| Gson | JSON processing |
| JUnit 5 | Unit testing |

### Database

- **Database:** MySQL
- **Database name:** `quiz_platform`
- **Schema file:** `backend-java/schema.sql`

## System Architecture

The following diagram represents the intended architecture. Verify the live connection between each layer before treating the complete flow as operational.

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
             Scoring Logic
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
                 MySQL
              quiz_platform
```

The servlet layer handles HTTP requests, the service layer contains application logic, and the DAO layer manages database operations.

## Project Structure

The repository contains a root-level React frontend and a separate Maven backend.

```text
java_project/
├── src/
│   ├── components/
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

This is a simplified structure. Consult the repository for the complete file list.

## Database Design

The schema defines four main tables:

| Table | Purpose |
|---|---|
| `users` | User account information and roles |
| `questions` | Quiz questions and related data |
| `quiz_attempts` | Quiz attempt information and scores |
| `leaderboard_entries` | Leaderboard score and ranking information |

The exact columns, constraints, and relationships are defined in [`backend-java/schema.sql`](backend-java/schema.sql).

The presence of a table in the schema does not confirm that its application workflow is fully implemented.

## Java Concepts

The backend codebase is structured around these concepts:

- **Encapsulation:** Organizing data and behaviour within classes.
- **Interfaces:** Defining contracts for services and database-access components.
- **Polymorphism:** Using interface-based implementations.
- **Exception handling:** Handling application and database errors.
- **JDBC:** Executing SQL operations from Java.
- **Servlets:** Handling HTTP requests.
- **DAO pattern:** Separating database-access logic from application logic.
- **Connection pooling:** Managing database connections with HikariCP.
- **Unit testing:** Testing scoring logic with JUnit 5.
- **Collections:** Organizing question and application data.

Explain each concept using the actual classes and methods in the repository. Do not claim advanced concepts such as multithreading or synchronization unless the code demonstrates them.

## Getting Started

### Prerequisites

Install the following software:

- Git
- Node.js and npm
- Java Development Kit (JDK)
- Apache Maven
- MySQL Server
- Apache Tomcat 10.1+

The backend is configured for a Java 17-compatible environment. Use a JDK supported by the Maven configuration.

### 1. Verify Your Installations

Open Windows Command Prompt and run:

```bat
git --version
node --version
npm --version
java -version
mvn -version
mysql --version
```

If a command is not recognized, install or configure the corresponding software before continuing.

### 2. Clone the Repository

If the repository is not already on your computer, run:

```bat
git clone https://github.com/advikbhardwaj0909-png/java_project.git
cd java_project
```

If you already have the project locally, open its existing folder instead of cloning it again.

### 3. Install Frontend Dependencies

Run these commands from the repository root:

```bat
npm install
```

### 4. Start the Frontend

```bat
npm run dev
```

Open the local URL printed by Vite in the terminal.

To create a production build:

```bat
npm run build
```

To check TypeScript:

```bat
npx tsc --noEmit
```

These commands verify the frontend build and type checking. They do not verify backend deployment or database integration.

## Backend Setup

### 1. Configure MySQL

Start MySQL Server and import the schema from the repository root:

```bat
mysql -u root -p < backend-java\schema.sql
```

Enter your local MySQL password when prompted.

Verify that the database tables exist:

```bat
mysql -u root -p -e "SHOW TABLES IN quiz_platform;"
```

If the import fails, inspect `backend-java/schema.sql` and the MySQL error message.

### 2. Configure Database Credentials

Inspect `DBConnectionManager.java` to confirm how database settings are loaded.

The configuration file used by the project may be located at:

`backend-java/src/main/resources/db.properties`

Use the exact property names expected by the implementation.

If the backend supports environment-variable overrides, Windows Command Prompt can set the following example values:

```bat
set DB_URL=jdbc:mysql://localhost:3306/quiz_platform
set DB_USERNAME=YOUR_MYSQL_USERNAME
set DB_PASSWORD=YOUR_MYSQL_PASSWORD
```

These variables work only if the backend explicitly reads these names. Replace the placeholders with your local configuration.

**Security:** Never commit real passwords, database credentials, or API keys to GitHub. For deployment, use a dedicated database account with only the permissions the application requires.

### 3. Build and Test the Backend

From the repository root, run:

```bat
mvn -f backend-java\pom.xml clean test
```

To package the backend:

```bat
mvn -f backend-java\pom.xml clean package
```

If packaging succeeds, the expected WAR file is:

```text
backend-java/target/javamaster-backend.war
```

Check the actual Maven output to confirm that the build and tests pass.

### 4. Deploy to Apache Tomcat

1. Install and configure Apache Tomcat 10.1 or a compatible version.
2. Build the backend WAR using Maven.
3. Copy `javamaster-backend.war` into Tomcat's `webapps` directory.
4. Ensure MySQL is running and the database credentials are configured.
5. Start Tomcat using its `bin\catalina.bat` script.
6. Check the Tomcat logs for deployment or database errors.

The expected application context path is:

```text
/javamaster-backend
```

Confirm the actual context path and servlet URL mappings before testing the API.

## API Endpoints

The initial backend API includes question retrieval endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/questions` | Retrieve questions |
| GET | `/api/questions?category=Core%20OOP` | Retrieve questions filtered by category |

After deploying the WAR locally, the expected test URL is:

```text
http://localhost:8080/javamaster-backend/api/questions
```

To test category filtering:

```text
http://localhost:8080/javamaster-backend/api/questions?category=Core%20OOP
```

These URLs assume the application is deployed under the expected context path and that the servlet mappings match. Test the deployed endpoints to confirm availability and response format.

Saving quiz attempts, updating persistent leaderboard data, and completing administrative operations require additional implementation and verification.

## Security Considerations

Before using the application beyond local development:

- Do not commit credentials or secrets.
- Use prepared statements for SQL queries.
- Validate incoming data on the server.
- Implement server-side authentication and authorization for administrative operations.
- Restrict CORS to trusted origins.
- Avoid exposing correct answers before quiz submission.
- Use HTTPS and secure session handling in production.
- Avoid returning internal database errors to clients.
- Use a dedicated database account instead of the MySQL root account.

These are security requirements and recommendations, not a claim that every control is already implemented.

## Current Status and Limitations

JavaMaster includes a React and TypeScript frontend and a Java backend foundation.

The development report records a successful Maven build and passing scoring unit tests in the development environment. Confirm these results against the current source code and test output.

The following areas require verification in the target environment:

- MySQL connectivity and schema setup.
- Apache Tomcat deployment.
- Live frontend-to-backend communication.
- Secure administrator authentication and authorization.
- Persistent quiz attempt and score storage.
- Leaderboard data loaded from database records.
- Integration tests across the frontend, backend, and database.

Update this section as implementation and testing progress.

## Future Enhancements

Potential improvements for subsequent development include:

- User registration and secure login.
- Server-side role-based access control.
- Persistent quiz attempts and scores in MySQL.
- A leaderboard based on stored results.
- Complete quiz creator and approval workflows.
- Quiz history and performance analytics.
- Additional integration tests and improved error handling.
- Secure application deployment.

## Team Members

| S. No. | Name | Role | Contribution |
|---|---|---|---|
| 1 | Manu Sharma | Team Leader | PPT Designing and Project Presentation |
| 2 | Sneha Gupta | Team Member | Database Design and Creation |
| 3 | Tusha Varshney | Team Member | Frontend Development and UI Design |
| 4 | Preeti Jha | Team Member | Backend Development and Java Integration |

### Team Collaboration

Our team worked collaboratively on JavaMaster. Contributions include presentation design, database
