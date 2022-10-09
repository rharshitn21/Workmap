import mongoose, { Schema } from 'mongoose';

const userSchema = new mongoose.Schema({
    username: String,
    name: String,
    password: String,
    contact: Number,
    department: String,
    doj: Date,
    email: String,
    access: String,
    active: Boolean,
    tasks: [{type: Schema.Types.ObjectId, ref: 'Task'}]
});

// userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

export default User;