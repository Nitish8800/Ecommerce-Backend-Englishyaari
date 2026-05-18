const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./assets/swagger/swagger.json");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");

const connectDB = require("./config/db");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");
const { errors: celebrateErrors } = require("celebrate");

const app = express();

const requiredEnvVars = [
  "PORT",
  "NODE_ENV",
  "JWT_SECRET",
  "MONGODB_URI",
  "FRONTEND_URL"
];
const missingEnvVars = requiredEnvVars.filter((v) => !process.env[v]);
if (missingEnvVars.length > 0) {
  console.error(
    "❌ Missing required environment variables:",
    missingEnvVars.join(", ")
  );
  console.error("Please check your .env file");
  process.exit(1);
}

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://ecommerce-backend-englishyaari.onrender.com"
    : `http://localhost:${process.env.PORT || 5000}`;

swaggerSpec.servers = [
  {
    url: BASE_URL,
    description:
      process.env.NODE_ENV === "production"
        ? "Production Server"
        : "Local Server"
  }
];

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(
  express.json({
    limit: "10mb",
    strict: true
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb"
  })
);

if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(
      `${new Date().toISOString()} - ${req.method} ${req.originalUrl}`
    );

    next();
  });
}

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server App is working ....................... "
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.use(celebrateErrors());

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `🚀 Server running on ${BASE_URL}/api-docs`
      );
    });
  })
  .catch((err) => {
    console.error(
      "❌ Failed to connect to MongoDB. Server not started.",
      err
    );
    process.exit(1);
  });