const express = require("express");
const multer = require("multer");
const path = require("path");

// File upload folder
const UPLOAD_FOLDER = "./uploads/";

// define the storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_FOLDER);
  },
  filename: function (req, file, cb) {
    const fileExt = path.extname(file.originalname);
    const fileName = file.originalname
      .replace(fileExt, "")
      .toLowerCase()
      .split(" ")
      .join("-");
    cb(null, fileName + "-" + Date.now() + fileExt);
  },
});
// prepare the final multer upload object
var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000, // 1MB
  },
  fileFilter(req, file, cb) {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(undefined, true);
    } else {
      cb(new Error("File must be a image"));
    }
  },
});
const app = express();
// application router
app.post("/", upload.single("avatar"), (req, res) => {
  res.send("Hello World");
});

app.use((err, req, res, next) => {
  if (err) {
    if (err instanceof multer.MulterError) {
      err.message = "File size is too large. Allowed file size is 1MB";
    } else {
      res.status(400).send({ error: err.message });
    }
  } else {
    res.send("success");
  }
});
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
