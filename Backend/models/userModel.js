const mongoose=require("mongoose")

const userSchema=mongoose.Schema({
username:String,
password:String
},
{timestamps:true})

const Usermodel=mongoose.model("playousers",userSchema)

module.exports = Usermodel;
