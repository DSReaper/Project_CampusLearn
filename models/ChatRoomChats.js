class ChatRoomChats {
    #chatId;
    #body;
    #createdAt;

    constructor({ chatId = 0, body = "", createdAt = new Date() } = {}) {
        this.#chatId = chatId;
        this.#body = body;
        this.#createdAt = createdAt;
    }

    // Behaviors
    sendMessage() {}
    attachMaterial(materialId) {}
    DisplayMessages() {}
    
    // Getters/Setters
    get chatId() { return this.#chatId; }
    set chatId(chatId) { this.#chatId = chatId; }

    get body() { return this.#body; }
    set body(body) { this.#body = body; }

    get createdAt() { return this.#createdAt; }
    set createdAt(createdAt) { this.#createdAt = createdAt; }
}

module.exports = ChatRoomChats;
