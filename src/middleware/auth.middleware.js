import jwt from "jsonwebtoken";
import env_config from "../config/env.config.js";

export const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token)
      return res.status(401).json({ message: "Access token missing" });

    const decoded = jwt.verify(token, env_config.ACCESS_TOKEN_SECRET);

    req.user = decoded;
    next();

  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
