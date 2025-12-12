const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 3000;

const PUBLIC_DIR = path.join(__dirname, "public");
const UPLOAD_DIR = path.join(__dirname, "upload_images");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const safe =
      Date.now() + "_" + file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    cb(null, safe);
  },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

app.use(express.json());
app.use(express.static(PUBLIC_DIR));
app.use("/upload_images", express.static(UPLOAD_DIR));

app.post("/upload", upload.array("images", 10), (req, res) => {
  try {
    const files = (req.files || []).map((f) => f.filename);
    res.json({ success: true, files });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, error: "Server error saving files" });
  }
});

app.listen(PORT, () => {
  console.log(` Click Fit server running at http://localhost:${PORT}`);
});
