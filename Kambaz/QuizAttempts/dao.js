import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function QuizAttemptsDao(db) {

    function findAttemptsByStudent(quizId, studentId) {
        return model.find({ quiz: quizId, student: studentId }).sort({ attemptNumber: -1 });
    }

    function findLatestAttempt(quizId, studentId) {
        return model.findOne({ quiz: quizId, student: studentId }).sort({ attemptNumber: -1 });
    }

    function countAttempts(quizId, studentId) {
        return model.countDocuments({ quiz: quizId, student: studentId });
    }

    function createAttempt(attemptData) {
        const newAttempt = { ...attemptData, _id: uuidv4() };
        return model.create(newAttempt);
    }

    function findAttemptById(attemptId) {
        return model.findById(attemptId);
    }

    return {
        findAttemptsByStudent,
        findLatestAttempt,
        countAttempts,
        createAttempt,
        findAttemptById
    };
}