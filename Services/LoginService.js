const { studentRepository } = require('../Repositories/StudentRepository');

class loginService {
    constructor(parameters) {
        
    }

    async Validation(email) {
        //patterns for email validation
        const lecturer_pattern = /^[^\s@]+@belgiumcampus\.ac\.za$/;
        const student_pattern = /^[^\s@]+@student.belgiumcampus\.ac\.za$/;
 
 
        //Check if email matches either pattern amnd identify user type
        let role = null;
        if (lecturer_pattern.test(email)) {
            role = 'tutor';
        } else if (student_pattern.test(email)) {
            role = 'student';
        } else {
            return ('Invalid email domain. Please use a @belgiumcampus.ac.za or @student.belgiumcampus.ac.za email.');
        }
    }

    async Verification(email, password) {
        if (studentRepository.findByEmailAndPassword(email, password) == null) {
            return "Incorrect password or email";
        }
        else{
            return "login"
        }
    }
}
 
module.exports = { loginService };