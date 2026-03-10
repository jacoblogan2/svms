import jwt from "jsonwebtoken";
import db from "../database/models/index.js";

const getModels = () => {
  const { Users } = db;
  return { Users };
};

export const verifyEmail = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ success: false, message: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { Users } = getModels();

    const user = await Users.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(200).json({ success: true, message: "Email already verified" });
    }

    await user.update({ isVerified: true });

    return res.status(200).json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.error("Error in verifyEmail:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ success: false, message: "Verification link expired" });
    }
    return res.status(400).json({ success: false, message: "Invalid or expired token" });
  }
};
