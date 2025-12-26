import Booking from "../models/Booking.js"

 const checkAvailability=async(carId,pickupDate,returnDate)=>{
    const bookings=await Booking.find({
        car:carId,
        pickupDate:{$lte: returnDate},
        returnDate:{$gte: pickupDate},
    })
    return bookings.length===0;

 }

 export const checkAvailabilityOfCar=async(req,res)=>{
    try{
        const{location,pickupDate,returnDate}=req.body

        const cars=await Car.find({location, isAvaliable:true})

        const avilableCarsPromises=cars.map(async(car)=>{
             const isAvaliable= await checkAvailability(car._id , pickupDate, returnDate)
             return{...car._doc, isAvaliable: isAvaliable}
        })
        const avilableCars=await Promise.all(avilableCarsPromises);
        avilableCars=avilableCars.filter(car=>car.isAvaliable===true)

        res.json({success:true , avilableCars})

    }
    catch(error){
        console.log(error.message);
        res.json({success:false, message:error.message})
        
    }
 }

 export const createBooking=async(req,res)=>{
    try{
        const{_id}=req.user;
        const{car,pickupDate,returnDate}=req.body

        const isAvaliable=await checkAvailability(car,pickupDate,returnDate)
        if(!isAvaliable){
            return res.json({success:false, message:"car is not available"})
        }

        const carData=await Car.findById(car)



        //calculate price based on pickupdate and returnadte
        const picked=new Date(pickupDate);
        const returned=new Date(returnDate);
        const noOfDate=Math.ceil((returned-picked)/ (1000*60*60*24))
        const price=carData.pricePerDay *noOfDate;

        await Booking.create({car,owner: carData.owner, user:_id,pickupDate,returnDate,price})
        res.json({success:true, message:"Booking Created"})
    }

    catch(error){
         console.log(error.message);
        res.json({success:false, message:error.message})

    }
}

 export const getUserBookings=async(req,res)=>{
    try{
        const{_id}=req.user;
        const bookings=await Booking.find({user:_id}).populate("car").sort({createAt:-1})
        res.json({success:true, bookings})


    } catch(error){
          console.log(error.message);
        res.json({success:false, message:error.message})
    }
 }

export const getOwnerBookings=async(req,res)=>{
    try{
       if(req.user.role!=='owner'){
        return res.json({success:false , message:"unauthorized"})
       }

        const bookings=await Booking.find({owner:req.user._id}).populate('car user').select('-user.password').sort({createAt:-1})
        console.log(bookings);
        res.json({success:true, bookings})
       

    } catch(error){
          console.log(error.message);
        res.json({success:false, message:error.message})
    }
 }

 export const changeBookingStatus=async(req,res)=>{
    try{
        const{_id}=req.user;
        const{bookingid,status}=req.body
        const booking=await Booking.findById(bookingid)

        if(booking.owner.toString()!==_id.toString()){
            return res.json({success:false, message:"unauthorized"})
        }

        booking.status=status;
        await booking.save();
        res.json({success:true , message:"Message update"})
        

    } catch(error){
          console.log(error.message);
        res.json({success:false, message:error.message})
    }
 }



