import School from "../models/school.model.js";
import Syllabus from "../models/syllabus.model.js";
import ChapterProgress from "../models/chapterProgress.model.js";
import SyllabusAssignment from "../models/syllabusAssignment.model.js";

export const getGlobalAnalytics = async (req, res) => {
  try {
    const { school_id, subject } = req.query;

    // 1. Fetch metadata for filters
    const [schools, subjects, syllabusGrades] = await Promise.all([
      School.find({}, 'school_name').lean(),
      Syllabus.distinct('subject'),
      Syllabus.distinct('class')
    ]);

    // 2. Build Filter
    const filter = {};
    if (school_id && school_id !== 'all') filter.schoolId = school_id;
    if (subject && subject !== 'all') filter.subject = subject;

    // 3. Aggregate Progress Data
    const gradeAnalytics = await ChapterProgress.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$class",
          completed: { $sum: { $cond: [{ $eq: ["$status", "COMPLETED"] }, 1, 0] } },
          total: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Format for frontend graph - ensure all existing grades are represented
    const chartData = syllabusGrades.map(grade => {
      const gData = gradeAnalytics.find(g => g._id === grade);
      return {
        name: isNaN(Number(grade)) ? grade : `Grade ${grade}`,
        value: gData ? Math.round((gData.completed / (gData.total || 1)) * 100) : 0
      };
    }).sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

    res.json({
      success: true,
      filters: {
        schools: schools.map(s => ({ id: s._id, name: s.school_name })),
        subjects
      },
      analytics: {
        globalProgress: chartData.length > 0 ? Math.round(chartData.reduce((acc, curr) => acc + curr.value, 0) / chartData.length) : 0,
        chartData
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
