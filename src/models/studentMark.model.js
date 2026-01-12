import mongoose from "mongoose";

const componentMarkSchema = new mongoose.Schema({
  component_name: {
    type: String,
    required: true
  },
  marks_obtained: {
    type: Number,
    default: null
  },
  is_absent: {
    type: Boolean,
    default: false
  },
  is_exempted: {
    type: Boolean,
    default: false
  }
});

const studentMarkSchema = new mongoose.Schema(
  {
    subject_paper_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubjectPaper",
      required: true
    },
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    total_marks: {
      type: Number,
      default: null
    },
    grade: {
      type: String // if applicable
    },
    component_marks: [componentMarkSchema],
    entered_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    is_locked: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// Unique per subject paper and student
studentMarkSchema.index({ subject_paper_id: 1, student_id: 1 }, { unique: true });

export default mongoose.model("StudentMark", studentMarkSchema);