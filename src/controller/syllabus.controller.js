import Syllabus from "../models/syllabus.model.js";
import SyllabusAssignment from "../models/syllabusAssignment.model.js";
import ChapterProgress from "../models/chapterProgress.model.js";
import Attendance from "../models/attendance.model.js";
import User from "../models/user.model.js";
import Teacher from "../models/teacher.model.js";

// ==========================================
// 1. SUPER ADMIN: MASTER SYLLABUS
// ==========================================

export const createSyllabus = async (req, res) => {
  try {
    const { class: className, subject, chapters } = req.body;

    // Check if exists
    const existing = await Syllabus.findOne({ class: className, subject });
    if (existing) {
      return res.status(400).json({ message: "Syllabus already exists for this class and subject" });
    }

    const syllabus = await Syllabus.create({
      class: className,
      subject,
      chapters,
      createdBy: req.user.id
    });

    res.status(201).json({ success: true, syllabus });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllSyllabus = async (req, res) => {
  try {
    const { grade } = req.query;
    const filter = {};
    if (grade) {
      filter.class = grade;
    }
    const syllabusList = await Syllabus.find(filter).sort({ class: 1, subject: 1 }).lean();
    res.json({ success: true, syllabusList: syllabusList || [] });
  } catch (error) {
    console.error("Error in getAllSyllabus:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getSyllabusById = async (req, res) => {
  try {
    const syllabus = await Syllabus.findById(req.params.id);
    if (!syllabus) return res.status(404).json({ message: "Syllabus not found" });
    res.json({ success: true, syllabus });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSyllabus = async (req, res) => {
  try {
    const { class: className, subject, chapters } = req.body;
    const syllabus = await Syllabus.findByIdAndUpdate(
      req.params.id,
      { class: className, subject, chapters },
      { new: true }
    );
    if (!syllabus) return res.status(404).json({ message: "Syllabus not found" });
    res.json({ success: true, syllabus });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// 2. PRINCIPAL: ASSIGN SYLLABUS
// ==========================================

export const assignSyllabus = async (req, res) => {
  try {
    const { class: className, subject, teacherId, academicYear } = req.body;
    const schoolId = req.user.school_id;

    // Verify Master Syllabus exists
    const masterSyllabus = await Syllabus.findOne({ class: className, subject });
    if (!masterSyllabus) {
      return res.status(404).json({ message: "Master Syllabus not found for this class/subject" });
    }

    // Verify Teacher belongs to school (Handle both User ID and Teacher ID)
    let teacherUser = await User.findOne({ _id: teacherId, school_id: schoolId, role: "teacher" });
    let finalTeacherId = teacherId;

    if (!teacherUser) {
      // Check if it's a Teacher document ID
      const teacherProfile = await Teacher.findOne({ _id: teacherId, school_id: schoolId });
      if (teacherProfile) {
        finalTeacherId = teacherProfile.user_id;
        teacherUser = await User.findById(finalTeacherId);
      }
    }

    if (!teacherUser) {
      return res.status(400).json({ message: "Invalid teacher or teacher not in your school" });
    }

    // Create or Update Assignment
    const assignment = await SyllabusAssignment.findOneAndUpdate(
      { schoolId, class: className, subject, academicYear },
      {
        teacherId: finalTeacherId,
        syllabusId: masterSyllabus._id
      },
      { upsert: true, new: true }
    );

    res.status(201).json({ success: true, assignment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAssignmentsBySchool = async (req, res) => {
  try {
    const assignments = await SyllabusAssignment.find({ schoolId: req.user.school_id })
      .populate("teacherId", "name email")
      .populate("syllabusId", "chapters");
    res.json({ success: true, assignments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// 3. TEACHER: MY SYLLABUS & PROGRESS
// ==========================================

export const getTeacherSyllabus = async (req, res) => {
  try {
    const assignments = await SyllabusAssignment.find({ teacherId: req.user.id })
      .populate("syllabusId");

    // Also fetch progress for these assignments
    const syllabusWithProgress = await Promise.all(assignments.map(async (assign) => {
      const progress = await ChapterProgress.find({
        schoolId: assign.schoolId,
        class: assign.class,
        subject: assign.subject,
        teacherId: req.user.id
      });
      return {
        ...assign.toObject(),
        progress
      };
    }));

    res.json({ success: true, assignments: syllabusWithProgress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateChapterProgress = async (req, res) => {
  try {
    const { class: className, subject, chapterNo, status, remarks } = req.body;

    const progress = await ChapterProgress.findOneAndUpdate(
      {
        schoolId: req.user.school_id,
        class: className,
        subject,
        chapterNo,
        teacherId: req.user.id
      },
      {
        status,
        remarks,
        completionDate: status === "COMPLETED" ? new Date() : undefined
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, progress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// 4. TEACHER: ATTENDANCE
// ==========================================

export const markAttendance = async (req, res) => {
  try {
    const { class: className, subject, date, chapterNo, students } = req.body;

    // Check if attendance already marked for this day/class/subject
    // Use upsert to allow updating
    const attendance = await Attendance.findOneAndUpdate(
      {
        schoolId: req.user.school_id,
        class: className,
        subject,
        date: new Date(date)
      },
      {
        teacherId: req.user.id,
        chapterNo,
        students
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAttendanceBySchool = async (req, res) => {
  try {
    const { date } = req.query;
    const schoolId = req.user.school_id;

    // Default to today if date not provided
    const searchDate = date ? new Date(date) : new Date();
    searchDate.setHours(0, 0, 0, 0);
    const endOfDay = new Date(searchDate);
    endOfDay.setHours(23, 59, 59, 999);

    const attendances = await Attendance.find({
      schoolId,
      date: { $gte: searchDate, $lte: endOfDay }
    }).populate("teacherId", "name");

    // Calculate stats
    let totalPresent = 0;
    let totalAbsent = 0;
    const classStats = {};

    attendances.forEach(att => {
      let presentCount = 0;
      let absentCount = 0;

      att.students.forEach(s => {
        if (s.status === "PRESENT") presentCount++;
        else if (s.status === "ABSENT") absentCount++;
      });

      totalPresent += presentCount;
      totalAbsent += absentCount;

      if (!classStats[att.class]) {
        classStats[att.class] = { present: 0, absent: 0, total: 0 };
      }
      classStats[att.class].present += presentCount;
      classStats[att.class].absent += absentCount;
      classStats[att.class].total += (presentCount + absentCount);
    });

    res.json({
      success: true,
      stats: {
        totalPresent,
        totalAbsent,
        totalStudents: totalPresent + totalAbsent,
        classStats: Object.keys(classStats).map(cls => ({
          class: cls,
          ...classStats[cls],
          percentage: classStats[cls].total > 0 ? (classStats[cls].present / classStats[cls].total * 100).toFixed(1) : 0
        }))
      },
      details: attendances
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
