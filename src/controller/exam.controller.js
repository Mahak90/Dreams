import Exam from "../models/exam.model.js";
import ExamType from "../models/examType.model.js";
import SubjectPaper from "../models/subjectPaper.model.js";

// =======================================================
// CREATE EXAM TYPE
// =======================================================
export const createExamType = async (req, res) => {
  try {
    const examType = await ExamType.create(req.body);
    res.json({ success: true, examType });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================================================
// GET EXAM TYPES BY SCHOOL
// =======================================================
export const getExamTypesBySchool = async (req, res) => {
  try {
    const { school_id } = req.params;
    const examTypes = await ExamType.find({ school_id });
    res.json({ success: true, examTypes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================================================
// CREATE EXAM
// =======================================================
export const createExam = async (req, res) => {
  try {
    const exam = await Exam.create(req.body);
    res.json({ success: true, exam });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================================================
// GET EXAMS BY SCHOOL
// =======================================================
export const getExamsBySchool = async (req, res) => {
  try {
    const { school_id } = req.params;
    const exams = await Exam.find({ school_id }).populate('exam_type_id');
    res.json({ success: true, exams });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================================================
// UPDATE EXAM STATUS
// =======================================================
export const updateExamStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const exam = await Exam.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!exam) return res.status(404).json({ message: "Exam not found" });
    res.json({ success: true, exam });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================================================
// CREATE SUBJECT PAPER
// =======================================================
export const createSubjectPaper = async (req, res) => {
  try {
    const subjectPaper = await SubjectPaper.create(req.body);
    res.json({ success: true, subjectPaper });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================================================
// GET SUBJECT PAPERS BY EXAM
// =======================================================
export const getSubjectPapersByExam = async (req, res) => {
  try {
    const { exam_id } = req.params;
    const subjectPapers = await SubjectPaper.find({ exam_id });
    res.json({ success: true, subjectPapers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================================================
// LOCK SUBJECT PAPER
// =======================================================
export const lockSubjectPaper = async (req, res) => {
  try {
    const subjectPaper = await SubjectPaper.findByIdAndUpdate(req.params.id, { is_locked: true }, { new: true });
    if (!subjectPaper) return res.status(404).json({ message: "Subject paper not found" });
    res.json({ success: true, subjectPaper });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};