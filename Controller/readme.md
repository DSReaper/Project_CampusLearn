## Login Controller

### 📘 Introduction
The provided code is a Node.js module that handles user authentication and login requests. It utilizes **MongoDB** to store user information and uses the **bcrypt** package for password hashing. The code is modular and scalable, making it easy to add new features or modify existing ones without disrupting overall functionality.

---

### 🧱 Code Structure

#### 🔧 Constants and Variables
- Defines constants and variables used throughout the module.
- Includes the `MongoDBConnection` class for establishing a connection to the MongoDB database.

#### 🚀 Exported Functions
- Exports several functions for use by other modules.
- `loginUser(req, res)` is the main entry point for authentication:
  - Validates user credentials.
  - Redirects users to their respective dashboard based on role.

#### 📧 Email Validation
- Defines email validation patterns:
  - `lecturer_pattern` and `student_pattern` are regular expressions matching BelgiumCampus email domains.

#### 🔐 Password Match
- Matches given password with password retrieved from database

#### 👥 User Retrieval
- Functions to retrieve user data from MongoDB:
  - `getUser: fetches a user by email and password.

---

### 📦 Dependencies
- `mongodb`

Install with:
```bash
npm install bcrypt mongodb
