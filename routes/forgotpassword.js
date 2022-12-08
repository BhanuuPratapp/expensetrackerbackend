
const express=require('express')
const router=express.Router()


const fgtpwd=require("../controllers/forgotpassword")



router.post("/forgotpassword",fgtpwd.forgotpassword);
router.get("/resetpassword/:id",fgtpwd.resetpassword);
router.get("/updatepassword/:resetpasswordid",fgtpwd.updatepassword);










module.exports=router
