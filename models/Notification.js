class Notification {
    #notificationID;

    constructor({ notificationID = 0 } = {}) {
        this.#notificationID = notificationID;
    }
    
    // Behaviors
    sendEmailNotification(userID, lecturerID, message) {}

    triggerPushNotification() {}

    // Getters / Setters
    get notificationID() { return this.#notificationID; }
    set notificationID(notificationID) { this.#notificationID = notificationID; }
}

module.exports = Notification;
