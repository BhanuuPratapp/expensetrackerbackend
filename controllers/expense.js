
const { NUMBER } = require('sequelize');
const User = require('../models/foruser');

const ledBoard = require('../models/leaderboard');

exports.postAddUser =  async (req, res, next) =>{
  try{
   const expenseamount  = req.body.expanseAmount;

   const description = req.body.Description;
   const category = req.body.Category;
  //const userId = req.user.id;

   if(!req.body.expanseAmount){
     throw new Error("Expense amount is mandatory");
   }
  
 
  const data = req.user.createForuser({expenseamount:expenseamount, description:description,category:category})
.then((response) =>{
  
 req.user.getLeaderboard().then(async (e)=>{

     var value= e.dataValues.totalexpense
     value +=Number(expenseamount)
     if(isNaN(value) || value <= 0)
     {
       value = 0;
     }
     await e.update({totalexpense: value}).then((e1)=>{}).catch(err=>console.log(err))
     
     
})
res.status(201).json({newUserDetail: response}); 
})
 .catch(err=>console.log(err))


  }
  catch(err){
   res.status(500).json({
     error: err
   })
  }
 }

 /*
 exports.getUser =  async(req, res, next) =>{
  try{
    const users = await req.user.getForusers();
   
  //const users = await User.findAll({where:{forsignupId: req.user.id}});
 
  res.status(200).json({allUsers: users})
  }
  catch(err){
    console.log('GetUser is failing ', JSON.stringify(err))
    res.status(500).json({error: err})
  }
}

*/

exports.getUser=(async (req,res,next)=>{
  console.log("i am in expenses")
  let option = parseInt(req.header('Option'))
  console.log(typeof(option))
// console.log("Optionssssssss",Option.typeOf)
const page= req.query.page || 1 ;

//items_perpage = option;
const userId=req.user.id;
const expcount=await User.count({where:{forsignupId:userId}})
const hasnextpage=option*page<expcount;

const haspreviouspage=page>1;
console.log(haspreviouspage)
const nextpage=Number(page)+1;
console.log(nextpage)
const previouspage=Number(page)-1;
console.log(previouspage)
const lastpage=Math.ceil(expcount/option)
console.log(lastpage)
let obj={
    currentpage:Number(req.query.page),
    hasnextpage:hasnextpage,
    haspreviouspage:haspreviouspage,
    nextpage:nextpage,
    previouspage:previouspage,
    lastpage:lastpage
}



req.user.getForusers({offset:(page-1)*option,limit:option}).then((expenses)=>{
      res.json({expenses,success:true,obj})

  }).catch(err=>console.log(err))
})

exports.deleteUser = async(req, res, next) =>{
  try{
   if(req.body.ID == 'undefined'){
     console.log('Id is missing')
      res.status(400).json({err: 'Id is missing'})
   }
   
   const ID = req.body.ID;
    User.findByPk(ID).then((expensed)=>{
     
      req.user.getLeaderboard().then(async (e)=>{
       
          // console.log(e,"i am e boy u are searching for")
          var value= e.dataValues.totalexpense
          value -=Number(expensed.expenseamount)
          if(isNaN(value) || value <= 0)
          {
            value = 0;
          }
          await e.update({totalexpense: value})})
          expensed.destroy();
 
          res.status(200);
        })
   //  expensed.destroy({where: {id: uid}});
  
  }
  catch(err){
    res.status(200).json({error: err})
  }
  }