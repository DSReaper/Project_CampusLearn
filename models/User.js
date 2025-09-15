// Information: Base class for Student and Tutor
class User {
    #userId;
    #firstName;
    #lastName;
    #email;

    constructor({ userId = 0, firstName = "", lastName = "", email = "" } = {}) {
        this.#userId = userId;
        this.#firstName = firstName;
        this.#lastName = lastName;
        this.#email = email;
    }

    // Behaviors
    login() {}
    logout() {}
    updateProfile() {}

    // Getters/Setters
    get userId() { return this.#userId; }
    set userId(userId) { this.#userId = userId; }

    get firstName() { return this.#firstName; }
    set firstName(firstName) { this.#firstName = firstName; }

    get lastName() { return this.#lastName; }
    set lastName(lastName) { this.#lastName = lastName; }

    get email() { return this.#email; }
    set email(email) { this.#email = email; }
}

module.exports = User;
