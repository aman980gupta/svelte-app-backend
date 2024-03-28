const express = require("express");
const cors = require("cors");
const {register, login,verifyUser,profile} =require("../controllers/authController") ;
const {authentication} = require("../middlewares/authentication")

const router = express.Router();
router.use(cors({
    origin: 'http://localhost:3000',
}));

router.get("/",(req,res)=>{
    res.json({name:"AMAN GUPTA"})
});
router.get("/token",async(req,res)=>{
    const cookieValue =await req.headers.cookie?.split(';').find(cookie => cookie.trim().startsWith('token='));
    const value =await cookieValue ? cookieValue?.split('=')[1] : undefined;
    return res.send('Cookie value: ' + value);
});

router.post("/register",register);
router.post("/login",login);
router.get("/logOut",(req,res)=>{
    res.cookie("token","",{expires:new Date(0)})
    res.status(201).json({msg:"logOut"})
});
router.post("/refresh",(req,res)=>{
    //res.cookie("token","token",{expires:new Date(0) + 60*60*1000})
    res.status(201).json({token:"token"})
});

router.route("/profile").get(authentication,profile);
module.exports = router;