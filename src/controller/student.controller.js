import Student from "../models/student.model.js";
import User from "../models/user.model.js";
import SyllabusAssignment from "../models/syllabusAssignment.model.js";
import ChapterProgress from "../models/chapterProgress.model.js";
import Attendance from "../models/attendance.model.js";
import bcrypt from "bcryptjs";

// ADD STUDENT (Admin/Principal)

export const addStudent = async (req, res) => {
  try {
    const { name, email, password, class: className, section, school_roll_no, class_roll_no, parent_name, contact_number, age, school_id } = req.body;

    // Determine School ID: Use body (Admin) or fallback to logged-in user's school (Principal/Teacher)
    const finalSchoolId = school_id || (req.user?.school_id || null);

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
      role: "student",
      school_id: finalSchoolId
    });

    // Create student profile
    const student = await Student.create({
      user_id: user._id,
      school_id: finalSchoolId,
      name,
      class: className,
      section,
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
    const students = await Student.find({ school_id }).populate('user_id', 'email visible_password');
    res.json({ success: true, students });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMySchoolStudents = async (req, res) => {
  try {
    const school_id = req.user.school_id;
    if (!school_id) return res.status(400).json({ message: "No school associated with this user" });

    const students = await Student.find({ school_id }).populate('user_id', 'email visible_password');
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

// ==========================================
// STUDENT SELF-SERVICE
// ==========================================

export const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ user_id: req.user.id }).populate('school_id', 'name');
    if (!student) return res.status(404).json({ message: "Student profile not found" });
    res.json({ success: true, student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getStudentSyllabus = async (req, res) => {
  try {
    const student = await Student.findOne({ user_id: req.user.id });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const assignments = await SyllabusAssignment.find({
      schoolId: student.school_id,
      class: student.class
    }).populate("syllabusId").populate("teacherId", "name");

    const syllabusWithProgress = await Promise.all(assignments.map(async (assign) => {
      const progress = await ChapterProgress.find({
        schoolId: assign.schoolId,
        class: assign.class,
        subject: assign.subject
      });
      return {
        ...assign.toObject(),
        progress
      };
    }));

    res.json({ success: true, syllabus: syllabusWithProgress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudentAttendance = async (req, res) => {
  try {
    const student = await Student.findOne({ user_id: req.user.id });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const attendanceRecords = await Attendance.find({
      schoolId: student.school_id,
      class: student.class,
      "students.studentId": student._id
    }).select("date subject chapterNo students.$");

    res.json({ success: true, attendance: attendanceRecords });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};