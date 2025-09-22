import jwt from 'jsonwebtoken';

// generate JWT token
export const generateToken = (userId, res) => {
    //authenticate user using JWT
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '7d', // token will expire in 30 days
    });

    //send the the token back as cookie
    res.cookie("jwt", token, {
        maxAge: 7*24*60*60*1000, // 7 days in milliseconds
        httpOnly: true, // cookie cannot be accessed by client side js, prevent XSS attacks: cross site scripting attacks
        sameSite: "strict", // CSRF attacks: cross site request forgery attacks
        secure: process.env.NODE_ENV === 'development' ? false : true, // cookie only sent over https in production
    });

    return token;
};