const User = require("./User");

class Student extends User {
    #studentNo;
    #status;   // e.g. "Active" | "Suspended" | "Inactive"
    #online;

    constructor({ studentNo = "", status = "Active", online = false, ...base } = {}) {
        super(base);
        this.#studentNo = studentNo;
        this.#status = status;
        this.#online = online;
    }

    // Behaviors
    register() {}
    uploadMaterial(material /* LearningMaterial */) {}

    // Getters/Setters
    get studentNo() { return this.#studentNo; }
    set studentNo(studentNo) { this.#studentNo = studentNo; }

    get status() { return this.#status; }
    set status(status) { this.#status = status; }

    get online() { return this.#online; }
    set online(online) { this.#online = online; }
}

module.exports = Student;
