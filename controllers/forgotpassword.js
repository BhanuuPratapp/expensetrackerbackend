
const dotenv = require('dotenv');
dotenv.config();
const sgMail = require('@sendgrid/mail')

const User=require("../models/signup")
const uuid = require('uuid');
const Forgotpassword=require("../models/ForgotPasswordRequests")
const encript=require('bcryptjs');
const passwordchangetable=require("../models/signup")
const NodeMailer = require('nodemailer')








exports.forgotpassword=(async (req,res)=>{
    const email=req.body.email;
    
    const id=uuid.v4();
    await User.findAll({where:{email:email}}).then((user)=>{
 if(user){
    
       
console.log(user)
    
    user[0].createForgotpassword({ id:id , isactive: true })
    .catch(err => {
        throw new Error(err)
    })
    
    sgMail.setApiKey(process.env.Send_Grid_Api)
   
    const transporter = NodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'pratapbhanuuu@gmail.com',
            pass: 'dywbmwbvxhbscxhc',
            
        }
    })
 

    const msg = {
        to: email, 
      //from: 'developer001122@gmail.com', 
      from: 'pratapbhanuuu@gmail.com',
        subject: 'Link to Your Pasword changing @expenseTracker',
        text: 'Hie please find below link for your password changing',
        html: `<a href="http://localhost:1000/resetpassword/${id}">Reset password</a>`
    }
   transporter.sendMail(msg)
  //sgMail
  // .send(msg)
    .then((response) => {
    console.log("sendmail successfully")
    return res.json({message: 'Link to reset password sent to your mail ', sucess: true})

   })
   .catch((error) => {
    console.log(error)
  })
}
else{
    throw new Error('User doesnt exist')
}
})})


exports.resetpassword = (req, res) => {
    const id =  req.params.id;
    console.log("ID from url in the link",id)
    Forgotpassword.findOne({ where : { id }}).then(forgotpasswordrequest => {
        console.log("user who has requested the link", forgotpasswordrequest)
        if(forgotpasswordrequest){
            forgotpasswordrequest.update({ isactive: false});
            console.log("Updated User with updated column isActive", forgotpasswordrequest)
            res.status(200).send(`<html>
                                    <form action="/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>Reset password</button>
                                    </form>
                                </html>`
                                )
            res.end()

        }
    })
}
exports.updatepassword=(async (req,res)=>{
    console.log("Bhanu pratap singh jaswal")
    const { newpassword } = req.query;
    console.log("newpassword from the url",newpassword)
    const { resetpasswordid } = req.params;
    console.log("id from the url", resetpasswordid)
    const hashpassword= await encript.hash(newpassword,10);
    console.log("hashpassword we have created", hashpassword)
    Forgotpassword.findAll({where:{id:resetpasswordid}}).then((usertochange)=>{
        console.log("user who has requested for password change", usertochange)
        passwordchangetable.findAll({where:{id:usertochange[0].dataValues.forsignupId}}).then((us)=>{
            console.log("user which we want in the end",us)
            us[0].update({password: hashpassword}).then(()=>{
                console.log("done with resetting the password")
                res.json({message:"successfully changed the password"})
            })

        }).catch(err=>console.log(err))
        

    }).catch(err=>console.log(err))

})

