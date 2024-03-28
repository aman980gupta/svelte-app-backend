const express = require("express");
const cors = require("cors");
import { dealerlogin,dealerregister } from "../controllers/dealerControlers";
const router = express.Router();
router.use(cors({
    origin: 'http://localhost:3000',
}));

router.get("/",(req,res)=>{
    res.json({message:"this is deales api point"})
});

router.post("/register",dealerregister);
router.post("/login",dealerlogin);
router.get("/logOut",(req,res)=>{
    res.cookie("dealerToken","",{expires:new Date(0)})
    res.status(201).json({msg:"logOut"})
});
module.exports = router