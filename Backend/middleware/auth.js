import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "yoursecretkey";

export default function (req, res, next) {
  console.log("Headers received:", req.headers);
  
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token" });
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}