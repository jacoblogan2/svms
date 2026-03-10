import jwt from "jsonwebtoken";

export const generateVerificationToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

export const verifyVerificationToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
