import SchoolLessonPlan from "../models/SchoolLessonPlan.model.js";

// =======================================================
// CREATE LESSON PLAN (Admin/Principal)
// =======================================================
export const createLessonPlan = async (req, res) => {
  try {
    const { school_id, class: className, subject, week, video_link, lesson_text, homework_text } = req.body;

    const lessonPlan = await SchoolLessonPlan.create({
      school_id,
      class: className,
      subject,
      week,
      video_link,
      lesson_text,
      homework_text,
      created_by: req.user.id
    });

    res.json({ success: true, lessonPlan });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Lesson plan already exists for this class, subject, and week" });
    }
    res.status(500).json({ message: err.message });
  }
};

// =======================================================
// GET LESSON PLANS BY SCHOOL/CLASS/SUBJECT
// =======================================================
export const getLessonPlans = async (req, res) => {
  try {
    const { school_id, class: className, subject } = req.query;
    const filter = {};
    if (school_id) filter.school_id = school_id;
    if (className) filter.class = className;
    if (subject) filter.subject = subject;

    const lessonPlans = await SchoolLessonPlan.find(filter).sort({ week: 1 });
    res.json({ success: true, lessonPlans });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================================================
// GET LESSON PLAN BY ID
// =======================================================
export const getLessonPlanById = async (req, res) => {
  try {
    const lessonPlan = await SchoolLessonPlan.findById(req.params.id);
    if (!lessonPlan) return res.status(404).json({ message: "Lesson plan not found" });
    res.json({ success: true, lessonPlan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================================================
// UPDATE LESSON PLAN
// =======================================================
export const updateLessonPlan = async (req, res) => {
  try {
    const lessonPlan = await SchoolLessonPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lessonPlan) return res.status(404).json({ message: "Lesson plan not found" });
    res.json({ success: true, lessonPlan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================================================
// DELETE LESSON PLAN
// =======================================================
export const deleteLessonPlan = async (req, res) => {
  try {
    const lessonPlan = await SchoolLessonPlan.findByIdAndDelete(req.params.id);
    if (!lessonPlan) return res.status(404).json({ message: "Lesson plan not found" });
    res.json({ success: true, message: "Lesson plan deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};