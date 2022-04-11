const router =require("express").Router();
const User=require("../models/User");
const bcrypt=require("bcrypt");

router.post("/register",async(req,res)=>{
    try{ 

        // gentrating new password
        const salt=await bcrypt.genSalt(10);
        const hashPassword= await bcrypt.hash(req.body.password,salt);
        // creating new user
        const newUser=new User({
            username:req.body.username,
            email:req.body.email,
            password:hashPassword,
        });
        
        // save  user and return response
        const user=await newUser.save();
        res.sendStatus(200).json(user);

    }
    catch(err){
        res.sendStatus(500).json(err);
    }
});

// login

router.post("/login",async(req,res)=>{
    try{
        const user=await User.findOne({username:req.body.username});
        !user && res.sendStatus(400).json("register yourself to be a user");

        const validated= await bcrypt.compare(req.body.password,user.password);
        !validated && res.sendStatus(400).json("wrong password budddy");

        
        res.sendStatus(200).json(user);

    }catch(err){
        res.sendStatus(500).json(err);
    }
})

module.exports=router;