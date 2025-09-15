class Cluster {
    #clusterId;
    #name;
    #description;

    constructor({ clusterId = 0, name = "", description = "" } = {}) {
        this.#clusterId = clusterId;
        this.#name = name;
        this.#description = description;
    }

    // Behaviors
    ClusterModules() {}
    listClusters() {}

    // Getters/Setters
    get clusterId() { return this.#clusterId; }
    set clusterId(v) { this.#clusterId = v; }

    get name() { return this.#name; }
    set name(v) { this.#name = v; }

    get description() { return this.#description; }
    set description(v) { this.#description = v; }
}

module.exports = Cluster;
