require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const {
  validateSignature,
  handleSignatureUpload,
  processSignature,
} = require("./Middleware/attendanceMiddleware");
const Attendance = require("./Model/Attendance");

const connectToDB = require("./db");

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.post(
  "/api/attendance/submitAttendance",
  handleSignatureUpload, // First parse the multipart/form-data
  validateSignature, // Now validate req.body and req.file
  processSignature,
  async (req, res) => {
    try {
      const { driverName, driverEmail, staffName, signature } = req.body;

      if (!driverName || !driverEmail || !staffName || !signature) {
        return res
          .status(400)
          .send({ error: "Please provide the required fields" });
      }

      const attendance = await Attendance.create({
        driverName,
        driverEmail,
        staffName,
        signature,
      });

      return res.status(201).json({
        message: "Attendance submitted successfully",
        data: attendance,
      });
    } catch (ex) {
      console.log(ex);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.get("/api/attendance/getAttendance", async (req, res) => {
  try {
    const attendences = await Attendance.find();
    return res.status(200).json({ data: attendences });
  } catch (ex) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = 5000;

connectToDB();
app.listen(PORT, () => console.log(`Server is running on PORT : ${PORT}`));
