const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv").config();

// Aplication config
const app = express();

// Routes
const userRoutes = require("./routes/userRoutes.js");
const postRoutes = require("./routes/postRoute.js");
const notiicationsRoute = require("./routes/notificationRoute.js");
const commentsRoute = require("./routes/commentRoute.js");
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
// DATABASE
const DB = require("./persistence/config.js");

const PORT = process.env.PORT || 3001; // Default PORT
const swaggerDocument = YAML.load('documentation-api.yaml');
// Middleware
app.use(cors());
app.use(bodyParser.json());
// Middleware para servir la documentación de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notiicationsRoute);
app.use("/api/comments", commentsRoute);

// Start server
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
