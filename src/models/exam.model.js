import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    school_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true
    },
    academic_year: {
      type: String,
      required: true // e.g., "2024-2025"
    },
    exam_name: {
      type: String,
      required: true // e.g., "Unit Test 1"
    },
    exam_type_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExamType",
      required: true
    },
    applicable_classes: [{
      type: String // list of classes
    }],
    start_date: {
      type: Date,
      required: true
    },
    end_date: {
      type: Date,
      required: true
    },
    result_publish_date: {
      type: Date
    },
    status: {
      type: String,
      enum: ["draft", "open", "locked", "published"],
      default: "draft"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Exam", examSchema);