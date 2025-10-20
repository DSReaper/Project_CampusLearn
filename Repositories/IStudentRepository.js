class IStudentRepository{
    async findByEmailAndPassword(email,password){
        throw new Error("Method not implemented");
    }
    async findByEmail(email){
        throw new Error("Method not implemented")
    }
}

module.exports=IStudentRepository;
