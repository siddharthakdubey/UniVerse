import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";/* used to send user a web token through which authorization can be done*/
import User from "../models/User.js";

/* Register New User */

export const register=async(req,res)=>{
    try{
        const {
            student_id,
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            branch
        }=req.body;
        const salt=await bcrypt.genSalt();
        const passwordHash=await bcrypt.hash(password,salt);

        const newUser=new User({
            student_id,
           firstName,
           lastName,
           email,
           password:passwordHash,
           picturePath,
           friends,
           branch,
           viewedProfile:Math.floor(Math.random()*10000),
           impression :Math.floor(Math.random()*10000)
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    }catch(err){
        res.status(500).json({error:err.message});
    }
};

/*Logging In */
export const login=async(req,res)=>{
    try{
        const{email,password}=req.body;
        const user=await User.findOne({email:email});
        if(!user) return res.status(400).json({msg:"User does not exist"});
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch) return res.status(400).json({msg:"Iinvalid credentials."});
        const token= jwt.sign({id:user._student_id},process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({token,user});
    }catch(err){
        res.status(500).json({error:err.message});
    }
}