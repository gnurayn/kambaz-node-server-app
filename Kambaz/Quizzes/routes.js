import QuizzesDao from "./dao.js";
import { authenticate, canEditCourse } from "../Users/middleware.js";

export default function QuizRoutes(app, db) {
    const dao = QuizzesDao(db);

    const findQuizzesForCourse = async (req, res) => {
        try {
            const { courseId } = req.params;
            const quizzes = await dao.findQuizzesForCourse(courseId);
            res.json(quizzes);
        } catch (error) {
            console.error("Error fetching quizzes:", error);
            res.status(500).json({ message: "Failed to fetch quizzes" });
        }
    };

    const findQuizById = async (req, res) => {
        try {
            const { quizId } = req.params;
            const quiz = await dao.findQuizById(quizId);
            if (!quiz) {
                return res.status(404).json({ message: "Quiz not found" });
            }
            res.json(quiz);
        } catch (error) {
            console.error("Error fetching quiz:", error);
            res.status(500).json({ message: "Failed to fetch quiz" });
        }
    };

    const createQuiz = async (req, res) => {
        try {
            const { courseId } = req.params;
            const quiz = await dao.createQuiz({ ...req.body, course: courseId });
            res.json(quiz);
        } catch (error) {
            console.error("Error creating quiz:", error);
            res.status(500).json({ message: "Failed to create quiz" });
        }
    };

    const updateQuiz = async (req, res) => {
        try {
            const { quizId } = req.params;
            const quizUpdates = req.body;
            const status = await dao.updateQuiz(quizId, quizUpdates);
            const quiz = await dao.findQuizById(quizId);
            res.json(quiz);
        } catch (error) {
            console.error("Error updating quiz:", error);
            res.status(500).json({ message: "Failed to update quiz" });
        }
    };

    const deleteQuiz = async (req, res) => {
        try {
            const { quizId } = req.params;
            const status = await dao.deleteQuiz(quizId);
            res.sendStatus(204);
        } catch (error) {
            console.error("Error deleting quiz:", error);
            res.status(500).json({ message: "Failed to delete quiz" });
        }
    };

    app.get("/api/courses/:courseId/quizzes", findQuizzesForCourse);
    app.get("/api/quizzes/:quizId", findQuizById);

    app.post("/api/courses/:courseId/quizzes", authenticate, canEditCourse, createQuiz);
    app.put("/api/quizzes/:quizId", authenticate, canEditCourse, updateQuiz);
    app.delete("/api/quizzes/:quizId", authenticate, canEditCourse, deleteQuiz);
}