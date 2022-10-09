import express from 'express';
import User from '../models/user.model.js';

const router = express.Router();



router.route("/addUser").get((req, res)=>{
    if(!req.user || req.user.access !== 'admin') return res.redirect('/login');
    res.render("admin_addUser", {status: 100, filter: false});
});

router.route("/dashboard").get((req, res)=>{
    if(!req.user || req.user.access !== 'admin') {
        return res.redirect('/login');
    }
    User.find({access: "user"}, (err, foundUsers)=>{
        if(err) throw err;
        return res.render("admin_dashboard", {usersList: foundUsers, filter: false});
    })
    
});



router.route('/userToggle').post((req, res)=>{
    if(!req.user || req.user.access !== 'admin') return res.redirect('login');
    else {
        console.log(req.body);
        User.findById(req.body.id, (err, foundUser)=>{
            if(err) res.send({status: 400});
            foundUser.active = !foundUser.active;
            foundUser.save((err)=>{
                if(err) res.send({status: 400});
                else {
                    // success
                    res.send({status: 200});
                }
            })
        })
    }
})



export default router;

