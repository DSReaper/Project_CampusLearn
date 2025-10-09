class Classroom {
    #classroomId;
    #classroomName;

    constructor({ classroomId = 0, classroomName = "" } = {}) {
        this.#classroomId = classroomId;
        this.#classroomName = classroomName;
    }

    // Behaviors
    allocateLecturer(lecturerId) {}

    // Getters/Setters
    get classroomId() { return this.#classroomId; }
    set classroomId(classroomId) { this.#classroomId = classroomId; }

    get classroomName() { return this.#classroomName; }
    set classroomName(classroomName) { this.#classroomName = classroomName; }
}

module.exports = Classroom;
