import MasterLessonPlan from "../models/MasterLessonPlan.model.js";
import SchoolLessonPlan from "../models/SchoolLessonPlan.model.js";
import Attendance from "../models/attendance.model.js";
import { syncLessonForSchool } from "../services/lessonSync.service.js";
import User from "../models/user.model.js";

/**
 * =======================================================
 * PRINCIPAL → Get all lessons of school
 * =======================================================
 */
export const getSchoolLessons = async (req, res) => {
  try {
    const { school_id } = req.user;

    const masterLessons = await MasterLessonPlan.find();

    const syncedLessons = await Promise.all(
      masterLessons.map(ml =>
        syncLessonForSchool(school_id, ml._id)
      )
    );

    return res.status(200).json({
      success: true,
      lessons: syncedLessons
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * =======================================================
 * PRINCIPAL → Assign teacher to weekly lesson plan
 * =======================================================
 */
export const assignTeacherToLesson = async (req, res) => {
  try {
    const { master_id, teacher_id } = req.body;
    const { school_id } = req.user;

    if (!master_id || !teacher_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const teacher = await User.findOne({
      _id: teacher_id,
      role: "teacher",
      school_id
    });

    if (!teacher) {
      return res.status(400).json({ message: "Invalid teacher" });
    }

    const lesson = await syncLessonForSchool(school_id, master_id);

    lesson.assigned_teacher_id = teacher_id;
    await lesson.save();

    await User.findByIdAndUpdate(
      teacher_id,
      {
        $addToSet: {
          classes: lesson.class_name,
          subjects: lesson.subject_name
        }
      }
    );

    return res.status(200).json({
      success: true,
      message: "Teacher assigned to lesson successfully",
      lesson
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * =======================================================
 * TEACHER → Get assigned lessons
 * =======================================================
 */
export const getTeacherLessons = async (req, res) => {
  try {
    const { id: teacher_id, school_id } = req.user;

    const lessons = await SchoolLessonPlan.find({
      assigned_teacher_id: teacher_id,
      school_id
    });

    return res.status(200).json({
      success: true,
      lessons
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * =======================================================
 * TEACHER → Mark Attendance
 * =======================================================
 */
export const markAttendance = async (req, res) => {
  try {
    const { lesson_id, date, attendance } = req.body;

    if (!lesson_id || !date || !attendance) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const lesson = await SchoolLessonPlan.findById(lesson_id);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    const attendanceRecord = await Attendance.findOneAndUpdate(
      { school_id: lesson.school_id, class: lesson.class_name, subject: lesson.subject_name, date },
      {
        school_id: lesson.school_id,
        class: lesson.class_name,
        subject: lesson.subject_name,
        date,
        marked_by: req.user.id,
        students: attendance
      },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Attendance marked successfully",
      attendance: attendanceRecord
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * =======================================================
 * COMMON → Get lesson by ID
 * =======================================================
 */

export const getLessonById = async (req, res) => {
  try {
    const lesson = await SchoolLessonPlan.findById(req.params.lessonId);

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    return res.status(200).json({
      success: true,
      lesson
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * =======================================================
 * TEACHER → Update lesson video link
 * =======================================================
 */


export const updateLessonVideo = async (req, res) => {
  try {
    const { video_link } = req.body;

    if (!video_link) {
      return res.status(400).json({ message: "Video link required" });
    }

    const lesson = await SchoolLessonPlan.findById(req.params.lessonId);

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    lesson.lessons[0].video_link = video_link;
    await lesson.save();

    return res.status(200).json({
      success: true,
      lesson
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * =======================================================
 * STUDENT → Get lessons by class
 * =======================================================
 */
export const getStudentLessons = async (req, res) => {
  try {
    const { class: className } = req.user;

    const lessons = await SchoolLessonPlan.find({
      class_name: className
    });

    return res.status(200).json({
      success: true,
      lessons
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


 
//  STUDENT → Attendance percentage




export const getAttendancePercentage = async (req, res) => {
  try {
    const records = await Attendance.find({
      "students.student_id": req.user.id
    });

    let total = 0;
    let present = 0;

    records.forEach(record => {
      record.students.forEach(student => {
        if (student.student_id.toString() === req.user.id) {
          total++;
          if (student.status === "present") present++;
        }
      });
    });

    return res.status(200).json({
      success: true,
      percentage: total === 0 ? 0 : ((present / total) * 100).toFixed(2)
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

