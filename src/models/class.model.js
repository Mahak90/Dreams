import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    school_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true
    },
    class_name: {
      type: String,
      required: true // PG-12
    },
    subjects: [{
      type: String
    }],
    // Pre-mapped subjects based on class
    default_subjects: [{
      type: String
    }]
  },
  { timestamps: true }
);

// Index for unique class per school
classSchema.index({ school_id: 1, class_name: 1 }, { unique: true });

export default mongoose.model("Class", classSchema);