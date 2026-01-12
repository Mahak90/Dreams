import TimetableClass from "../models/timetableClass.model.js";
import TimetableTeacher from "../models/timetableTeacher.model.js";
import Teacher from "../models/teacher.model.js";

// =======================================================
// CREATE/UPDATE CLASS TIMETABLE
// =======================================================
export const createClassTimetable = async (req, res) => {
  try {
    const { school_id, class: className, periods, period_slots, grid } = req.body;

    const timetable = await TimetableClass.findOneAndUpdate(
      { school_id, class: className },
      { periods, period_slots, grid },
      { new: true, upsert: true }
    );

    res.json({ success: true, timetable });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================================================
// GET CLASS TIMETABLE
// =======================================================
export const getClassTimetable = async (req, res) => {
  try {
    const { school_id, class: className } = req.params;
    const timetable = await TimetableClass.findOne({ school_id, class: className });
    if (!timetable) return res.status(404).json({ message: "Timetable not found" });
    res.json({ success: true, timetable });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================================================
// GENERATE TEACHER TIMETABLES
// =======================================================
export const generateTeacherTimetables = async (req, res) => {
  try {
    const { school_id } = req.body;

    // Get all class timetables for the school
    const classTimetables = await TimetableClass.find({ school_id });

    // Get all teachers
    const teachers = await Teacher.find({ school_id });

    const teacherTimetables = [];

    for (const teacher of teachers) {
      const timetable = new Map();

      // For each class timetable, check if teacher teaches subjects in that class
      for (const classTT of classTimetables) {
        if (teacher.classes.includes(classTT.class)) {
          // Check each day and period
          for (const [day, subjects] of classTT.grid) {
            subjects.forEach((subject, periodIndex) => {
              if (teacher.subjects.includes(subject)) {
                if (!timetable.has(day)) timetable.set(day, []);
                timetable.get(day).push({
                  period: periodIndex + 1,
                  subject,
                  class: classTT.class,
                  day
                });
              }
            });
          }
        }
      }

      // Save teacher timetable
      const teacherTT = await TimetableTeacher.findOneAndUpdate(
        { school_id, teacher_id: teacher.user_id },
        { timetable, generated_at: new Date() },
        { new: true, upsert: true }
      );

      teacherTimetables.push(teacherTT);
    }

    res.json({ success: true, teacherTimetables });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================================================
// GET TEACHER TIMETABLE
// =======================================================
export const getTeacherTimetable = async (req, res) => {
  try {
    const { teacher_id } = req.params;
    const timetable = await TimetableTeacher.findOne({ teacher_id }).populate('teacher_id', 'name');
    if (!timetable) return res.status(404).json({ message: "Timetable not found" });
    res.json({ success: true, timetable });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================================================
// GET ALL CLASS TIMETABLES BY SCHOOL
// =======================================================
export const getClassTimetablesBySchool = async (req, res) => {
  try {
    const { school_id } = req.params;
    const timetables = await TimetableClass.find({ school_id });
    res.json({ success: true, timetables });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};