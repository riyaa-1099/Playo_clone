const jwt = require("jsonwebtoken")
require('dotenv').config();

const authentication=async(req,res,next)=>{
    
const token=req.headers.authorization?.split(" ")[1] ;
// console.log(token)
if (!token) {
    return res.status(401).send({"msg":"You are not authorized"});
}

try{
    const decoded=jwt.verify(token,process.env.secretKey);
  
if(decoded){
    
const userId=decoded.userId;
req.body.userId=userId;
// console.log(userId)
next()

}
}
catch(err){
    console.log(err)
    res.send({msg:"Login again",status:err.message})
}

}

module.exports=authentication;