/*
    Email required -> client side
    Password required -> client side

    Email domain must be @belgiumcampus.ac.za -> server side
    Valid campus email and password -> server side
*/

const { LoginService } = require('../Services/LoginService');

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    const loginService = new LoginService();

    try {
        const role = await loginService.Validation(email);

        const message = await loginService.Verification(email, password);

        res.status(200).json({ role: role, message: message });

    } catch (error) {
       res.status(500).json({ error: error.message }); 
    }
}

