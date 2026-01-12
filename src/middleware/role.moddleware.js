/**
 * =======================================================
 * ADMIN ONLY
 * =======================================================
 */
export const isAdmin = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Admin only." });
    }
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * =======================================================
 * PRINCIPAL ONLY
 * =======================================================
 */
export const isPrincipal = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "principal") {
      return res
        .status(403)
        .json({ message: "Access denied. Principal only." });
    }
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * =======================================================
 * TEACHER ONLY
 * =======================================================
 */
export const isTeacher = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Access denied. Teacher only." });
    }
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * =======================================================
 * STUDENT ONLY
 * =======================================================
 */
export const isStudent = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "student") {
      return res
        .status(403)
        .json({ message: "Access denied. Student only." });
    }
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * =======================================================
 * MULTI-ROLE ACCESS (OPTIONAL – VERY USEFUL)
 * Usage: allowRoles("admin","principal")
 * =======================================================
 */
export const allowRoles = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({
          message: `Access denied. Allowed roles: ${roles.join(", ")}`
        });
      }
      next();
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  };
};
