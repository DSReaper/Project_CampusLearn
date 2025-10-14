// testStudentRepository.js
require('dotenv').config();
const studentRepo = require('./Repositories/StudentRepository');

(async () => {
  try {
    console.log(' Testing StudentRepository...');

    // initialise repository (connects to DB)
    await studentRepo.init();

    const db = studentRepo.dbConnection.getDatabase();

    // insert a test student
    await db.collection('students').insertOne({
      StudentID: 600992,
      FirstName: 'Jane',
      LastName: 'Doe',
      Email: 'jane.doe@test.com',
      Password:'123456',
      Status: 'Active',
      Online: false,
      DegreeID: 101,
      CreatedAt: new Date()
    });

    // fetch the student using your repository method
    const insertedStudent = await studentRepo.findByEmailAndPassword('jane.doe@test.com', '123456');
    console.log(' Inserted + Retrieved student:', insertedStudent);

    // Cleanup
    await db.collection('students').deleteOne({ Email: 'jane.doe@test.com' });
    console.log('Cleaned up test student');

  } catch (err) {
    console.error('❌ Repository test failed:', err);
  } finally {
    await studentRepo.dbConnection.disconnect();
  }
})();
