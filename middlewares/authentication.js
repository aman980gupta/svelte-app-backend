const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const ObjectID = require('mongodb').ObjectId;
const client = require("../db/mongodbClient") 
const authentication = asyncHandler(async(req,res,next) =>{
  try {
    const {token} = req.cookies;
    if (!token) {
      res.status(401).json({ message: 'Unauthorized',success:false });
      return;
    } 
      const decoded = await jwt.verify(token, process.env.JWT_SECREt); 
      console.log(decoded._id)
      const isUser = await client.db(process.env.MONGO_DB).collection(process.env.MONGO_COLLECTION_USERS).findOne({ "_id":new ObjectID(decoded._id)});
      //console.log('Token decoded:', decoded);
      
       if(isUser){
         console.log("protect worked",isUser)

          next()
       }else{res.status(500).json({message:"invalid user",success:false})}
      // Now you can use the decoded token for authentication and authorization
    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(401)
      res.json({ message: 'Token verification failed:' });
    }
    
    
 });
 module.exports = {authentication}