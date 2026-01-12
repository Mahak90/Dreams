import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    school_id: {
      type: mongoose.Schema.Types.ObjectId,
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

    date: {
      type: Date,
      required: true
    },

    marked_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    students: [
      {
        student_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true
        },

        status: {
          type: String,
          enum: ["present", "absent"],
          default: "absent"
        }
      }
    ]
  },
  { timestamps: true }
);

// prevent duplicate attendance per day
attendanceSchema.index(
  { school_id: 1, class: 1, subject: 1, date: 1 },
  { unique: true }
);

export default mongoose.model("Attendance", attendanceSchema);
