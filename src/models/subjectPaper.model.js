import mongoose from "mongoose";

const componentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true // Theory, Practical, Oral, Project
  },
  max_marks: {
    type: Number,
    required: true
  },
  pass_marks: {
    type: Number,
    required: true
  },
  weightage: {
    type: Number,
    default: 1 // percentage weight
  }
});

const subjectPaperSchema = new mongoose.Schema(
  {
    exam_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true
    },
    class: {
      type: String,
      required: true
    },
    subject: {
      type: String,
      required: true
    },
    max_marks: {
      type: Number,
      required: true
    },
    pass_marks: {
      type: Number,
      required: true
    },
    assessment_mode: {
      type: String,
      enum: ["marks", "grade", "marks_and_grade"],
      default: "marks"
    },
    components: [componentSchema],
    is_locked: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// Unique per exam, class, subject
subjectPaperSchema.index({ exam_id: 1, class: 1, subject: 1 }, { unique: true });

export default mongoose.model("SubjectPaper", subjectPaperSchema);