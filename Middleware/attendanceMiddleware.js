const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "attendance_signatures",
    allowed_formats: ["png", "jpg", "jpeg"],
    public_id: (req, file) => `signature_${Date.now()}_${req.body.staffName}`,
  },
});

// Initialize Multer with Cloudinary storage
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Validate file presence and type before upload
    if (!file) {
      return cb(new Error("No signature file provided"), false);
    }
    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.mimetype)) {
      return cb(
        new Error("Invalid file format. Only PNG and JPEG are allowed."),
        false
      );
    }
    cb(null, true);
  },
});

// Middleware to validate file presence before upload
const validateSignature = (req, res, next) => {
  try {
    // Check if the signature field exists in the FormData
    // console.log(req.file);
    // console.log(req.body);

    if (!req.body.signature && !req.file) {
      return res.status(400).json({
        error: "No signature file provided in the request",
      });
    }
    next();
  } catch (error) {
    console.error("Validation error:", error);
    res.status(500).json({
      error: "Failed to validate signature",
    });
  }
};

// Middleware to handle signature upload
const handleSignatureUpload = upload.single("signature");

// Middleware to process the uploaded signature
const processSignature = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "Signature file upload failed",
      });
    }

    // Store the Cloudinary URL in the signature field
    req.body.signature = req.file.path;
    next();
  } catch (error) {
    console.error("Error processing signature:", error);
    res.status(500).json({
      error: "Failed to process signature upload",
    });
  }
};

module.exports = { validateSignature, handleSignatureUpload, processSignature };
