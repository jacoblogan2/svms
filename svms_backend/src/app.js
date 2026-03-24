import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import fileUploader from "express-fileupload";
import cors from "cors";

import router from "./routers/index.js"; // Explicitly mention index.js

dotenv.config();

const app = express();

// ✅ Enable CORS — allow the frontend origin (from env) and credentials
const allowedOrigins = [
  process.env.FRONTEND_URL,            // production: https://svms-liberia.vercel.app
  "http://localhost:3000",              // local development
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true, // allows Authorization header
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.json());

app.use(fileUploader({
  useTempFiles: true,
  limits: { fileSize: 50 * 1024 * 1024 },
}));


// Test route for root
app.get("/", (req, res) => {
  res.json({ success: true, message: "SVMS API is running 🚀", version: "1.0.0" });
});

// Routes
app.use("/api/v1", router);


// ✅ 404 Handler for undefined routes
app.use((req, res) => {
  console.warn(`404 Not Found: ${req.method} ${req.url}`);
  res.status(404).json({ success: false, message: "Route not found" });
});

export default app;