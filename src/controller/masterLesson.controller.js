import MasterLessonPlan from "../models/MasterLessonPlan.model.js";

/**
 * =======================================================
 * ADMIN → Create Master Lesson
 * =======================================================
 */

export const createMasterLesson = async (req, res) => {
  try {
    const { class: classNo, subject, week, lessons } = req.body;

    if (!classNo || !subject || !week || !lessons) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const lesson = await MasterLessonPlan.create({
      class: classNo,
      subject,
      week,
      lessons
    });

    return res.status(201).json({
      success: true,
      lesson
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * =======================================================
 * ADMIN → Update Master Lesson (Auto version++)
 * =======================================================
 */
export const updateMasterLesson = async (req, res) => {
  try {
    const updated = await MasterLessonPlan.findByIdAndUpdate(
      req.params.id,
      {
        lessons: req.body.lessons,
        $inc: { version: 1 }
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Master lesson not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Master lesson updated & will auto-sync",
      updated
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * =======================================================
 * ADMIN → Get all master lessons
 * =======================================================
 */
export const getAllMasterLessons = async (req, res) => {
  try {
    const lessons = await MasterLessonPlan.find().sort({
      class: 1,
      week: 1
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
 * ADMIN → Get master lesson by ID
 * =======================================================
 */
export const getMasterLessonById = async (req, res) => {
  try {
    const lesson = await MasterLessonPlan.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({ message: "Master lesson not found" });
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
 * COMMON → Get master lessons by class
 * =======================================================
 */
export const getMasterLessonsByClass = async (req, res) => {
  try {
    const { classNo } = req.params;

    const lessons = await MasterLessonPlan.find({
      class: classNo
    }).sort({ week: 1 });

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
 * COMMON → Get master lessons by subject
 * =======================================================
 */
export const getMasterLessonsBySubject = async (req, res) => {
  try {
    const { subject } = req.params;

    const lessons = await MasterLessonPlan.find({
      subject
    }).sort({ class: 1, week: 1 });

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
 * COMMON → Get master lessons by class + subject
 * =======================================================
 */
export const getMasterLessonsByClassAndSubject = async (req, res) => {
  try {
    const { classNo, subject } = req.query;

    const lessons = await MasterLessonPlan.find({
      class: classNo,
      subject
    }).sort({ week: 1 });

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
 * COMMON → Get master lesson by class + week
 * =======================================================
 */
export const getMasterLessonByWeek = async (req, res) => {
  try {
    const { classNo, week } = req.query;

    const lesson = await MasterLessonPlan.findOne({
      class: classNo,
      week
    });

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
 * ADMIN → Delete master lesson
 * =======================================================
 */
export const deleteMasterLesson = async (req, res) => {
  try {
    const deleted = await MasterLessonPlan.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Master lesson not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Master lesson deleted successfully"
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * =======================================================
 * ADMIN → Duplicate master lesson (Reuse structure)
 * =======================================================
 */

export const duplicateMasterLesson = async (req, res) => {
  try {
    const original = await MasterLessonPlan.findById(req.params.id);

    if (!original) {
      return res.status(404).json({ message: "Original lesson not found" });
    }

    const duplicate = await MasterLessonPlan.create({
      class: original.class,
      subject: original.subject,
      week: original.week + 1,
      lessons: original.lessons
    });

    return res.status(201).json({
      success: true,
      duplicate
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
