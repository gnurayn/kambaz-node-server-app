import mongoose from "mongoose";

const attemptAnswerSchema = new mongoose.Schema({
    questionIndex: { type: Number, required: true },
    answer: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
    pointsEarned: { type: Number, required: true }
}, { _id: false });

const quizAttemptSchema = new mongoose.Schema(
    {
        _id: { type: String },
        quiz: { type: String, required: true },
        student: { type: String, required: true },
        course: { type: String, required: true },
        attemptNumber: { type: Number, required: true },
        answers: [attemptAnswerSchema],
        score: { type: Number, required: true },
        totalPoints: { type: Number, required: true },
        submittedAt: { type: Date, default: Date.now }
    },
    {
        collection: "quizAttempts"
    }
);

export default quizAttemptSchema;