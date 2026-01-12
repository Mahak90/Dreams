import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
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
    class: {
      type: String,
      required: true // PG-12
    },
    school_roll_no: {
      type: String,
      required: true
    },
    class_roll_no: {
      type: String,
      required: true
    },
    parent_name: {
      type: String,
      required: true
    },
    contact_number: {
      type: String,
      required: true
    },
    age: {
      type: Number
    }
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);