# 🎓 College Management System (Backend APIs)

## 📝 About The Project
This repository contains the **Backend APIs** for a College Management System built with **Spring Boot**. The primary focus of this phase was building a robust, relational, and scalable backend architecture to handle core college data seamlessly. 

The system currently handles complex relational mappings and ensures clean API responses with centralized exception handling.

## 🚀 Current Features (Backend)
*   **Comprehensive Data Modeling:** Mapped 10+ core entities including Student, Teacher, Department, Course, Attendance, Result, Notice, and Fees.
*   **Relational Mapping:** Implemented complex JPA relationships (`@OneToMany`, `@ManyToOne`) with proper lazy fetching.
*   **Data Integrity:** Applied unique constraints (e.g., Email, ISBN, Receipt Number) and column configurations to maintain database health.
*   **Global Exception Handling:** Configured `@ControllerAdvice` and custom `ResourceNotFoundException` to ensure clean, standardized `404 Not Found` JSON responses instead of server crashes.
*   **RESTful APIs:** Complete CRUD (Create, Read, Update, Delete) endpoints successfully tested via Postman.

## 🛠️ Tech Stack
*   **Language:** Java
*   **Framework:** Spring Boot, Spring Web
*   **Data Access:** Spring Data JPA, Hibernate
*   **Database:** MySQL
*   **Tools:** Lombok, Postman (for API Testing)

## 🚧 Upcoming Features
*   **Frontend Integration:** Building a complete, interactive user interface using **Angular**.
*   **Security:** Implementing **Spring Security** with **JWT (JSON Web Token)** for user authentication and role-based authorization.
*   **API Documentation:** Integrating **Swagger (OpenAPI)** for interactive API docs.
