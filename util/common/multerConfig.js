const multer = require("multer");
const path = require("path");

// Configure storage to save files with original name and extension
const storage = multer.diskStorage({
    destination: "tmp/csv/",
    filename: (req, file, cb) => {
        console.log("📂 Uploading file:", file.originalname);
        cb(null, file.originalname); // Save with original filename
    }
});

const upload = multer({ storage: storage });

module.exports = upload;