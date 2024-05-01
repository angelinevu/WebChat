//Here are the controller functions for user routes

import User from "../models/userModel.js"
import bcrypt from "bcryptjs"

import generateTokenandSetCookie from "../utils/generateToken.js"

//Signup Controller
//**********************************************************************************************************
export const signup = async (req, res) => {
    try {
        const { email, username, name, password, confirmPassword } = req.body      //Parse fields
        if (password != confirmPassword) {                                         //Passwords match?
            return res.status(400).json({ error: "Password fields do not match." })
        }

        const user = await User.findOne({ $or: [{ email }, { username }] });         //Find user for criteria:
        if (user) {
            if (user.email === email) {                                              //Email uniqueness
                return res.status(400).json({ error: "Email already exists." });
            } else {                                                                 //Username uniqueness
                return res.status(400).json({ error: "Username already exists." });
            }
        }

        const salt = await bcrypt.genSalt(10)       //Encrypt password
        const hashedPassword = await bcrypt.hash(password, salt)

        const pic = `https://avatar.iran.liara.run/public?username=${username}`  //Set random PFP
        const newUser = new User({                                               //Create new user
            email,
            username,
            name,
            password: hashedPassword,
            pic
        })

        if (newUser) {
            generateTokenandSetCookie(newUser._id, res)     //Generate JWT token
            await newUser.save()                            //Save to DB
            res.status(201).json({                          //Return user data
                _id: newUser._id,
                username: newUser.username,
                name: newUser.name,
                pic: newUser.pic
            })
        }
        else {                                              //Invalid
            res.status(400).json({ error: "Invalid user data" })
        }

    } catch (error) {           //Error
        console.log("Error in Signup Controller", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

//Signin Controller
//**********************************************************************************************************
export const signin = async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({ username })                           //Parse body
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "") //Validate password

        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid Credentials" })
        }

        generateTokenandSetCookie(user._id, res)        //Generate JWT token
        res.status(200).json({                          //Return user data
            _id: user._id,
            username: user.username,
            name: user.name,
            pic: user.pic
        })

    } catch (error) {
        console.log("Error in Signin Controller", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

//Signout Controller
//**********************************************************************************************************
export const signout = (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge:0})       //Clear JWT
        res.status(200).json({ message: "Logged out successfully" })
        
    } catch (error) {
        console.log("Error in Signout Controller", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}