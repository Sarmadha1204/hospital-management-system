# Hospital Management System - Copilot Instructions

## Project Overview

This project is a full-stack Hospital Management System.

The system manages:
Patients
Doctors
Appointments

The primary users are:
Hospital Staff
Administrator

The application is being developed as a student CRUD web application.

## Technology Stack

### Frontend
React
JavaScript
HTML
CSS

### Backend
Java
Spring Boot
Spring Data JPA
Hibernate
Maven

### Database
MySQL

### Testing
JUnit
Mockito
Postman

### Version Control
Git
GitHub

## Backend Architecture

Follow this layered architecture:

Controller
    ↓
Service
    ↓
Repository
    ↓
Database

Use the following package structure where appropriate:

controller
service
repository
entity
dto
exception
config

### Controller Layer

Controllers must:
Expose REST APIs.
Handle HTTP requests and responses.
Validate request input where appropriate.
Delegate business logic to the service layer.
Avoid containing business logic.

Use appropriate HTTP methods:
GET for retrieving data
POST for creating data
PUT for updating data
DELETE for deleting data

Use appropriate HTTP status codes.

### Service Layer

Services must:
Contain business logic.
Coordinate operations between controllers and repositories.
Validate business rules.
Handle relationships between entities.
Keep controllers thin.

### Repository Layer

Repositories must:
Use Spring Data JPA.
Handle database access.
Avoid placing business logic in repositories.

Prefer Spring Data JPA derived queries when they are sufficient.

## Entities

The main entities are:

Patient
Doctor
Appointment

Use JPA annotations appropriately.

Primary keys should use generated database IDs.

Use relationships carefully:
One Patient can have many Appointments.
One Doctor can have many Appointments.
Each Appointment belongs to one Patient.
Each Appointment belongs to one Doctor.

## DTOs

Use DTOs for API request and response models where appropriate.

Do not expose internal entity implementation unnecessarily through REST APIs.

Keep API models separate from persistence models when it improves maintainability.

## Validation

Use Jakarta Bean Validation where appropriate.

Examples:
Required fields must not be empty.
Email must have a valid format.
Patient code must be unique.
Doctor code must be unique.
Appointment must reference an existing patient.
Appointment must reference an existing doctor.
A doctor cannot have conflicting appointments.
Patient date of birth must not be a future date.

Return clear validation error messages.

## Exception Handling

Implement centralized exception handling where appropriate.

Use a consistent error response format.

Handle common cases such as:
Resource not found
Duplicate patient code
Duplicate doctor code
Invalid request data
Appointment conflict
Database-related errors

Do not expose sensitive internal exception details to API clients.

## REST API Design

Use clear and consistent endpoint naming.

Suggested endpoints:

/api/patients
/api/doctors
/api/appointments

Use RESTful conventions.

Examples:

GET    /api/patients
GET    /api/patients/{id}
POST   /api/patients
PUT    /api/patients/{id}
DELETE /api/patients/{id}

Follow the same pattern for doctors and appointments.

## Database

The database name is:

hospital_management

The database contains the following main tables:

patients
doctors
appointments

Use foreign keys for relationships.

Do not hard-code database records in application code.

Use JPA/Hibernate for persistence.

## Business Rules

Always preserve these business rules:

1. Patient code must be unique.
2. Doctor code must be unique.
3. Required fields must be validated.
4. Email must have a valid format.
5. An appointment must reference an existing patient.
6. An appointment must reference an existing doctor.
7. A doctor cannot have conflicting appointments.
8. A patient's date of birth cannot be in the future.

Do not remove or weaken these rules without explicit approval.

## Frontend Guidelines

Use React components with clear responsibilities.

Keep:
UI components
API communication
application logic

reasonably separated.

Use reusable components where appropriate.

The frontend must communicate with the backend through REST APIs.

Do not directly access the MySQL database from the frontend.

Handle:
loading states
errors
validation messages
successful operations

The UI should be responsive and simple to use.

## Code Quality

Write clean, readable and maintainable code.

Prefer:
meaningful class names
meaningful variable names
small focused methods
single responsibility
reusable components
appropriate comments only when necessary

Avoid:
unnecessary complexity
duplicate code
hard-coded values
unused imports
unused variables
overly complicated abstractions

Do not introduce additional frameworks or libraries unless they are necessary and explicitly approved.

## Testing

Backend business logic should have unit tests using JUnit and Mockito where appropriate.

Test important scenarios including:
successful CRUD operations
validation failures
resource not found
duplicate codes
appointment conflicts
invalid patient/doctor references

API behavior can be verified using Postman.

Frontend components and important user flows should also be tested where practical.

## Security

Do not hard-code:
passwords
database credentials
API keys
tokens
secrets

Sensitive configuration should use environment variables or appropriate configuration mechanisms.

Never commit secrets to GitHub.

## Git Guidelines

Make small, meaningful commits.

Use descriptive commit messages.

Examples:

feat: add patient CRUD APIs
feat: add doctor management
feat: add appointment conflict validation
fix: handle duplicate patient code
test: add patient service tests
docs: update database design

Do not commit:
target/
node_modules/
.env files
secrets
generated build files

## Copilot Behavior

Before making significant changes:

1. Understand the existing project structure.
2. Review relevant requirements and database design.
3. Explain the proposed approach.
4. Make the smallest appropriate change.
5. Avoid modifying unrelated files.
6. Follow the existing architecture.
7. Identify potential issues or assumptions.
8. Suggest tests for the implemented functionality.

Do not generate large amounts of code unnecessarily.

Do not create new dependencies unless required.

Do not change the technology stack without explicit approval.

When requirements are unclear, ask for clarification instead of making major assumptions.

When fixing a bug, identify the root cause before changing the code.

Always preserve existing working functionality when adding new features.