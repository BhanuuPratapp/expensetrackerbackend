const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const filecontent=sequelize.define('filecontent',{
        id: {
            type:Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        filecontenturl:{
            type:Sequelize.STRING
        },
        
        
})

module.exports = filecontent;