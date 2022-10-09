import mongoose from "mongoose";

const task = new mongoose.Schema({
    description: String,
    type: String,
    start_time: Date,
    time_taken: Number,
    username: String,
});


const Task = mongoose.model('Task', task);

export default Task;