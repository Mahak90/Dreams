import School from "../models/school.model.js";

// =======================================================
// CREATE SCHOOL (Admin only)
// =======================================================
export const createSchool = async (req, res) => {
  try {
    const school = await School.create(req.body);
    res.json({ success: true, school });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================================================
// GET ALL SCHOOLS (Admin only)
// =======================================================
export const getAllSchools = async (req, res) => {
  try {
    const schools = await School.find();
    res.json({ success: true, schools });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================================================
// GET SCHOOL BY ID
// =======================================================
export const getSchoolById = async (req, res) => {
  try {
    const school = await School.findById(req.params.id);
    if (!school) return res.status(404).json({ message: "School not found" });
    res.json({ success: true, school });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================================================
// UPDATE SCHOOL (Admin only)
// =======================================================
export const updateSchool = async (req, res) => {
  try {
    const school = await School.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!school) return res.status(404).json({ message: "School not found" });
    res.json({ success: true, school });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================================================
// DELETE SCHOOL (Admin only)
// =======================================================
export const deleteSchool = async (req, res) => {
  try {
    const school = await School.findByIdAndDelete(req.params.id);
    if (!school) return res.status(404).json({ message: "School not found" });
    res.json({ success: true, message: "School deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};