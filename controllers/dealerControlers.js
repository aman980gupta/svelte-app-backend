const express = require("express");
const client = require("../db/mongodbClient");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const env = require("dotenv").config();
const ObjectID = require('mongodb').ObjectId;
const dealerDetails = {
    dealership_email:"",
    dealership_id:"",
    dealership_name:"",
    dealership_location:"",
    dealership_info:{},
    password:"",
    cars:[],
    deals:[],
    sold_vehicles:[]
}
const dealerlogin = asyncHandler(async (req,res)=>{
    try {
       const {password,dealership_email} = req.body;
       if(!dealership_email || !password  ){
          throw new Error(JSON.stringify({success:false,message:"no email or password"}))
       }
       await client.connect()
       const dealer = await client.db(process.env.MONGO_DB).collection(process.env.MONGO_COLLECTION_dealers).findOne({dealership_email});
       if(!dealer){res.status(401).json({message:"this email not exist",success:false});return;}
       const isMatch = await bcrypt.compareSync(password,dealer.password);
       if(!isMatch){res.status(401).json({message:"credentials are wrong try again",success:false});return;}
       const dealerForJWT =await client.db(process.env.MONGO_DB).collection(process.env.MONGO_COLLECTION_dealers).findOne({dealership_email},{ projection: { password: 0, dealership_location:0,dealership_info:0,cars:0, deals:0,sold_vehicles:0} } );
 
       const token = await jwt.sign(dealerForJWT,process.env.JWT_SECREt,{ expiresIn: '1d' })
        await res.cookie("dealerToken" , token, {expire : 24 * 60 * 60 * 1000 ,HttpOnly: true ,sameSite:true,secure:true});
       await res.setHeader('dealerToken', token);
       console.log("login work and user email", token)
       return res.status(201).json({message:"login successfull and cookie set",success:true})
    } catch (error) {
       console.log(error)
       throw new Error(error)
       //res.status(401).json({msg:"no some thing wrong"})
    }
 });
 const dealerregister = asyncHandler(async (req,res)=>{
    try {
       const {password,dealership_email,dealership_id,dealership_name,dealership_location} = req.body;
       const salt = await bcrypt.genSalt(10);
       const hashedPassword =await bcrypt.hashSync(password,salt);
 
       const exits = await client.db(process.env.MONGO_DB).collection(process.env.MONGO_COLLECTION_USERS).findOne({dealership_email});
       
       if(!exits){
          await client.connect()
          const collection = await client.db(process.env.MONGO_DB).collection(process.env.MONGO_COLLECTION_USERS).createIndex({dealership_email:1},{unique:true}).insertOne({...dealerDetails, password:hashedPassword, dealership_email:dealership_email,dealership_id,dealership_name,dealership_location })
          console.log(collection.insertedId)
          res.status(200).json({message:`object inserted and object id is ${collection.insertedId}`})
       }else{res.status(400).json({message:"user alraidy existe",success:false})}
       
    } catch (error) {
       //console.log(error)
       throw new Error(error)
    }
 });
 module.exports = {dealerlogin,dealerregister}