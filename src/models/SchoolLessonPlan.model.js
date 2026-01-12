import mongoose from "mongoose";

const schoolLessonSchema = new mongoose.Schema(
  {
    school_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
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
    week: {
      type: Number,
      required: true,
      min: 1,
      max: 30
    },
    video_link: {
      type: String // YouTube private video link
    },
    lesson_text: {
      type: String // Lesson explanation text
    },
    homework_text: {
      type: String // Homework text
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

// Unique per school, class, subject, week
schoolLessonSchema.index({ school_id: 1, class: 1, subject: 1, week: 1 }, { unique: true });

export default mongoose.model("SchoolLessonPlan", schoolLessonSchema);
