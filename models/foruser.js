const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const User = sequelize.define('foruser', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  expenseamount:{
    type:Sequelize.STRING,
    allowNull: false,
  }, 
       
     
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  category:{
    type: Sequelize.STRING,
    allowNull: false,
  }
 
});

module.exports = User;
