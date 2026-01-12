import mongoose from "mongoose";

const examTypeSchema = new mongoose.Schema(
  {
    school_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true
    },
    name: {
      type: String,
      required: true // e.g., Unit Test, Monthly Test, Half-Yearly
    },
    default_max_marks: {
      type: Number,
      required: true
    },
    default_passing_marks: {
      type: Number,
      required: true
    },
    grading_scale: {
      type: String,
      enum: ["marks", "grade", "marks_and_grade"],
      default: "marks"
    }
  },
  { timestamps: true }
);

// Unique per school and name
examTypeSchema.index({ school_id: 1, name: 1 }, { unique: true });

export default mongoose.model("ExamType", examTypeSchema);