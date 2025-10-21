const { LoginService } = require("../Services/LoginService");

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const loginService = new LoginService();

    const student = await loginService.Verification(email, password);

    if (!student) {
      return res.status(401).json({ ok: false, message: "Incorrect password or email" });
    }

    // ✅ SET SESSION DATA - Only student logic
    req.session.user = {
      _id: student._id, // MongoDB ObjectId
      id: student.StudentID, // Numeric StudentID
      firstName: student.FirstName,
      lastName: student.LastName,
      email: student.Email,
    };

    req.session.userId = student._id ? student._id.toString() : student.StudentID.toString();

    console.log('✅ Session set for user:', req.session.user);

    return res.status(200).json({
      ok: true,
      message: "Login successful",
      redirect: "/student/dashboard", // Always redirect to student dashboard
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
};