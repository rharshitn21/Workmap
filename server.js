import express from 'express';
import path from 'path'
import 'dotenv/config';
import mongoose from 'mongoose';
import passport from "passport";
import session from 'express-session';
import cookieParser from 'cookie-parser';
import bodyParser from "body-parser";
import User from './models/user.model.js';
import Task from './models/task.model.js';


const __dirname = path.resolve();
const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(cookieParser(process.env.SECRET));

app.use(passport.initialize());
app.use(passport.session());



import passportConfig from './routes/passportConfig.js'; passportConfig(passport);

// ----------------------- routes ------------------------- //


import adminRoute from "./routes/adminRoute.js";
import userRoute from "./routes/userRoute.js";
import userAuth from "./routes/userAuth.js";
import graphAPI from "./routes/graphAPI.js";

mongoose.connect(process.env.MONGOURI);


app.use('/', userAuth);

app.use("/admin", adminRoute);
app.use("/user", userRoute);

app.route('/login').get((req, res)=>{
    res.render('login');
});


app.use('/graphinfo', graphAPI);



app.route('/dashboard').get((req, res)=>{
    console.log(req.user);
    if(!req.user) return res.redirect('/login');
    else if (!req.user.active) {
        // user not allowed to login
        return res.render('login', {message: 'User Inactive'});
    }
    else if (req.user.access === 'admin') {
        // admin rendering
        return res.redirect('/admin/dashboard');
    }
    else {
        // user rendering
        return res.redirect('/user/dashboard');
    }
})




app.listen(process.env.PORT || 3000, ()=>{
console.log("The server is up and running at port 3000...");
});