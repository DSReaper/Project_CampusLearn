const bcrypt = require("bcrypt");
const StudentRepo = require("../Repositories/StudentRepository");

class LoginService {
  async Validation(email) {
    // domain rule
    if (!/@student\.belgiumcampus\.ac\.za$/i.test(email)) {
        throw new Error("Email must be @student.belgiumcampus.ac.za");
    }
    const student = await StudentRepo.findByEmail(email);
    if (!student) throw new Error("Account not found");
    // Return a role if you store one; else infer
    return student.Role || "student";
  }

  async Verification(email, password) {
    const student = await StudentRepo.findByEmail(email);
    if (!student) throw new Error("Invalid credentials");
    if (!student.PasswordHash) throw new Error("Account not set up correctly");

    const ok = await bcrypt.compare(password, student.PasswordHash);
    if (!ok) throw new Error("Invalid credentials");
    return "Login successful";
  }
}

module.exports = { LoginService };
