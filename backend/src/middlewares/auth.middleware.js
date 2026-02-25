import jwt from "jsonwebtoken";
import "dotenv/config";


export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer')) return res.status(401).json({ message: "Missing token" });

  const token = authHeader.split(" ")[1];
  
  if (!token) return res.status(401).json({ message: "Malformed token" });
  

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};