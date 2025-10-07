class CampusMap {
    #mapID;

    constructor({ mapID = 0 } = {}) {
        this.#mapID = mapID;
    }

    // Behaviors
    updateMap() {}
    zoomMap() {}

    // Getters / Setters
    get mapID() { return this.#mapID; }
    set mapID(mapID) { this.#mapID = mapID; }
}

module.exports = CampusMap;
