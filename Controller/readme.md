## 1. Login Controller

### 📘 Introduction
The provided code is a Node.js module that handles user authentication and login requests. It utilizes **MongoDB** to store user information. The code is modular and scalable, making it easy to add new features or modify existing ones without disrupting overall functionality.

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
- Matches the given password with the password retrieved from the database.

#### 👥 User Retrieval
- Retrieves user data from MongoDB:
  - get User: Fetches a user by email and password.

---

### 📥 Parameters

- `req`: The HTTP request object, which contains the user's email and password.
- `res`: The HTTP response object, which is used to send a redirect or an error message.

---

### 🔁 Return Value

Returns a promise that resolves to an object with the following properties:

- `status`: A string indicating the status of the login attempt (`"success"` or `"failure"`).
- `redirectPath`: The path to redirect the user to if the login was successful. Only set if `status` is `"success"`.

---

### ✅ Preconditions

1. The client must send an email and password in the request body.
2. The email domain must match either `@belgiumcampus.ac.za` or `@student.belgiumcampus.ac.za`.
3. A valid campus email and password must be provided.

---

### 📤 Postconditions

1. If the login was successful, a redirect will be sent to the client.
2. If the login failed, an error message will be sent to the client.

---

### ⚠️ Exceptions

This function may throw the following exceptions:

- `Error`: If there is an error connecting to the database or finding the user.
- `TypeError`: If the request body does not contain an email or password.

---

### 📦 Dependencies

- `mongodb`

Install with:

```bash
npm install mongodb