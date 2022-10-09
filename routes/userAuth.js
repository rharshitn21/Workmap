import express, { application } from 'express';
import passport from 'passport';
import User from '../models/user.model.js';
import bcrypt from 'bcrypt';


const router = express.Router();

router.route("/admin/addUser").post((req, res)=>{
    User.findOne({username: req.body.email}, (err, foundUser) =>{
        if(err) throw err;
        if(foundUser) {
            // user already exists 
            res.render('admin_addUser', {status: 400, filter: false})
        }
        else {
            bcrypt.hash(req.body.password, 10, (err, hashedPassword)=>{
                const access = "admin";
                const user = new User({
                    ...req.body,
                    username: req.body.email,
                    password: hashedPassword,
                    active: true
                });


                user.save((err)=>{
                    if(err) throw err;

                    else {
                        // redirect back to form saying that it was a success
                        res.render('admin_addUser', {status: 200, filter: false})
                    }
                })
            })  
        }

    })
});


router.route("/login").post((req, res, next)=>{
    console.log(req.body);
    passport.authenticate('local', (err, user, info)=>{
        if(err) throw err;
        if(!user) {
            // Authentication failed
            res.render('login', {lerror: 400});
        }
        else {
            if(!user.active) res.render('login', {lerror: 500});
            else {
                req.logIn(user, err=>{
                    if(err) throw err;
                    // successfully authenticated
                    console.log("successfully authenticated");
                    return res.redirect('/dashboard');
                })
            }
            
        }
    })(req, res, next);
})



router.route('/logout').post((req, res)=>{
    req.logOut((err)=>{
        return res.redirect('/login');
    })
})

export default router;