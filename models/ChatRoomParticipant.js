class ChatRoomParticipant {
    #role;       // "Owner" | "Member" | "Moderator"
    #joinedAt;   // Date

    constructor({ role = "Member", joinedAt = new Date() } = {}) {
        this.#role = role;
        this.#joinedAt = joinedAt;
    }

    // Behaviors
    setRole(role) { this.#role = role; }
    leaveChatRoom() {}
    joinChatRoom() {}

    // Getters/Setters
    get role() { return this.#role; }
    get joinedAt() { return this.#joinedAt; }
    set joinedAt(joinedAt) { this.#joinedAt = joinedAt; }
}

module.exports = ChatRoomParticipant;
