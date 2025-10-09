class ChatRoom {
    #chatRoomId;
    #title;
    #description;
    #createdByTutorId;
    #moduleId;

    constructor({ chatRoomId = 0, title = "", description = "", createdByTutorId = 0, moduleId = 0 } = {}) {
        this.#chatRoomId = chatRoomId;
        this.#title = title;
        this.#description = description;
        this.#createdByTutorId = createdByTutorId;
        this.#moduleId = moduleId;
    }

    // Behaviors
    createMessage(body) {}
    addParticipant(studentId) {}

    // Getters/Setters
    get chatRoomId() { return this.#chatRoomId; }
    set chatRoomId(chatRoomId) { this.#chatRoomId = chatRoomId; }

    get title() { return this.#title; }
    set title(title) { this.#title = title; }

    get description() { return this.#description; }
    set description(description) { this.#description = description; }

    get createdByTutorId() { return this.#createdByTutorId; }
    set createdByTutorId(createdByTutorId) { this.#createdByTutorId = createdByTutorId; }

    get moduleId() { return this.#moduleId; }
    set moduleId(moduleId) { this.#moduleId = moduleId; }
}

module.exports = ChatRoom;
