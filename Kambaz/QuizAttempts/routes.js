import QuizAttemptsDao from "./dao.js";
import QuizzesDao from "../Quizzes/dao.js";
import { authenticate } from "../Users/middleware-jwt.js";

export default function QuizAttemptRoutes(app, db) {
    const attemptsDao = QuizAttemptsDao(db);
    const quizzesDao = QuizzesDao(db);

    const getStudentAttempts = async (req, res) => {
        try {
            const { quizId } = req.params;
            const studentId = req.currentUser?._id;

            if (!studentId) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const attempts = await attemptsDao.findAttemptsByStudent(quizId, studentId);
            res.json(attempts);
        } catch (error) {
            console.error("Error fetching attempts:", error);
            res.status(500).json({ message: "Failed to fetch attempts" });
        }
    };

    const getLatestAttempt = async (req, res) => {
        try {
            const { quizId } = req.params;
            const studentId = req.currentUser?._id;

            if (!studentId) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const attempt = await attemptsDao.findLatestAttempt(quizId, studentId);
            if (!attempt) {
                return res.status(404).json({ message: "No attempts found" });
            }
            res.json(attempt);
        } catch (error) {
            console.error("Error fetching latest attempt:", error);
            res.status(500).json({ message: "Failed to fetch attempt" });
        }
    };

    const submitAttempt = async (req, res) => {
        try {
            const { quizId } = req.params;
            const studentId = req.currentUser?._id;

            if (!studentId) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const quiz = await quizzesDao.findQuizById(quizId);
            if (!quiz) {
                return res.status(404).json({ message: "Quiz not found" });
            }

            const attemptCount = await attemptsDao.countAttempts(quizId, studentId);
            const maxAttempts = quiz.multipleAttempts ? (quiz.allowedAttempts || 1) : 1;

            if (attemptCount >= maxAttempts) {
                return res.status(400).json({ message: "Maximum attempts reached" });
            }

            const { answers } = req.body;
            let totalPoints = 0;
            let earnedPoints = 0;
            const processedAnswers = [];

            quiz.questions.forEach((question, index) => {
                totalPoints += question.points;
                const userAnswer = answers[index];
                let isCorrect = false;
                let pointsEarned = 0;

                if (question.type === "multiple-choice" && question.answers) {
                    const correctAns = question.answers.find(ans => ans.isCorrect);
                    isCorrect = correctAns?.text === userAnswer;
                } else if (question.type === "true-false") {
                    const correctAns = question.correctAnswer ? "True" : "False";
                    isCorrect = userAnswer === correctAns;
                } else if (question.type === "fill-in-blank" && question.possibleAnswers) {
                    const userAns = String(userAnswer).toLowerCase().trim();
                    isCorrect = question.possibleAnswers.some(
                        possible => possible.toLowerCase().trim() === userAns
                    );
                }

                if (isCorrect) {
                    pointsEarned = question.points;
                    earnedPoints += pointsEarned;
                }

                processedAnswers.push({
                    questionIndex: index,
                    answer: userAnswer || "",
                    isCorrect,
                    pointsEarned
                });
            });

            const score = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;

            const attemptData = {
                quiz: quizId,
                student: studentId,
                course: quiz.course,
                attemptNumber: attemptCount + 1,
                answers: processedAnswers,
                score,
                totalPoints,
                submittedAt: new Date()
            };

            const newAttempt = await attemptsDao.createAttempt(attemptData);
            res.json(newAttempt);
        } catch (error) {
            console.error("Error submitting attempt:", error);
            res.status(500).json({ message: "Failed to submit attempt" });
        }
    };

    app.get("/api/quizzes/:quizId/attempts", authenticate, getStudentAttempts);
    app.get("/api/quizzes/:quizId/attempts/latest", authenticate, getLatestAttempt);
    app.post("/api/quizzes/:quizId/attempts", authenticate, submitAttempt);
}