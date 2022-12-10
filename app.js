//const path = require('path');

//2var cors = require('cors')

const express = require('express');
const https = require('https');
const path = require('path');
const fs = require('fs')
const app = express();
var cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')
const dotenv  = require('dotenv')
dotenv.config();
//4dotenv.config();
const sequelize = require('./util/database');
const Expense = require('./models/foruser')
const User = require('./models/signup')
const Order = require('./models/orders');
const ledb=require("./models/leaderboard")
const fgtpwd=require("./models/ForgotPasswordRequests")
const filecontenturl = require('./models/filecontent')

//const privatekey = fs.readFileSync('server.key')
//const certificate = fs.readFileSync('server.cert')

//const bodyParser = require('body-parser');

//const errorController = require('./controllers/error');
//3const sequelize = require('./util/database');

//1const app = express();
app.use(cors())

app.use(express.json())
//app.use(express.urlencoded())


const purchaseRoutes = require('./routes/purchase')
const expenseroutes = require('./routes/forUsers')
const fogotpasswordroutes=require("./routes/forgotpassword")

const accessLogstream = fs.createWriteStream(
  path.join(__dirname, 'access.log'), {flags: 'a'}
);
app.use(helmet());
app.use(compression());
app.use(morgan('combined', {stream: accessLogstream}));

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded())
app.use('/purchase', purchaseRoutes)
app.use('/user', expenseroutes)
app.use(fogotpasswordroutes)
//app.use(errorController.get404);
User.hasMany(Expense);
Expense.belongsTo(User);
User.hasMany(Order);
Order.belongsTo(User);
User.hasOne(ledb);
ledb.belongsTo(User)
User.hasMany(fgtpwd);
fgtpwd.belongsTo(User);
User.hasMany(filecontenturl);
filecontenturl.belongsTo(User);




sequelize
  .sync()
  
  .then(() => {
   
   // https.createServer({key:privatekey,cert:certificate},app).listen(process.env.HOST || 1000)
   app.listen(process.env.HOST || 1000)
  })
 
  .catch(err => {
    console.log(err);
  });
