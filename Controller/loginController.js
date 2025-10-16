/*
    Email required -> client side
    Password required -> client side

    Email domain must be @belgiumcampus.ac.za -> server side
    Valid campus email and password -> server side
*/

const { loginService } = require('../Services/LoginService');

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    loginService.Validation(email)
    .then((loginService.Verification(email, password)).then((message) => {
        res.status(200).json({ message: message });
    }).catch((error) => {
        res.status(400).json({ error: error.message });
    }));
}

