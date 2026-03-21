// Vercel serverless entry point
// Uses @babel/register to transpile ES module syntax at runtime
const path = require("path");

require("@babel/register")({
  presets: [["@babel/preset-env", { targets: { node: "18" } }]],
  plugins: ["babel-plugin-add-module-exports"],
  only: [path.resolve(__dirname, "../src")],
});

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

// Import the Express app — note: ../src because this file lives in api/
const app = require("../src/app.js");

// Export for Vercel serverless
module.exports = app;
