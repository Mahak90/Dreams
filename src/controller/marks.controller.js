import StudentMark from "../models/studentMark.model.js";
import SubjectPaper from "../models/subjectPaper.model.js";
import Student from "../models/student.model.js";

// =======================================================
// ENTER/UPDATE STUDENT MARKS
// =======================================================
export const enterStudentMarks = async (req, res) => {
  try {
    const { subject_paper_id, student_id, total_marks, grade, component_marks } = req.body;

    // Check if subject paper is locked
    const subjectPaper = await SubjectPaper.findById(subject_paper_id);
    if (!subjectPaper || subjectPaper.is_locked) {
      return res.status(400).json({ message: "Subject paper is locked" });
    }

    const mark = await StudentMark.findOneAndUpdate(
      { subject_paper_id, student_id },
      {
        total_marks,
        grade,
        component_marks,
        entered_by: req.user.id,
        is_locked: false
      },
      { new: true, upsert: true }
    );

    res.json({ success: true, mark });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================================================
// GET MARKS BY SUBJECT PAPER
// =======================================================
export const getMarksBySubjectPaper = async (req, res) => {
  try {
    const { subject_paper_id } = req.params;
    const marks = await StudentMark.find({ subject_paper_id })
      .populate('student_id', 'name')
      .populate('entered_by', 'name');
    res.json({ success: true, marks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================================================
// GET STUDENT MARKS FOR EXAM
// =======================================================
export const getStudentMarksForExam = async (req, res) => {
  try {
    const { exam_id, student_id } = req.params;

    // Get all subject papers for the exam
    const subjectPapers = await SubjectPaper.find({ exam_id });

    const marks = [];
    for (const paper of subjectPapers) {
      const mark = await StudentMark.findOne({
        subject_paper_id: paper._id,
        student_id
      }).populate('subject_paper_id', 'subject max_marks pass_marks');
      if (mark) marks.push(mark);
    }

    res.json({ success: true, marks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================================================
// LOCK STUDENT MARKS
// =======================================================
export const lockStudentMarks = async (req, res) => {
  try {
    const mark = await StudentMark.findByIdAndUpdate(req.params.id, { is_locked: true }, { new: true });
    if (!mark) return res.status(404).json({ message: "Mark not found" });
    res.json({ success: true, mark });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================================================
// CALCULATE RESULTS
// =======================================================
export const calculateResults = async (req, res) => {
  try {
    const { exam_id, student_id } = req.params;

    const subjectPapers = await SubjectPaper.find({ exam_id });
    let totalObtained = 0;
    let totalMax = 0;
    const subjectResults = [];

    for (const paper of subjectPapers) {
      const mark = await StudentMark.findOne({
        subject_paper_id: paper._id,
        student_id
      });

      if (mark) {
        const subjectObtained = mark.total_marks || 0;
        const subjectMax = paper.max_marks;
        const isPass = subjectObtained >= paper.pass_marks;

        totalObtained += subjectObtained;
        totalMax += subjectMax;

        subjectResults.push({
          subject: paper.subject,
          obtained: subjectObtained,
          max: subjectMax,
          pass: isPass
        });
      }
    }

    const percentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;

    res.json({
      success: true,
      results: {
        subjectResults,
        totalObtained,
        totalMax,
        percentage: Math.round(percentage * 100) / 100
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};