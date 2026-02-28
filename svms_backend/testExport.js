import db from "./src/database/models/index.js";
import fs from "fs";

try {
  const { Requests, Counties, Districts, Clans, Towns, Villages, Categories, Users, Posts, Notifications, Documents } = db;
  let o = "Dump:\n";
  o += "Requests: " + !!Requests + "\n";
  o += "Counties: " + !!Counties + "\n";
  o += "Districts: " + !!Districts + "\n";
  o += "Clans: " + !!Clans + "\n";
  o += "Towns: " + !!Towns + "\n";
  o += "Villages: " + !!Villages + "\n";
  o += "Categories: " + !!Categories + "\n";
  o += "Users: " + !!Users + "\n";
  o += "Posts: " + !!Posts + "\n";
  o += "Notifications: " + !!Notifications + "\n";
  o += "Documents: " + !!Documents + "\n";
  fs.writeFileSync("db_export.txt", o);
} catch(e) {
  fs.writeFileSync("db_export.txt", "ERROR: " + e.message);
}
