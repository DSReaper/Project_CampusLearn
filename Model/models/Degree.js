class Degree {
    #degreeId;
    #degreeName;
    #nqfLevel;

    constructor({ degreeId = 0, degreeName = "", nqfLevel = "" } = {}) {
        this.#degreeId = degreeId;
        this.#degreeName = degreeName;
        this.#nqfLevel = nqfLevel;
    }

    // Behaviors
    addModule(moduleId) {}

    // Getters/Setters
    get degreeId() { return this.#degreeId; }
    set degreeId(degreeId) { this.#degreeId = degreeId; }

    get degreeName() { return this.#degreeName; }
    set degreeName(degreeName) { this.#degreeName = degreeName; }

    get nqfLevel() { return this.#nqfLevel; }
    set nqfLevel(nqfLevel) { this.#nqfLevel = nqfLevel; }
}

module.exports = Degree;
