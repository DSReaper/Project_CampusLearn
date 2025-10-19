const { LoginService } = require("../Services/LoginService");

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const loginService = new LoginService();

    const role = await loginService.Validation(email);
    const message = await loginService.Verification(email, password);

    res.status(200).json({ role, message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
