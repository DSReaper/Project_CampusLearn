class Module {
  #moduleId;
  #moduleNo;
  #moduleName;
  #description;

  constructor({ moduleId = 0, moduleNo = "", moduleName = "", description = "" } = {}) {
    this.#moduleId = moduleId;
    this.#moduleNo = moduleNo;
    this.#moduleName = moduleName;
    this.#description = description;
  }

  // Behaviors
  listModules() {}

  // Getters/Setters
  get moduleId() { return this.#moduleId; }
  set moduleId(moduleId) { this.#moduleId = moduleId; }

  get moduleNo() { return this.#moduleNo; }
  set moduleNo(moduleNo) { this.#moduleNo = moduleNo; }

  get moduleName() { return this.#moduleName; }
  set moduleName(moduleName) { this.#moduleName = this.#moduleName; }

  get description() { return this.#description; }
  set description(description) { this.#description = description; }
}

module.exports = Module;
