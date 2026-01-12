import Student from "../models/student.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

// ADD STUDENT (Admin/Principal)

export const addStudent = async (req, res) => {
  try {
    const { name, email, password, class: className, school_roll_no, class_roll_no, parent_name, contact_number, age, school_id } = req.body;

    // Create user first
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "student",
      school_id
    });

    // Create student profile
    const student = await Student.create({
      user_id: user._id,
      school_id,
      name,
      class: className,
      school_roll_no,
      class_roll_no,
      parent_name,
      contact_number,
      age
    });

    res.json({ success: true, student, user_id: user._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET STUDENTS BY SCHOOL (Admin/Principal)

export const getStudentsBySchool = async (req, res) => {
  try {
    const { school_id } = req.params;
    const students = await Student.find({ school_id }).populate('user_id', 'email');
    res.json({ success: true, students });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================================================
// GET STUDENT BY ID
// =======================================================
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('user_id', 'email');
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ success: true, student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================================================
// UPDATE STUDENT
// =======================================================
export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ success: true, student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE STUDENT

export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Delete user as well
    await User.findByIdAndDelete(student.user_id);
    await Student.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};