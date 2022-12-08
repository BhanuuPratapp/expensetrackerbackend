
const Razorpay = require('razorpay');
const Order = require('../models/orders')
const ledb=require("../models/leaderboard")
const expenses=require("../models/foruser")
const filecontentURL = require("../models/filecontent")
const AWS=require("aws-sdk")
const dotenv  = require('dotenv')
dotenv.config();



function Uploadfiles(data,filename,id){
   
    return new Promise((resolve,rejected)=>{
        let s3bucket=new AWS.S3({
            accessKeyId:process.env.AwsAccessKey,
            secretAccessKey:process.env.AwsSecrectKey
        })

        
        
        var params={
            Bucket:process.env.AwsBucket,
            Key:filename,
            Body:data,
            ACL:'public-read'
        }        

        s3bucket.upload(params,(err,response)=>{
           
            if(err){
                console.log(err)
                rejected(err)
            }
            else{
                console.log(response)
                fileContents(response.Location,id);
               // req.user.createFilecontent({filecontenturl: response.Location})
               // req.user.getFilecontents().then(response => {console.log("1212121212121212121212",response)})
                resolve(response.Location)
            }

        })
    })


}

async function fileContents(filecontent,id)
{
await filecontentURL.create({filecontenturl: filecontent,
                          forsignupId: id
                            })
}
const purchasepremium =async (req, res) => {
    try {
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        const amount = 2500;

        rzp.orders.create({amount, currency: "INR"}, (err, order) => {
            if(err) {
                throw new Error(err);
            }
            req.user.createOrder({ orderid: order.id, status: 'PENDING'}).then(() => {
                return res.status(201).json({ order, key_id : rzp.key_id});

            }).catch(err => {
                throw new Error(err)
            })
        })
    } catch(err){
        console.log(err);
        res.status(403).json({ message: 'Sometghing went wrong', error: err})
    }
}

 const updateTransactionStatus = (req, res ) => {
    try {
        const { payment_id, order_id} = req.body;
        Order.findOne({where : {orderid : order_id}}).then(order => {
            order.update({ paymentid: payment_id, status: 'SUCCESSFUL'}).then(() => {
                req.user.update({ispremiumuser: true})
                return res.status(202).json({sucess: true, message: "Transaction Successful"});
            }).catch((err)=> {
                throw new Error(err);
            })
        }).catch(err => {
            throw new Error(err);
        })
    } catch (err) {
        console.log(err);
        res.status(403).json({ errpr: err, message: 'Sometghing went wrong' })

    }
}

const is_premium = exports.is_premium=(req,res)=>
{
        if(req.user.ispremiumuser)
        {
            res.json({ispremium:true})
        }
}

const leaderboard = exports.leaderboard=(req,res)=>
{
    ledb.findAll({order: [
        ['totalexpense', 'DESC']
    ]}).then((users)=>{

        res.json({users})
    }).catch(err=>console.log(err))
}

const report = exports.report=(req,res)=>{
    console.log(req.user)
    const user1=req.user
 
    expenses.findAll({where:{forsignupId:user1.id}}).then((re)=>{
        console.log(re)
        res.json({re})
    }).catch(err=>console.log(err))
   


}


const fileURL = exports.fileContents = (req, res, next) =>{

req.user.getFilecontents().then((response) =>{
    res.status(200).json({success:true,data:response,message:"successfully fetched the URLs from user"})
})

}


const reportdownload = exports.reportdownload=async (req,res)=>{
   
    try{

     //   if(req.user.ispremiumuser){
    const data=await expenses.findAll({where:{forsignupId:req.user.id}});
    const stringifieddata=JSON.stringify(data);
    const id = req.user.id;
    const filename=`Expense${req.user.id}/${new Date()}.txt`
  
    const fileurl= await Uploadfiles(stringifieddata,filename,id)
    console.log(fileurl)
    res.status(200).json({fileurl,success:true})
 //   }
/*
else
{
    console.log("user is not premium memmber")
    res.status(401).json({success:false, message:"user not authorized"}) 
}
*/
    }
    catch(err){
        res.status(500).json({fileurl:'',success:false})

    }



}
module.exports = {
    purchasepremium,
    updateTransactionStatus,
   
    is_premium,
    leaderboard,
    reportdownload,
    report,
    fileURL
}