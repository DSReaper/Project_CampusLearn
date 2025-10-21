const jwt = require("jsonwebtoken");
const { LoginService } = require("../Services/LoginService");

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const loginService = new LoginService();

    const role = await loginService.Validation(email);
    const verificationResult = await loginService.Verification(email, password);

    if (verificationResult !== "login") {
      return res.status(401).json({ message: verificationResult });
    }

    // Generate JWT token
    const token = jwt.sign(
      { email, role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ role, message: "Logged in" }).cookie("token", token, {
      httpOnly: true,
      secure: true, // only over HTTPS
      sameSite: "Strict",
      maxAge: 3600000 // 1 hour
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};