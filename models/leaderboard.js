const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const ledBoard=sequelize.define('leaderboard',{
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        username:{
            type:Sequelize.STRING
        },
        totalexpense:{
            type:Sequelize.INTEGER,
            defaultValue:0
        }
        
})

module.exports = ledBoard;