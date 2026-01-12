import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    school_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true
    },
    name: {
      type: String,
      required: true
    },
    classes: [{
      type: String // PG-12
    }],
    subjects: [{
      type: String
    }],
    is_class_teacher: {
      type: Boolean,
      default: false
    },
    class_teacher_for: {
      type: String // class name if is_class_teacher
    }
  },
  { timestamps: true }
);

export default mongoose.model("Teacher", teacherSchema);