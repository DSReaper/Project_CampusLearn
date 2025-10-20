const Module = require('../Model/Mongoose_Schema_models/Module');
const User = require('../Model/Mongoose_Schema_models/User');

exports.getSummary = async (req, res) => {
  try {
    // Fetch modules linked to the authenticated user
    const modules = await Module.find({ userId: req.user._id });

    // Calculate performance and progress (assumes utility functions exist)
    const performance = calculatePerformance(modules);
    const progress = calculateProgress(modules);

    res.status(200).json({ modules, performance, progress });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    // Fetch user by ID from token
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ notifications: user.notifications });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
