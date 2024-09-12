const User = require("../models/userModels")
const bcrypt = require("bcrypt")
const generateToken = require("../utility-utils/generateToken")
const crypto = require("crypto")
const sendEmail = require("../utility-utils/email")
const registerUser = async (req,res) => {
    const {firstName,lastName,email,phone,password} = req.body

    const userExists = await User.findOne({email})
    if (userExists) {
      return  res.status(400).json({error:"User already exists..." })
    }

    const user = await User.create({firstName,lastName,email,phone,password})
    if (user) {
        const token = generateToken(user._id)
        res.cookie("jwt",token, {
            httpOnly : true,
            sameSite : "strict",
            maxAge : 30*24*60*60*1000,
        })

            res.status(201).json({
                message : "user registered successfully.....",
                user,
                token




            })

        // res.status(201).json({message: "User successfully registered"})
    } else{
        res.status(400).json({error: "Invalid user data"})
    }
}

// login
// const loginUser = async (req,res) => {
//     const {email,password} = req.body

//     const userExists = await User.findOne({email});
//     if(!userExists) {
//         return res.status(400).json({error: `invalid credentials`})
//     }

//     const isMatch = await bcrypt.compare(password, userExists.password);
//     if (!isMatch) {
//         return res.status(400).json({error: `invalid credentials`})
        
//     } else {
//         res.status(200).json({message: "login successfully"})
//     }
   
// }

const userLogin = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        const token = generateToken(user._id)

        res.cookie("jwt", token, {
            httpOnly : true,
            sameSite : "strict",
            maximumAge : 30*24*60*60*1000
        })

        
        res.status(200).json({
            message : "Logged in succesfully",
        user, token
        })
    } else {
        res.status(400).json({ error: "Invalid  user email or password" });
    }
}


const forgetPassword = async (req,res) =>{
    const {email} = req.body

    const user= await User.findOne({email})
    if(!user) {
        res.status(404)
        throw new Error("User not found")
    }

    // generate reset tokens
    const resetToken = crypto.randomBytes(32).toString("hex")
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    user.resetPasswordExpire = Date.now() +10*60*1000

    await user.save()

    const resetUrl = `${req.protocol}://${req.get("host")}/api/users/reset-password/${resetToken}`
    const message = `You are recieving this email because you or someone else has requested a password reset. Please click the following link to reset password: \n\n ${resetUrl}`

    await sendEmail({
        email : user.email,
        subject : "password reset token",
        message : message
    })

    res.status(200).json({success : true, date : "Reset link sent to email......"})
}


module.exports = {registerUser, userLogin, forgetPassword}
