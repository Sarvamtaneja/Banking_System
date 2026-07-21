const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const emailService = require("../services/email.service");
const tokenBlackListModel = require("../models/blackList.model")

/**
 * - user register controller
 * - POST /api/auth/register
 */
async function userRegisterController(req,res){
    const {email, password, name} = req.body;

    const doesUserExist = await userModel.findOne({
        email:email
    })

    if(doesUserExist){
        return res.status(402).json({
            message:"User already exists with email",
            status:"failed"
        })
    }

    const user = await userModel.create({
        email, password, name
    })

    const token = jwt.sign({userId:user._id},process.env.JWT_SECRET, {expiresIn:"3d"});

    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" });

    res.status(201).json({
        user:{
            _id: user._id,
            email: user.email,
            name: user.name
        },
        token
    })

    await emailService.sendRegistrationEmail(user.email, user.name);
}

/**
 * - user Login controller
 * - POST /api/auth/login 
 */
async function userLoginController(req,res){
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");

    if(!user){
        return res.staus(401).json({
            message: "email or password is INVALID"
        })
    }

    const isValidPassword = await user.comparePassword(password);

    if(!isValidPassword){
        return res.status(401).json({
            message:"email or password is INVALID"
        })
    }

    const token = jwt.sign({ userId: user._id}, process.env.JWT_SECRET, {expiresIn: "3d"});

    res.cookie("token",token, { httpOnly: true, secure: true, sameSite: "none" });

    res.status(200).json({
        user:{
            _id: user._id,
            email: user.email,
            name: user.name
        },
        token
    });

    await emailService.sendLoginEmail(user.email, user.name);
}

/**
 * - User Logout Controller
 * - POST /api/auth/logout
 */

async function userLogoutController(req,res){

    const token = req.cookies.token || req.headers.authorization?.split("")[ 1 ]

    if(!token){
        return res.status(200).json({
            message: "User logged out successfully"
        })
    }

    await tokenBlackListModel.create({
        token: token
    })

    res.clearCookie("token", { sameSite: "none", secure: true });

    return res.status(200).json({
        message: "User logged out successfully"
    })

}

module.exports = {
    userRegisterController,
    userLoginController,
    userLogoutController
};