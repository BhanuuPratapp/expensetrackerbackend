const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const forgotpassword=sequelize.define('forgotpassword',{
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    isactive:{
        type:Sequelize.BOOLEAN
    },
        
})

module.exports = forgotpassword;
