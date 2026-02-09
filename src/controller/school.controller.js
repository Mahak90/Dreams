import School from "../models/school.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

// =======================================================
// CREATE SCHOOL (Admin only)
// =======================================================
export const createSchool = async (req, res) => {
  try {
    const {
      school_name, board, medium, number_of_students,
      city, state, principal_name, principal_number, address,
      pin_code, principal_email, principal_password
    } = req.body;

    // 1. Check if Principal Email is already registered
    if (principal_email) {
      const existingUser = await User.findOne({ email: principal_email });
      if (existingUser) {
        return res.status(400).json({ message: "Principal email already exists as a user." });
      }
    }

    // 2. Create School
    const school = await School.create({
      school_name, board, medium, number_of_students,
      city, state, principal_name, principal_number, address,
      pin_code
    });

    // 3. Create Principal User if credentials provided
    if (principal_email && principal_password) {
      const hashedPassword = await bcrypt.hash(principal_password, 10);

      await User.create({
        name: principal_name,
        email: principal_email,
        password: hashedPassword,
        role: "principal",
        school_id: school._id
      });
    }

    return res.status(201).json({
      success: true,
      school: {
        id: school._id,
        school_name: school.school_name,
        // ... (rest returned as needed, or just school object)
        ...school.toObject()
      },
      message: "School and Principal account created successfully"
    });
  } catch (err) {
    console.error("Create School Error:", err);
    res.status(500).json({ message: err.message });
  }
};


// =======================================================
// GET ALL SCHOOLS (Admin only)
// =======================================================
export const getAllSchools = async (req, res) => {
  try {
    const { state } = req.query;
    const filter = {};
    if (state) {
      filter.state = { $regex: state, $options: "i" };
    }
    const schools = await School.find(filter).lean();
    console.log("Found schools count:", schools ? schools.length : 0);

    const formatted = (schools || []).map((s) => ({
      id: s._id,
      school_name: s.school_name,
      board: s.board,
      medium: s.medium,
      city: s.city,
      state: s.state,
      principal_name: s.principal_name,
      principal_number: s.principal_number,
      address: s.address,
      pin_code: s.pin_code,
    }));

    res.json({ success: true, schools: formatted });
  } catch (err) {
    console.error("CRITICAL ERROR in getAllSchools:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


// =======================================================
// GET SCHOOL BY ID
// =======================================================
export const getSchoolById = async (req, res) => {
  try {
    const school = await School.findById(req.params.id);
    if (!school) return res.status(404).json({ message: "School not found" });
    res.json({ success: true, school });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================================================
// UPDATE SCHOOL (Admin only)
// =======================================================
export const updateSchool = async (req, res) => {
  try {
    const school = await School.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!school) return res.status(404).json({ message: "School not found" });
    res.json({ success: true, school });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================================================
// DELETE SCHOOL (Admin only)
// =======================================================
export const deleteSchool = async (req, res) => {
  try {
    const school = await School.findByIdAndDelete(req.params.id);
    if (!school) return res.status(404).json({ message: "School not found" });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
