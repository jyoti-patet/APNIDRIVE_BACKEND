import Car from "../models/Car.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Generate Token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register User
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password || password.length < 8) {
            return res.json({ success: false, message: "All fields are required & password must be 8+ chars" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ name, email, password: hashedPassword });

        const token = generateToken(user._id);

        res.json({ success: true, token });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: "Server error" });
    }
};

// Login User
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.json({ success: false, message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.json({ success: false, message: "Invalid password" });

        const token = generateToken(user._id);

        res.json({ success: true, token });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: "Server error" });
    }
};

// Get logged-in user
export const getUserData = async (req, res) => {
    try {
        res.json({ success: true, user: req.user });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: "Server error" });
    }
};

// Get all cars
export const getUserCars = async (req, res) => {
    try {
        const cars = await Car.find({ isAvaliable: true });
        console.log(cars)
        res.json({ success: true, cars });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: "Server error" });
    }
};
