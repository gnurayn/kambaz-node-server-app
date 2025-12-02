import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
    {
        _id: String,
        title: String,
        course: String,
        description: String,
        module: String,
        points: Number,
        availableFromDate: String,
        availableFromTime: String,
        dueDateDate: String,
        dueDateTime: String,
        availableUntilDate: String,
        availableUntilTime: String,
    },
    { collection: "assignments" }
);

export default assignmentSchema;