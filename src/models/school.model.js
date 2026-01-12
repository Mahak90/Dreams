import mongoose from "mongoose";

const schoolSchema = new mongoose.Schema(
  {
    school_name: {
      type: String,
      required: true
    },
    board: {
      type: String,
      required: true
    },
    medium: {
      type: String,
      required: true
    },
    number_of_students: {
      type: Number,
      default: 0
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    principal_name: {
      type: String,
      required: true
    },
    principal_number: {
      type: String,
      required: true
    },
    address: {
      type: String
    }
  },
  { timestamps: true }
);

export default mongoose.model("School", schoolSchema);