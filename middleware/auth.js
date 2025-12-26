import jwt from "jsonwebtoken";

import User from "../models/User.js";

 export const protect=async(req,res,next)=>{
   // console.log(req.headers.authorization);
    const token=req.headers.authorization.split(" ")[1] || req.headers.authorization;
        if(!token){
        return res.json({success:false ,message:"not Authorized"})
    }
    try{
        const userId=jwt.decode(token,process.env.JWT_SECRET)
          if(!userId.id){
        return res.json({success:false ,message:"User not found"})
    }
     req.user= await User.findById(userId.id).select("-password");
     next();

    }catch(error){
        console.log("error is" ,error.message);
        res.json({success:false, message:" error message"})
        
    }
}
