import express from 'express';
import mongoose from "mongoose";
import Hello from "./Hello.js";
import Lab5 from "./Lab5/index.js";
import cors from "cors";
import db from "./Kambaz/Database/index.js";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import ModulesRoutes from "./Kambaz/Modules/routes.js";
import AssignmentsRoutes from "./Kambaz/Assignments/routes.js";
import EnrollmentsRoutes from './Kambaz/Enrollments/routes.js';
import QuizRoutes from "./Kambaz/Quizzes/routes.js";
import QuizAttemptRoutes from "./Database/QuizAttempts/routes.js";
import "dotenv/config";
import session from "express-session";
import MongoStore from 'connect-mongo';

const CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz"
mongoose.connect(CONNECTION_STRING);
const app = express()
app.use(cors({
    credentials: true,
    origin: (origin, callback) => {
        if (!origin) {
            return callback(null, true);
        }
        // Allow localhost for development
        if (origin === 'http://localhost:3000') {
            return callback(null, true);
        }
        // Allow all Vercel deployments
        if (origin && origin.endsWith('.vercel.app')) {
            return callback(null, true);
        }
        // Fallback to CLIENT_URL
        if (origin === process.env.CLIENT_URL) {
            return callback(null, true);
        }
        callback(new Error('Not allowed by CORS'));
    }
}
));
const sessionOptions = {
    secret: process.env.SESSION_SECRET || "kambaz",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.DATABASE_CONNECTION_STRING,
        collectionName: 'sessions',
        ttl: 24 * 60 * 60
    })
};
if (process.env.SERVER_ENV !== "development") {
    sessionOptions.proxy = true;
    sessionOptions.cookie = {
        sameSite: "none",
        secure: true,
    };
}
app.use(session(sessionOptions))
app.use(express.json());
UserRoutes(app, db);
CourseRoutes(app, db);
ModulesRoutes(app, db);
AssignmentsRoutes(app, db);
EnrollmentsRoutes(app, db);
QuizRoutes(app, db);
QuizAttemptRoutes(app, db);
Lab5(app);
Hello(app)
app.listen(process.env.PORT || 4000)