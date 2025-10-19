const studentRepository = require("../Repositories/StudentRepository");

class LoginService {
  async Validation(email) {
    const lecturer_pattern = /^[^\s@]+@belgiumcampus\.ac\.za$/i;
    const student_pattern = /^[^\s@]+@student\.belgiumcampus\.ac\.za$/i;

    if (lecturer_pattern.test(email)) return "tutor"; // lecturers are tutors by default
    if (student_pattern.test(email)) return "student";

    throw new Error("Invalid email domain. Use a valid @belgiumcampus.ac.za address.");
  }

  async Verification(email, password) {
    const student = await studentRepository.findByEmailAndPassword(email, password);
    return student || null; // return student object if valid
  }

  async checkTutorStatus(student) {
    const isTutor = await studentRepository.isTutor(student.StudentID);
    return isTutor;
  }
}

module.exports = { LoginService };