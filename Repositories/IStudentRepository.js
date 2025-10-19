class IStudentRepository {
  async init() {
    throw new Error("Not implemented");
  }
  async findByEmail(email) {
    throw new Error("Not implemented");
  }
  async createStudent(doc) {
    throw new Error("Not implemented");
  }
}
module.exports = IStudentRepository;
