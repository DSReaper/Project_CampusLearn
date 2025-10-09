// Information only – no behaviour
class Lecturer {
    #lecturerId;
    #lecturerNo;
    #firstName;
    #lastName;
    #email;

    constructor({ lecturerId = 0, lecturerNo = "", firstName = "", lastName = "", email = "" } = {}) {
        this.#lecturerId = lecturerId;
        this.#lecturerNo = lecturerNo;
        this.#firstName = firstName;
        this.#lastName = lastName;
        this.#email = email;
    }

    // Getters/Setters
    get lecturerId() { return this.#lecturerId; }
    set lecturerId(lecturerId) { this.#lecturerId = lecturerId; }

    get lecturerNo() { return this.#lecturerNo; }
    set lecturerNo(lecturerNo) { this.#lecturerNo = lecturerNo; }

    get firstName() { return this.#firstName; }
    set firstName(firstName) { this.#firstName = firstName; }

    get lastName() { return this.#lastName; }
    set lastName(lastName) { this.#lastName = lastName; }

    get email() { return this.#email; }
    set email(email) { this.#email = email; }
}

module.exports = Lecturer;
