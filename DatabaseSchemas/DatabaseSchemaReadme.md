# Educational Database JSON Schemas
This repository contains a set of enhanced JSON Schemas that define the structure and validation rules for an educational institution's database system, based on the provided Entity-Relationship Diagram (ERD).

## Overview
These schemas implement a robust data model for managing lecturers, modules, classrooms, degrees, and clusters within an educational system. They enforce data integrity, consistency, and validation at the API level before data reaches the database.

## Schema Details:

### Core Entities:
- Lecturer - Represents teaching staff with validation for:
    - Unique lecturer numbers
    - Name length constraints
    - Positive integer IDs
- Module - Defines academic courses with:
    - Structured module codes 
    - Foreign key relationships to Cluster and Degree
    - Descriptive fields with length validation
- Classroom - Represents physical or virtual learning spaces:
    - Format validation for room names 
    - Integer identifier constraints
- Degree - Academic programs with:
    - Name validation
    - predefined levels 
- Cluster - Subject groups or departments:
    - Name and description constraints
    - Integer identifier validation

### Junction Tables:
Three many-to-many relationship tables:
- LectureModule - Links lecturers to modules they teach
- LecturerClassroom - Associates lecturers with classrooms
- LecturerCluster - Connects lecturers to subject clusters
All junction tables enforce foreign key constraints and prevent additional properties.

## Validation Features
These schemas implement comprehensive validation including:
- Data type enforcement
- Minimum/maximum values for integers
- String pattern matching with regular expressions
- Minimum/maximum length constraints
- Enumeration validation for predefined values
- Required field enforcement
- Prevention of additional properties