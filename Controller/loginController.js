const { LoginService } = require("../Services/LoginService");

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const loginService = new LoginService();

    const role = await loginService.Validation(email);
    const student = await loginService.Verification(email, password);

    if (!student) {
      return res.status(401).json({ ok: false, message: "Incorrect password or email" });
    }

    // Check if the student is also a tutor
    const isTutor = await loginService.checkTutorStatus(student);
    const redirect = isTutor ? "/tutor/dashboard" : "/student/dashboard";

    return res.status(200).json({
      ok: true,
      message: "login",
      role: isTutor ? "tutor" : "student",
      redirect,
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};
