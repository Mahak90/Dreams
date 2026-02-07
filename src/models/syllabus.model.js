import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema({
  chapterNo: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String },
  videoLink: { type: String },
  image: { type: String },
  week: { type: Number } // For weekly planning
});

const syllabusSchema = new mongoose.Schema({
  class: { type: String, required: true }, // e.g., "5"
  subject: { type: String, required: true }, // e.g., "Maths"
  chapters: [chapterSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Super Admin
}, { timestamps: true });

// Prevent duplicate syllabus for same class/subject
syllabusSchema.index({ class: 1, subject: 1 }, { unique: true });

export default mongoose.model("Syllabus", syllabusSchema);
