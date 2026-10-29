const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const User = require("../models/user.model");

const register = async (req, res, next) => {
    try{
         const { name, email, password } = req.body ?? {};

        if(typeof name !== "string" || name.trim() === ""){
            return res.status(400).json({
                message: "Name is required"
            });
        }

        if(typeof email !== "string" || email.trim() === ""){
            return res.status(400).json({
                message: "Email is required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            return res.status(400).json({
                message: "Please provide a valid email"
            });
        }

        if(typeof password !== "string" || password.length < 15){
            return res.status(400).json({
                message: "Password must contain at least 15 characters"
            });
        }
        
        const passwordHash = await argon2.hash(password);

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            passwordHash
        });

        return res.status(201).json({
            message: "User registered successful",

            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    }catch(error){
        if(error.code === 11000){
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        next(error);

    }
};


const login = async (req, res, next) => {
    try{
        const { email, password } = req.body ?? {};

        if(
            typeof email !== "string" ||
            email.trim() === "" ||
            typeof password !== "string" ||
            password === ""
        ){
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase()
        }).select("+passwordHash");

        if(!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }
        
        const isMatch = await argon2.verify(
            user.passwordHash,
            password
        );

        if(!isMatch){
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {},
            process.env.JWT_SECRET,
            {
                subject: user._id.toString(),
                algorithm: "HS256",
                expiresIn: "1h"
            }
        );

        return res.status(200).json({
            message: "Login successful",
            token
        });
    }catch (error){
        next(error);
    }
};

module.exports = { register, login };