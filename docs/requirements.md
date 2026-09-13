# Hospital Management System

## Project Objective

Develop a full-stack web application for managing patients,
doctors, and appointments using CRUD operations.

## Users

Hospital Staff
Administrator

## Core Entities

Patient
Doctor
Appointment

## Patient Features

Create patient
View patients
View individual patient
Update patient
Delete patient
Search patients

## Doctor Features

Create doctor
View doctors
View individual doctor
Update doctor
Delete doctor
Filter doctors by specialization

## Appointment Features

Create appointment
View appointments
View individual appointment
Update appointment
Delete/cancel appointment
Filter appointments

## Business Rules

Required fields must be validated.
Email must have a valid format.
Patient code must be unique.
Doctor code must be unique.
Appointment must reference an existing patient.
Appointment must reference an existing doctor.
A doctor cannot have conflicting appointments.

## Technology Stack

Frontend: React
Backend: Spring Boot
Language: Java
Database: MySQL
ORM: Spring Data JPA / Hibernate
Testing: JUnit, Mockito, Postman
Build Tool: Maven
Version Control: Git