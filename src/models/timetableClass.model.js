import mongoose from "mongoose";

const timetableClassSchema = new mongoose.Schema(
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
    periods: {
      type: Number,
      required: true // number of periods per day
    },
    period_slots: [{
      start_time: String, // e.g., "09:00"
      end_time: String    // e.g., "09:45"
    }],
    grid: {
      type: Map,
      of: [String] // e.g., { "Monday": ["Math", "English", ...], "Tuesday": [...] }
    }
  },
  { timestamps: true }
);

// Unique per school and class
timetableClassSchema.index({ school_id: 1, class: 1 }, { unique: true });

export default mongoose.model("TimetableClass", timetableClassSchema);