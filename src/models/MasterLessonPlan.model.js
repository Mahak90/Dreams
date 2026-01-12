import mongoose from "mongoose";

const singleLessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  video_link: String,

  lesson_text: String,

  homework: [
    {
      question: {
        type: String,
        required: true
      }
    }
  ]
});

const masterLessonSchema = new mongoose.Schema(
  {
    class: {
      type: Number,
      required: true
    },

    subject: {
      type: String,
      required: true
    },

    week: {
      type: Number,
      required: true
    },

    lessons: [singleLessonSchema],

    version: {
      type: Number,
      default: 1
    }
  },
  { timestamps: true }
);

export default mongoose.model("MasterLessonPlan", masterLessonSchema);
