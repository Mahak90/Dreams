import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import redis from "../config/redis.js";
import {
  generateAccessToken,
  generateRefreshToken
} from "../utils/token.js";


// =======================================================
// REGISTER USER (Admin adds Principal / Principal adds Teacher/Student)
// =======================================================
export const register = async (req, res) => {
  try {
    const { name, email, password, role, school_id, classes, subjects } = req.body;

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      school_id,
      classes,
      subjects
    });

    return res.json({ success: true, user });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// =======================================================
// LOGIN USER (Token in cookie + redis)
// =======================================================

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token in redis (linked to user)
  await redis.set(
  `refresh:${user._id}`,
  refreshToken,
  "EX",
  60 * 60 * 24 * 30  // 30 days
);
    // Store refresh token in secure cookie
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    return res.json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        role: user.role,
        school_id: user.school_id
      }
    });

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message });
  }
};


// =======================================================
// REFRESH ACCESS TOKEN (Cookie + Redis validation)
// =======================================================

export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken)
      return res.status(403).json({ message: "No refresh token" });

    const decoded = jwt.verify(refreshToken, "08a5c43d0c80ebc15013fd0e958509b4");

    const storedToken = await redis.get(`refresh:${decoded.id}`);
    if (!storedToken || storedToken !== refreshToken)
      return res.status(403).json({ message: "Invalid refresh token" });

    const user = await User.findById(decoded.id);

    const newAccessToken = generateAccessToken(user);

    return res.json({
      success: true,
      accessToken: newAccessToken
    });

  } catch (err) {
    return res.status(401).json({ message: "Token expired or invalid" });
  }
};


// =======================================================
// LOGOUT USER (Delete refresh token + clear cookie)
// =======================================================



export const logout = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (userId) {
      await redis.del(`refresh:${userId}`);
    }

    res.clearCookie("refresh_token");

    res.json({ success: true, message: "Logged out successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




// =======================================================
// GET MY PROFILE
// =======================================================
export const getMyProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json({ success: true, user });
};

// =======================================================
// ADMIN → GET USERS BY ROLE
// =======================================================
export const getUsersByRole = async (req, res) => {
  const { role } = req.query;

  const users = await User.find({ role }).select("-password");
  res.json({ success: true, users });
};

// =======================================================
// PRINCIPAL → GET USERS OF SCHOOL
// =======================================================
export const getUsersBySchool = async (req, res) => {
  const school_id = req.user.school_id;

  const users = await User.find({ school_id }).select("-password");
  res.json({ success: true, users });
};

// =======================================================
// ADMIN → UPDATE USER
// =======================================================
export const updateUser = async (req, res) => {
  const updated = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  ).select("-password");

  res.json({ success: true, updated });
};

// =======================================================
// ADMIN → DELETE USER
// =======================================================
export const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "User deleted" });
};
