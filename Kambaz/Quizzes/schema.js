import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        course: { type: String, required: true },
        description: String,
        quizType: { type: String, default: "Graded Quiz" },
        points: { type: Number, default: 0 },
        assignmentGroup: { type: String, default: "Quizzes" },
        shuffleAnswers: { type: Boolean, default: true },
        timeLimit: { type: Number, default: 20 },
        multipleAttempts: { type: Boolean, default: false },
        showCorrectAnswers: { type: Boolean, default: false },
        accessCode: { type: String, default: "" },
        oneQuestionAtATime: { type: Boolean, default: true },
        webcamRequired: { type: Boolean, default: false },
        lockQuestionsAfterAnswering: { type: Boolean, default: false },
        dueDate: String,
        dueTime: String,
        availableFromDate: String,
        availableFromTime: String,
        availableUntilDate: String,
        availableUntilTime: String,
        published: { type: Boolean, default: false },
        questionCount: { type: Number, default: 0 }
    },
    { collection: "quizzes" }
);

export default quizSchema;