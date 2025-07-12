const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  driverName: {
    type: String,
    required: true,
  },
  driverEmail: {
    type: String,
    required: true,
  },
  staffName: {
    type: String,
    required: true,
  },
  signature: {
    type: String,
    required: true, // stores either base64 or a Cloudinary URL
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Attendance", AttendanceSchema);
