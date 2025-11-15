import EnrollmentsDao from "../Enrollments/dao.js";

export default function EnrollmentsRoutes(app, db) {
    const dao = EnrollmentsDao(db);

    const findEnrollmentsForUser = (req, res) => {
        const { userId } = req.params;
        const enrollments = dao.findEnrollmentsForUser(userId);
        res.json(enrollments);
    };

    const enrollUserInCourse = (req, res) => {

        try {
            const { userId, courseId } = req.params;
            const newEnrollment = dao.enrollUserInCourse(userId, courseId);
            res.send(newEnrollment);
        } catch (err) {
            console.error("Error enrolling user:", err);
            res.status(500).send({ message: err.message });
        }
    };

    const unenrollUserInCourse = (req, res) => {

        try {
            const { userId, courseId } = req.params;
            const status = dao.unenrollUserInCourse(userId, courseId);
            res.send(status);
        } catch (err) {
            console.error("Error unenrolling user:", err);
            res.status(500).send({ message: err.message });
        }
    };

    app.get("/api/users/:userId/enrollments", findEnrollmentsForUser);
    app.post("/api/users/:userId/courses/:courseId", enrollUserInCourse);
    app.delete("/api/users/:userId/courses/:courseId", unenrollUserInCourse);
}
