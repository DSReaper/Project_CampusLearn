const bcrypt = require("bcrypt");
const studentRepository = require("../Repositories/StudentRepository");

exports.resetPasswordController = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword)
      return res.status(400).json({ ok: false, message: "Missing fields" });

    await studentRepository.conn.connect();
    const db = studentRepository.conn.getDatabase();

    const hashed = await bcrypt.hash(newPassword, 10);
    const result = await db
      .collection("students")
      .updateOne({ Email: email }, { $set: { Password: hashed } });

    if (result.matchedCount === 0)
      return res.status(404).json({ ok: false, message: "Email not found" });

    res.status(200).json({ ok: true, message: "Password updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Internal server error" });
  }
};
