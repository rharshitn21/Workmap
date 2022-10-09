import User from '../models/user.model.js';
import localStrategy from 'passport-local';
import bcrypt from 'bcrypt';

export default function passportStrategy(passport) {

    passport.use(
        new localStrategy((username, password, done)=>{
            User.findOne({username: username}, (err, foundUser)=>{
                if(err)
                    throw err;
                if(!foundUser) {
                    return done(null, false);
                }
                bcrypt.compare(password, foundUser.password, (err, result)=>{
                    if(err)
                        throw err;
                    if(result === true) {
                        return done(null, foundUser);
                    }
                    else {
                        return done(null, false);
                    }
                })
            })
        })
    );


    passport.serializeUser((user, cb)=> {
        // console.log(user._id);
        cb(null, user._id);
    });

    passport.deserializeUser((id, cb)=>{
        User.findOne({_id: id}, (err, foundUser)=>{
            const userInformation = {
                id: foundUser._id,
                username: foundUser.username,
                access: foundUser.access,
                active: foundUser.active
            };
            // console.log(userInformation);
            cb(err, userInformation);
        });
    });

}