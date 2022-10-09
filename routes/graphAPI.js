import e from 'express';
import express from 'express';
import User  from '../models/user.model.js';
const router = express.Router();

// /graphinfo

router.route("/userdata").post((req, res)=>{
    // if(!req.user || req.user.access == 'user') return {status: 401};
    // else {
    //     if(!req.user) return res.redirect('/login');

    // populate tasks field in user document
    console.log(req.body);
    User.findById(req.body.id).populate('tasks').exec(async(err, foundUser)=>{
        const chartData = {
            status: 200,
            name: foundUser.name,
            today: [0, 0, 0],
            yesterday: [0, 0, 0]
        }
        if(err || !foundUser) res.send(chartData);
        else {
            const tdate = new Date();
            const ydate = new Date();
            ydate.setDate(ydate.getDate() - 1);

            tdate.setHours(0,0,0,0);
            ydate.setHours(0,0,0,0);
            // if(foundUser.tasks !== null) {
                await foundUser.tasks.forEach((task)=>{
                    task.start_time.setHours(0,0,0,0);
                    if(task.start_time.getTime() === tdate.getTime()) {
                        if(task.type === "Break")
                            chartData.today[0] += task.time_taken;
                        else if (task.type === "Meeting")
                            chartData.today[1] += task.time_taken;
                        else 
                            chartData.today[2] += task.time_taken;
                    }
                    else if (task.start_time.getTime() === ydate.getTime()) {
                        if(task.type === "Break")
                            chartData.yesterday[0] += task.time_taken;
                        else if (task.type === "Meeting")
                            chartData.yesterday[1] += task.time_taken;
                        else 
                            chartData.yesterday[2] += task.time_taken;
                    }
                });
            // }
            

            res.send(chartData);
        }

    })

    // }
})

router.route("/piechartdata").get((req, res)=>{
    if(!req.user) return res.redirect('/login');

    // populate tasks field in user document
    const username = req.user.username;
    User.findOne({username: username}).populate('tasks').exec(async(err, foundUser)=>{
        if(err) throw err;
        const chartData = {
            today: [0, 0, 0],
            yesterday: [0, 0, 0]
        }
        const tdate = new Date();
        const ydate = new Date();
        ydate.setDate(ydate.getDate() - 1);

        tdate.setHours(0,0,0,0);
        ydate.setHours(0,0,0,0);
        // if(foundUser.tasks !== null) {
            await foundUser.tasks.forEach((task)=>{
                task.start_time.setHours(0,0,0,0);
                if(task.start_time.getTime() === tdate.getTime()) {
                    if(task.type === "Break")
                        chartData.today[0] += task.time_taken;
                    else if (task.type === "Meeting")
                        chartData.today[1] += task.time_taken;
                    else 
                        chartData.today[2] += task.time_taken;
                }
                else if (task.start_time.getTime() === ydate.getTime()) {
                    if(task.type === "Break")
                        chartData.yesterday[0] += task.time_taken;
                    else if (task.type === "Meeting")
                        chartData.yesterday[1] += task.time_taken;
                    else 
                        chartData.yesterday[2] += task.time_taken;
                }
            });
        // }
        

        res.send(chartData);
    })

})



export default router;