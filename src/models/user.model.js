import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["admin", "principal", "teacher", "student"],
      required: true
    },

    // school reference
    school_id: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },

    // teacher related
    classes: {
      type: [Number],
      default: []
    },

    subjects: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
