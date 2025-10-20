const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema({
  moduleId: {
    type: Number,
    default: 0
  },
  moduleNo: {
    type: String,
    required: true
  },
  moduleName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ""
  }
});

// Optional behavior: list all modules
moduleSchema.statics.listModules = async function () {
  return await this.find({});
};

module.exports = mongoose.model("Module", moduleSchema);