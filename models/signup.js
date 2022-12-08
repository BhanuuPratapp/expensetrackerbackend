const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Signup = sequelize.define('forsignup', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  username:{
    type:Sequelize.STRING,
    allowNull: false,
   
  }, 
       
     
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    }
  },

  password:{
    type: Sequelize.STRING,
    allowNull: false,
  },
  ispremiumuser:{
      type:Sequelize.BOOLEAN

  }

 
});

module.exports = Signup;
