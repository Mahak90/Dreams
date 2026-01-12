import MasterLessonPlan from "../models/MasterLessonPlan.model.js";
import SchoolLessonPlan from "../models/SchoolLessonPlan.model.js";

export const syncLessonForSchool = async (school_id, master_id) => {
  const master = await MasterLessonPlan.findById(master_id);

  let schoolLesson = await SchoolLessonPlan.findOne({ school_id, master_id });

  // CREATE COPY IF NOT EXISTS
  if (!schoolLesson) {
    schoolLesson = await SchoolLessonPlan.create({
      school_id,
      master_id,
      class: master.class,
      subject: master.subject,
      week: master.week,
      lessons: master.lessons,
      version: master.version
    });

    return schoolLesson;
  }

  // UPDATE ONLY IF MASTER VERSION IS NEWER
  if (schoolLesson.version < master.version) {
    schoolLesson.lessons = master.lessons;
    schoolLesson.version = master.version;
    await schoolLesson.save();
  }

  return schoolLesson;
};
