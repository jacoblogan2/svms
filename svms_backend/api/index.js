// Vercel serverless entry point
// Uses @babel/register to transpile ES module syntax at runtime
require("@babel/register")({
  presets: [["@babel/preset-env", { targets: { node: "18" } }]],
  plugins: ["babel-plugin-add-module-exports"],
});
require("dotenv").config();

// Import the Express app (now transpiled by babel/register)
const app = require("./src/app.js");

// Export for Vercel serverless
module.exports = app;
