const mongoose = require("mongoose")

const bcrypt = require("bcrypt")

const userSchema = mongoose.Schema({
    firstName : {
        type : String,
        required : true,
    },
    lastName : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    phone : {
        type : Number,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
        
    }
},{
        timestamps : true
    })


    userSchema.pre("save",async function(next){
        if (!this.isModified("password")) {
            return next()
        }
    
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
    })
    

    module.exports = mongoose.model("User",userSchema)