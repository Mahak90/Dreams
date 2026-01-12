import Class from "../models/class.model.js";

// Pre-defined subjects mapping
const SUBJECT_MAPPING = {
  "PG": ["English", "Hindi", "Maths", "SST", "GAMES", "BRAIN"],
  "UKG": ["English", "Hindi", "Maths", "SST", "GAMES", "BRAIN"],
  "1": ["English", "Hindi", "Maths", "GK", "SST", "GAMES"],
  "2": ["English", "Hindi", "Maths", "GK", "SST", "GAMES"],
  "3": ["English", "Hindi", "Maths", "GK", "SST", "GAMES"],
  "4": ["English", "Hindi", "Maths", "GK", "SST", "GAMES"],
  "5": ["English", "Hindi", "Maths", "GK", "SST", "GAMES"],
  "6": ["English", "Hindi", "Maths", "GK", "SST", "GAMES"],
  // Add more as needed
};

// =======================================================
// ADD CLASS (Admin/Principal)
// =======================================================
export const addClass = async (req, res) => {
  try {
    const { school_id, class_name, subjects } = req.body;

    // Get default subjects
    const defaultSubjects = SUBJECT_MAPPING[class_name] || [];

    const classDoc = await Class.create({
      school_id,
      class_name,
      subjects: subjects || defaultSubjects,
      default_subjects: defaultSubjects
    });

    res.json({ success: true, class: classDoc });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================================================
// GET CLASSES BY SCHOOL
// =======================================================
export const getClassesBySchool = async (req, res) => {
  try {
    const { school_id } = req.params;
    const classes = await Class.find({ school_id });
    res.json({ success: true, classes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================================================
// UPDATE CLASS SUBJECTS
// =======================================================
export const updateClassSubjects = async (req, res) => {
  try {
    const { subjects } = req.body;
    const classDoc = await Class.findByIdAndUpdate(req.params.id, { subjects }, { new: true });
    if (!classDoc) return res.status(404).json({ message: "Class not found" });
    res.json({ success: true, class: classDoc });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================================================
// DELETE CLASS
// =======================================================
export const deleteClass = async (req, res) => {
  try {
    const classDoc = await Class.findByIdAndDelete(req.params.id);
    if (!classDoc) return res.status(404).json({ message: "Class not found" });
    res.json({ success: true, message: "Class deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};