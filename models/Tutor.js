const Student = require("./Student");

class Tutor extends Student {
    #tutorId;

    constructor({ tutorId = 0, ...student } = {}) {
        super(student);
        this.#tutorId = tutorId;
    }

    // Behaviors
    createChatRoom(moduleId, title, description) {}
    approveMaterial(materialId) {}
    respondToStudent(questionId) {}

    // Getters/Setters
    get tutorId() { return this.#tutorId; }
    set tutorId(tutorId) { this.#tutorId = tutorId; }
}

module.exports = Tutor;
