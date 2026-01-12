import mongoose from "mongoose";

const timetableTeacherSchema = new mongoose.Schema(
  {
    school_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true
    },
    teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    timetable: {
      type: Map,
      of: [{
        period: Number,
        subject: String,
        class: String,
        day: String
      }]
    },
    generated_at: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Unique per school and teacher
timetableTeacherSchema.index({ school_id: 1, teacher_id: 1 }, { unique: true });

export default mongoose.model("TimetableTeacher", timetableTeacherSchema);