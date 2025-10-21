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


    res.status(200).json({ role, message: "Logged in" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};