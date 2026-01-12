import jwt from "jsonwebtoken";
import env_config from "../config/env.config.js";

// Access Token → Short life (15m), full payload (id, role, school_id)
export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      school_id: user.school_id
    },
    env_config.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
};

// Refresh Token → Long life (30d), minimal payload
export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    env_config.REFRESH_TOKEN_SECRET,
    { expiresIn: "30d" }
  );
};
