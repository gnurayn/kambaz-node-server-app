import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function QuizzesDao(db) {

    function findAllQuizzes() {
        return model.find();
    }

    function findQuizzesForCourse(courseId) {
        return model.find({ course: courseId });
    }

    function findQuizById(quizId) {
        return model.findById(quizId);
    }

    function createQuiz(quiz) {
        const newQuiz = { ...quiz, _id: uuidv4() };
        return model.create(newQuiz);
    }

    function updateQuiz(quizId, quizUpdates) {
        return model.updateOne({ _id: quizId }, { $set: quizUpdates });
    }

    function deleteQuiz(quizId) {
        return model.deleteOne({ _id: quizId });
    }

    return {
        findAllQuizzes,
        findQuizzesForCourse,
        findQuizById,
        createQuiz,
        updateQuiz,
        deleteQuiz
    };
}