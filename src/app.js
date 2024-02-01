const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv").config();
const app = express();
// Routes
const userRoutes = require('./routes/userRoutes.js');
// DATABASE
const DB = require("./DAOs/config.js");
const PORT = process.env.PORT || 3001; // Default PORT

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/users', userRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
