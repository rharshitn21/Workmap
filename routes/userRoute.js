import express from 'express';
import User from '../models/user.model.js';
import Task from '../models/task.model.js';

const router = express.Router();



router.route('/addtask').get((req, res)=>{
    if(!req.user) return res.redirect('/login');
    res.render('user_addTask', {status: 500});
})
.post((req, res)=>{
    if(!req.user) return res.redirect("/login");
    console.log(req.body);
    const task = new Task(req.body);
    task.username = req.user.username;
    
    console.log(task);
    const id = task._id;
    task.save((err)=>{
        if(err) throw err;
        else {
            User.findOneAndUpdate({username: req.user.username}, {$push: {tasks: id}}, (err)=>{
                if(err) res.render('user_addTask', {status: 400});
                res.render('user_addTask', {status: 200});
            })
        }
    })
});


router.route('/profile').get((req, res)=>{
    if(!req.user) res.redirect('/login');
    else {
        User.findOne({username: req.user.username}, (err, foundUser)=>{
            if(err) throw err;
            else {
                const userData = {
                    name: foundUser.name,
                    contact: foundUser.contact,
                    email: foundUser.email,
                    department: foundUser.department,
                    doj: foundUser.doj,
                }
                res.render('user_profile', {userData: userData, status: 100});
            }
        })
    }
}).post((req, res)=>{

})



router.route('/dashboard').get((req, res)=>{
    if(!req.user) res.redirect('/login');
    else {
         res.render('user_dashboard');
    } 
})

export default router;