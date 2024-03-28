const express = require("express");
const client = require("../db/mongodbClient");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const env = require("dotenv").config();
const ObjectID = require('mongodb').ObjectId;

const login = asyncHandler(async (req,res)=>{
   try {
      const {password,email} = req.body;
      if(!email || !password  ){
         throw new Error(JSON.stringify({success:false,message:"no email or password"}))
      }
      await client.connect()
      const user = await client.db(process.env.MONGO_DB).collection(process.env.MONGO_COLLECTION_USERS).findOne({email});
      if(!user){res.status(401).json({message:"this email not exist",success:false});return;}
      const isMatch = await bcrypt.compareSync(password,user.password);
      if(!isMatch){res.status(401).json({message:"credentials are wrong try again",success:false});return;}

      const token = await jwt.sign({_id:user._id,email:user.email},process.env.JWT_SECREt,{ expiresIn: '1d' })
       await res.cookie("token" , token, {expire : 24 * 60 * 60 * 1000 ,HttpOnly: true});
      await res.setHeader('token', token);
      console.log("login work and user email", token)
      return res.status(201).json({message:"login successfull and cookie set",success:true})
   } catch (error) {
      console.log(error)
      throw new Error(error)
      //res.status(401).json({msg:"no some thing wrong"})
   }
});
const register = asyncHandler(async (req,res)=>{
   try {
      const {first_name,last_name, password,email} = req.body;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword =await bcrypt.hashSync(password,salt);

      const exits = await client.db(process.env.MONGO_DB).collection(process.env.MONGO_COLLECTION_USERS).findOne({email});
      
      if(!exits){
         await client.connect()
         const collection = await client.db(process.env.MONGO_DB).collection(process.env.MONGO_COLLECTION_USERS)
         .insertOne({first_name, last_name, password:hashedPassword, email })
         console.log(collection.insertedId)
         res.status(200).json({message:`object inserted and object id is ${collection.insertedId}`})
      }else{res.status(400).json({message:"user alraidy existe",success:false})}
      
   } catch (error) {
      //console.log(error)
      throw new Error(error)
   }
});
const verifyUser = asyncHandler(async (req,res,next)=>{
   const {token} = req.cookies;
   if (token){
      console.log(token)
      //res.status(200).json({token})
      next()
   }else{
      console.log("no token",token)
      //res.status(401).json({msg:"no token"})
      res.status(400).json({msg:"no token"})
   }
});
const profile= asyncHandler(async(req,res)=>{

   const token = req.cookies.token;
   if(!token){
    res.status(400).json({success:false,message:"no token found"})
   }
   // console.log("token in authroute",token)
   // res.cookie("token",token)
   // res.json({token})
   res.status(200).json({token})
});





module.exports = {register,login,verifyUser,profile}