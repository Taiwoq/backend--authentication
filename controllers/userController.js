const User = require("../models/userModels")
const bcrypt = require("bcrypt")

const registerUser = async (req,res) => {
    const {firstName,lastName,email,phone,password} = req.body

    const userExists = await User.findOne({email})
    if (userExists) {
      return  res.status(400).json({error:"User already exists..." })
    }

    const newUser = await User.create({firstName,lastName,email,phone,password})
    if (newUser) {
        res.status(201).json({message: "User successfully registered"})
    } else{
        res.status(400).json({error: "Invalid user data"})
    }
}

// login
const loginUser = async (req,res) => {
    const {email,password} = req.body

    const userExists = await User.findOne({email});
    if(!userExists) {
        return res.status(400).json({error: `invalid credentials`})
    }

    const isMatch = await bcrypt.compare(password, userExists.password);
    if (!isMatch) {
        return res.status(400).json({error: `invalid credentials`})
        
    } else {
        res.status(200).json({message: "login successfully"})
    }
   
}



module.exports = {registerUser, loginUser}