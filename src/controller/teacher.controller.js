import Teacher from "../models/teacher.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

// =======================================================
// ADD TEACHER (Admin/Principal)
// =======================================================
export const addTeacher = async (req, res) => {
  try {
    const { name, email, password, classes, subjects, is_class_teacher, class_teacher_for, school_id } = req.body;

    // Determine School ID: Use body (Admin) or fallback to logged-in user's school (Principal)
    const finalSchoolId = school_id || (req.user?.role === 'principal' ? req.user.school_id : null);

    if (!finalSchoolId) {
      return res.status(400).json({ message: "School ID is required" });
    }

    // Create user first
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      visible_password: password, // Store for credential visibility
      role: "teacher",
      school_id: finalSchoolId,
      classes,
      subjects
    });

    // Create teacher profile
    const teacher = await Teacher.create({
      user_id: user._id,
      school_id: finalSchoolId,
      name,
      classes,
      subjects,
      is_class_teacher,
      class_teacher_for
    });

    res.json({ success: true, teacher, user_id: user._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================================================
// GET TEACHERS BY SCHOOL
// =======================================================
export const getTeachersBySchool = async (req, res) => {
  try {
    const { school_id } = req.params;
    const teachers = await Teacher.find({ school_id }).populate('user_id', 'email visible_password');
    res.json({ success: true, teachers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMySchoolTeachers = async (req, res) => {
  try {
    const school_id = req.user.school_id;
    if (!school_id) return res.status(400).json({ message: "No school associated with this user" });

    const teachers = await Teacher.find({ school_id }).populate('user_id', 'email visible_password');
    res.json({ success: true, teachers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================================================
// GET TEACHER BY ID
// =======================================================
export const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).populate('user_id', 'email');
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    res.json({ success: true, teacher });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================================================
// UPDATE TEACHER
// =======================================================
export const updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    // Also update user if classes/subjects changed
    if (req.body.classes || req.body.subjects) {
      await User.findByIdAndUpdate(teacher.user_id, {
        classes: req.body.classes,
        subjects: req.body.subjects
      });
    }

    res.json({ success: true, teacher });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================================================
// DELETE TEACHER
// =======================================================
export const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    // Delete user as well
    await User.findByIdAndDelete(teacher.user_id);
    await Teacher.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Teacher deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTeacherProfile = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ user_id: req.user.id })
      .populate("user_id", "email role");

    if (!teacher) return res.status(404).json({ message: "Teacher profile not found" });

    res.json({ success: true, teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
