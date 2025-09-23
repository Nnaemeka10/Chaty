import { sendWelcomeEmail } from '../emails/emailHandlers.js';
import { generateToken } from '../lib/utils.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { ENV } from '../lib/env.js';



//signup controller
export const signup = async (req, res) => {

    const { initusername, initemail, initpassword } = req.body;
    const username = typeof initusername === 'string' ? initusername.trim() : '';
    const email = typeof initemail === 'string' ? initemail.trim().toLowerCase() : '';
    const password = typeof initpassword === 'string' ? initpassword : '';


    //validation
    if(!username || !email || !password){
        return res.status(400).json({message: 'All fields are required'});
      }  

      if(password.length < 6){
        return res.status(400).json({message: 'Password must be at least 6 characters'});
      }

      //check if email is valid: regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
        return res.status(400).json({message: 'Please enter a valid email'});
    }


    try {
      
        //check if user already exists
        const user = await User.findOne({email});
        if(user) return res.status(400).json({message: 'User already exists'});
        // 123456 => $dnjakjkhskshk
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        })

        if (newUser) {
            const savedUser = await newUser.save();
            generateToken(savedUser._id, res)

            res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });

        
        // Send welcome email
        try {
           await sendWelcomeEmail(savedUser.email, savedUser.username, ENV.CLIENT_URL);
        }  catch (error) {
            console.error("Failed to send welcome email:", error);
        }


        }else{
            return res.status(400).json({message: 'Invalid user data'});
        }
    } catch (error) {
        console.log("Error in signup controller: ", error);

        // handle race condition for duplicate email
        if(error?.code === 11000 && (error.keyPattern?.email || error.keyValue?.email)){
            return res.status(409).json({message: 'Email already exists'});
        }
        return res.status(500).json({message: 'Server error'});
    }
}

//login controller
export const login = async (req, res) => {
    const { initemail, initpassword } = req.body;
    const email = typeof initemail === 'string' ? initemail.trim().toLowerCase() : '';
    const password = typeof initpassword === 'string' ? initpassword : '';

     if(!email || !password){
            return res.status(400).json({message: 'Email and password are required'});
    }
    try {
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message: 'Invalid credentials'});
        // never tell the user which one is incorrect

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect) return res.status(400).json({message: 'Invalid credentials'});

        generateToken(user._id, res)

        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePic: user.profilePic,
        });

    } catch (error) {
        console.error("Error in login controller: ", error);
        return res.status(500).json({message: 'Internal Server error'});
    }
}


export const logout = (_, res) => {
    res.cookie('jwt', "",{ maxAge:0 });
    res.status(200).json({message: 'Logged out successfully'});
};