class LearningMaterial {
    #materialId;
    #type;       // "Link" | "PDF" | "Video" | "Note" | "Image"
    #title;
    #url;
    #uploadedAt;

    constructor({ materialId = 0, type = "Link", title = "", url = "", uploadedAt = new Date() } = {}) {
        this.#materialId = materialId;
        this.#type = type;
        this.#title = title;
        this.#url = url;
        this.#uploadedAt = uploadedAt;
    }

    // Behaviors
    upload() {}
    updateMaterial() {}

    // Getters/Setters
    get materialId() { return this.#materialId; }
    set materialId(materialId) { this.#materialId = materialId; }

    get type() { return this.#type; }
    set type(type) { this.#type = type; }

    get title() { return this.#title; }
    set title(type) { this.#title = type; }

    get url() { return this.#url; }
    set url(url) { this.#url = url; }

    get uploadedAt() { return this.#uploadedAt; }
    set uploadedAt(uploadedAt) { this.#uploadedAt = this.#uploadedAt; }
}

module.exports = LearningMaterial;