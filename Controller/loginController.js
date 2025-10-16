/*
    Email required -> client side
    Password required -> client side

    Email domain must be @belgiumcampus.ac.za -> server side
    Valid campus email and password -> server side
*/

const { loginService } = require('../Repositories/Stud');

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    loginService.Verification(email, password).then((message) => {
        if (message === "login") {
            res.status(200).json({ message: "Login successful" });
        } else {
            res.status(401).json({ message: message });
        }
    }).catch((error) => {
        res.status(500).json({ message: "Internal server error" });
    });
}

