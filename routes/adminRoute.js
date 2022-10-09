import express from 'express';
import User from '../models/user.model.js';

const router = express.Router();



router.route("/addUser").get((req, res)=>{
    if(!req.user || req.user.access !== 'admin') return res.redirect('login');
    res.render("admin_addUser", {status: 400});
});

router.route("/dashboard").get((req, res)=>{
    console.log(req.user);
    if(!req.user || req.user.access !== 'admin') {
        console.log("h");
        return res.redirect('/login');
    }
    User.find({access: "user"}, (err, foundUsers)=>{
        if(err) throw err;
        console.log(foundUsers);
        return res.render("admin_dashboard", {usersList: foundUsers});
    })
    
});







export default router;

