class AIChatBot {
    #chatbotID;
    #chatHistory;         // list (array) of messages
    #confidenceThreshold; // float

    constructor({ chatbotID = 0, chatHistory = [], confidenceThreshold = 0.8 } = {}) {
        this.#chatbotID = chatbotID;
        this.#chatHistory = chatHistory;
        this.#confidenceThreshold = confidenceThreshold;
    }

    // Behaviors
    respondToQuery() {}
    escalateToTutor() {}

    // Getters / Setters
    get chatbotID() { return this.#chatbotID; }
    set chatbotID(chatbotID) { this.#chatbotID = chatbotID; }

    get chatHistory() { return this.#chatHistory; }
    set chatHistory(chatHistory) { this.#chatHistory = chatHistory; }

    get confidenceThreshold() { return this.#confidenceThreshold; }
    set confidenceThreshold(confidenceThreshold) { this.#confidenceThreshold = confidenceThreshold; }
}

module.exports = AIChatBot;
