import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const app = express();

// Swagger definition
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Dream School API",
    version: "1.0.0",
    description: "API documentation for Dream School management system",
  },
  servers: [
    {
      url: "http://localhost:3000/api/v1",
      description: "Development server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "refresh_token",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.js"], // Paths to files containing OpenAPI definitions
};

const specs = swaggerJSDoc(options);

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Home Route
app.get("/", (req, res) => {
  res.json("hello server");
});

// Routes
import userRoute from "../src/routes/user.route.js";
import masterLessionRoute from "../src/routes/masterLesson.route.js"
import schoolLessionRoute from "../src/routes/schoolLesson.route.js"
import schoolRoute from "../src/routes/school.route.js";
import studentRoute from "../src/routes/student.route.js";
import teacherRoute from "../src/routes/teacher.route.js";
import classRoute from "../src/routes/class.route.js";
import lessonPlanRoute from "../src/routes/lessonPlan.route.js";
import timetableRoute from "../src/routes/timetable.route.js";
import examRoute from "../src/routes/exam.route.js";
import marksRoute from "../src/routes/marks.route.js";

app.use("/api/v1", userRoute);
app.use('/api/v1', masterLessionRoute)
app.use("/api/v1", schoolLessionRoute)
app.use("/api/v1/schools", schoolRoute);
app.use("/api/v1/students", studentRoute);
app.use("/api/v1/teachers", teacherRoute);
app.use("/api/v1/classes", classRoute);
app.use("/api/v1/lesson-plans", lessonPlanRoute);
app.use("/api/v1/timetables", timetableRoute);
app.use("/api/v1/exams", examRoute);
app.use("/api/v1/marks", marksRoute);


export default app;
