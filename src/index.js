//Importando o express
const express = require('express');

//body parser transforma dados para o banco de dados em legiveis (npm i body-parser)
const bodyParser = require('body-parser');

//Atribuir as funcionalidades a uma variavel APP
const app = express();

// Importa a conecxao bando de dados
const sequelize = require('./database/db')
//Impota a tabela User
const User = require('../src/models/User')

//Porta
const port = 3636;


//Metodo
sequelize.sync()
.then(() => {
    console.log('Sincronizado database')
})
.catch((error) => {
    console.log('nao sucedida')
});


app.use(bodyParser.json()) // midlawere body parser vai ser execultado em todas as rotas entre a req e res

//rota de POST
app.post('/cadastro', async (req, res) => {
    const {name, email, password, cpf} = req.body;

    ////// validação do email /////
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ message: 'Email invalido!'})
    }

    //Validação de senha///////
    if (!password || password.length < 6) {
        return res.status(400).json({ message: 'Senha deve ter mais de 6 caracters!'})
    }

    // validar cpf
    if (!cpf || !/\d{3}\.\d{3}\.\d{3}-\d{2}/.test(cpf)) {
        return res.status(400).json({ message: 'CPF invalido!'})
    }

    //////////////////

    try {
        const user = await User.create({
            name,
            email,
            password,
            cpf
        })

        res.status(200).json({message: 'Usuario cadastrado com SUCESSO!', user})

    }
    catch (error) {
        console.log('Não foi possivel criar um usuario', error)
        res.status(500).json({message:'Não foi possivel criar um usuario'})
    }

})


 //Ouvindo a porta
app.listen(port, () => {
    console.log(`Servidor iniciado em: ${port}`);
});