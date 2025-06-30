import express from "express";
import User from "../models/user.js";
import multer from "multer";
import fs from "fs";
import path from "path";

const router = express.Router();

// Ensure uploads folder exists
const uploadDir = path.join("backend", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}


// Setup multer for image upload
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    // sanitize filename
    const safeName = file.originalname.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9.-]/g, "");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({ storage });

/**
 * GET user by phone
 * Example: GET /api/users/0771234567
 */
router.get("/:phone", async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.params.phone });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profileImageUrl = user.profileImage
      ? `${req.protocol}://${req.get("host")}${user.profileImage}`
      : null;

    res.json({
      _id: user._id,
      phone: user.phone,
      name: user.name,
      profileImage: profileImageUrl,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST create user with optional profile image
 * Example: POST /api/users
 * FormData: { phone, name, profileImage (file) }
 */
router.post("/", upload.single("profileImage"), async (req, res) => {
  const { phone, name } = req.body;

  try {
    let user = await User.findOne({ phone });
    if (user) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const profileImage = req.file ? `/uploads/${req.file.filename}` : null;


    user = new User({ phone, name, profileImage });
    await user.save();

    const profileImageUrl = profileImage
      ? `${req.protocol}://${req.get("host")}${profileImage}`
      : null;

    res.status(201).json({
      _id: user._id,
      phone: user.phone,
      name: user.name,
      profileImage: profileImageUrl,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT update user by ID with optional new profile image
 * Example: PUT /api/users/:id
 */
router.put("/:id", upload.single("profileImage"), async (req, res) => {
  const { name } = req.body;

  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.file) {
      // Delete old image if it exists
      if (user.profileImage) {
        const oldImagePath = path.join(".", user.profileImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      // Update with new image path
      user.profileImage = `uploads${req.file.filename}`;
    }

    if (name) {
      user.name = name;
    }

    await user.save();

    const profileImageUrl = user.profileImage
      ? `${req.protocol}://${req.get("host")}${user.profileImage}`
      : null;

    res.json({
      _id: user._id,
      phone: user.phone,
      name: user.name,
      profileImage: profileImageUrl,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
