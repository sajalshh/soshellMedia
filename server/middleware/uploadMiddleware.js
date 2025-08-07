// server/middleware/uploadMiddleware.js

const multer = require("multer");

// Configure multer to use memory storage
// This temporarily stores the file as a Buffer in RAM
const storage = multer.memoryStorage();

// Set up the multer instance with the storage configuration
const upload = multer({ storage: storage });

// We will use upload.single('image') in our routes
// 'image' must match the field name in the frontend form
module.exports = upload;
