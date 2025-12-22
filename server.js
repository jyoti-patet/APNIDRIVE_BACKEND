import express from "express"
import "dotenv/config"
import cors from "cors"
import connectDB from "./config/db.js"
import ownerRouter from "./routes/ownerRoutes.js"
import userRouter from "./routes/userRoutes.js"
import bookingRoutes from "./routes/bookingRoutes.js"



 const app=express()

 await  connectDB();

 app.use(cors())
 app.use(express.json())

  app.get("/",(req,res)=>res.send("server is runing"))

  app.use("/api/user",userRouter);
  app.use("/api/owner",ownerRouter);
  app.use("/api/bookings",bookingRoutes);
  


           

 const PORT=process.env.PORT || 3000;
 app.listen(PORT,()=>console.log(`server runig on port ${PORT}`))