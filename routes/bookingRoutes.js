import express from 'express'
import { changeBookingStatus, checkAvailabilityOfCar, createBooking, getOwnerBookings, getUserBookings } from '../controllers/bookingController.js';
 import {protect} from '../middleware/auth.js' ;
const bookingRoutes=express.Router();
bookingRoutes.post('/check-availability',checkAvailabilityOfCar);
bookingRoutes.post('/create', protect ,createBooking);
bookingRoutes.get('/user', protect,getUserBookings);
bookingRoutes.get('/owner', protect, getOwnerBookings);
bookingRoutes.post('/change-status', protect, changeBookingStatus)


export default bookingRoutes;
         
