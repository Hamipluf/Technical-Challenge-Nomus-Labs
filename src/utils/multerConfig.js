const multer = require("multer");
// Configuration de Multer
const storage = multer.memoryStorage(); // Store the image in memory to facilitate its loading in S3.
const upload = multer({ storage });

module.exports = upload;
