const Sequelize = require('sequelize');

//Configugar banco de dados 
const sequelize = new Sequelize('sequelizesql', 'root', '@Ana301200', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
});

// Exporta
module.exports = sequelize;