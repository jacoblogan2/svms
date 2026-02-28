import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import fileUploader from "express-fileupload";
import cors from "cors";

import router from "./routers/index.js"; // Explicitly mention index.js

dotenv.config();

const app = express();

// ✅ Enable CORS with frontend origin and credentials
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true, // allows Authorization header
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.json());

app.use(fileUploader({
  useTempFiles: true,
  limits: { fileSize: 50 * 1024 * 1024 },
}));

// Routes
app.use("/api/v1", router);

export default app;