//Importar conecxao com banco de dados
const sequelize = require('../database/db');

//Importar o sequelize
const Sequelize = require('sequelize');

//Criando a tabela no mySql
const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    name: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },

    email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
    },
    password:{
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    cpf: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
    },
    
    resetToken: {
        type: Sequelize.STRING(255),
    },
    
    resetTokenExpiration: {
        type: Sequelize.DATE,
    }

    
});






// exportar
module.exports = User;
