import { v4 as uuidv4 } from "uuid";
export default function EnrollmentsDao(db) {
    const { enrollments } = db;

     function findEnrollmentsForUser(userId) {
        return enrollments.filter((e) => e.user === userId);
    }

    function enrollUserInCourse(userId, courseId) {
        const newEnrollment = {
            _id: uuidv4(),
            user: userId,
            course: courseId,
        };
        enrollments.push(newEnrollment);
        return newEnrollment; 
    }

    function unenrollUserInCourse(userId, courseId) {
        const index = enrollments.findIndex(
            (e) => e.user === userId && e.course === courseId
        );
        if (index !== -1) {
            enrollments.splice(index, 1);
            return true;
        }
        return false;
    }

    return {findEnrollmentsForUser, enrollUserInCourse, unenrollUserInCourse };
}
