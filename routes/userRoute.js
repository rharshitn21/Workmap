import express from 'express';
import User from '../models/user.model.js';
import Task from '../models/task.model.js';
import bcrypt from 'bcrypt';
import passport from 'passport';


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
                res.render('user_profile', {userData: userData, prstatus: 100, pastatus: 100});
            }
        })
    }
}).post((req, res)=>{
    if(!req.user) return res.redirect('/login');
    else {
            User.findOneAndUpdate({username: req.user.username}, {
                name: req.body.name,
                contact: req.body.contact,
                department: req.body.department,
            }, (err, foundUser)=>{
                const userData = {
                    name: foundUser.name,
                    contact: foundUser.contact,
                    email: foundUser.email,
                    department: foundUser.department,
                    doj: foundUser.doj,
                }
                if(err ) res.render('user_profile', {userData: userData, prstatus: 400, pastatus: 100});
                // update profile
                res.render('user_profile', {userData: userData, prstatus: 200, pastatus: 100});
            });
    }
})


router.route("/changepasswd").post((req, res)=>{
    if(!req.user) return res.redirect("/login");
    else {
        bcrypt.hash(req.body.password, 10, (err, hashedPassword)=>{
            if(err) throw err;
            else {
                User.findOneAndUpdate({username: req.user.username}, {
                    password: hashedPassword
                }, (err, foundUser)=>{
                    const userData = {
                        name: foundUser.name,
                        contact: foundUser.contact,
                        email: foundUser.email,
                        department: foundUser.department,
                        doj: foundUser.doj,
                    }
                    if(err ) res.render('user_profile', {userData: userData, prstatus: 100, pastatus: 400});
                    // update profile
                    req.logOut((err)=>{
                        if(err) throw err;
                        return res.render('passwdChange_success');
                    })
                })
            }
        });
    }
})



router.route("/data/:id").get((req, res)=>{
    if(!req.user || req.user.access === 'user') return res.redirect('/login');
    else {
        res.render('user_info');
    }
})  






router.route('/dashboard').get((req, res)=>{
    if(!req.user) res.redirect('/login');
    else {
        res.render('user_dashboard');
    } 
})

export default router;