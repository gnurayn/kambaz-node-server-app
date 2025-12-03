import AssignmentsDao from "../Assignments/dao.js";
import { authenticate, canEditCourse } from "../Users/middleware-jwt.js";

export default function AssignmentsRoutes(app, db) {
    const dao = AssignmentsDao(db);
    const findAssignmentsForCourse = async (req, res) => {
        try {
            const { courseId } = req.params;
            console.log("Fetching assignments for course:", courseId);
            const assignments = await dao.findAssignmentsForCourse(courseId);
            console.log("Found assignments:", assignments);
            res.json(assignments);
        } catch (err) {
            console.error("Error fetching assignments:", err);
            res.status(500).json({ message: err.message });
        }
    };
    const createAssignmentForCourse = (req, res) => {
        const { courseId } = req.params;
        const assignment = {
            ...req.body,
            course: courseId,
        };
        const newAssignment = dao.createAssignment(assignment);
        res.send(newAssignment);
    }

    const deleteAssignment = async (req, res) => {
        const { assignmentId } = req.params;
        const status = await dao.deleteAssignment(assignmentId);
        res.send(status);
    }

    const updateAssignment = async (req, res) => {
        const { assignmentId } = req.params;
        const assignmentUpdates = req.body;
        const status = await dao.updateAssignment(assignmentId, assignmentUpdates);
        res.send(status);
    }

    app.get("/api/courses/:courseId/assignments", findAssignmentsForCourse);
    app.post("/api/courses/:courseId/assignments", authenticate, canEditCourse, createAssignmentForCourse);
    app.delete("/api/assignments/:assignmentId", authenticate, canEditCourse, deleteAssignment);
    app.put("/api/assignments/:assignmentId", authenticate, canEditCourse, updateAssignment);
}
