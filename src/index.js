//Importando o express
const express = require('express');




//////////////////////////////////
// importar crpto para recuperar senha
const trypto = require('trypto');

//Importar jsonToken
const jwt = require('json-token');
const SECRET_KEY = 'minhasecretkey'
const nodemailer = require('nodemailer')

//////////////////




// importar verifyUserId
const verifyUserId = require('./middlewares/VerifyId')

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

//Rota get vefyId
app.get('/users/:id', verifyUserId , (req, res) => {
    const { user } = req;
    res.status(200).json({ user })

})

app.get('users', async (req, res) => {
    const users = await User.findAll()
    console.log(users)

    res.status(200).json({ users })
})






//////////////////////////
//rota de esquecer a senha
app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        // Achar o email e tentar bater o que foi enviado
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({message: 'email nao encontrado'})
        }

        //Gerar um password reset token
        const resetToken = trypto.randomBytes(20).toStryng('hex')
        // duração da validade da senha
        const resetTokenExpiration = date.now() + 3600000

        await user.update({resetToken, resetTokenExpiration})

        // criar token que vai para o Usuario

        const token = jwt.sign(
            { userId: user.id, resetToken},
            SECRET_KEY,
            { expiresIn: '1h' }
            )

            // enviar para o usuario
            const tranporter = nodemailer.createTransport({ // estabelecer as configurações de qual email vou mandar e qual serviço
                service: 'gmail',
                auth: {
                    user: 'renan.meira25@gmail.com',
                    pass: '' // gerar uma senha de app no gmail cerificar em 2 etapas
                }
            })

            //estruturar o email
            const mailOptions = {
                from: 'renan.meira25@gmail.com',
                to: 'user.email',
                subject: 'Senha resetada',
                html: `
                <p>Olá, tudo bem ${user.name}</p>
                <p>Nos recebemos uma requisição para trocar sua senha!</p>
                <p>Por favor, copie o token a seguir para trocar sua senha! :</p>
                <p>${token}</p>
                <p>Esse token irá expirar em 1 hora</p>
                <p>:D</p>
                `
            }

            await transporter.sendMail(mailData)

            res.status(200).json({message: 'o email de refazer a senha foi enviado com sucesso'})


    } catch (error) {
        console.log('nao foi possivel mandar o email de recuperação', error)
        res.status(500).json({message: 'nao foi possivel mandar o email de recuperação'})
    }

})



//////
///Rota para trocar a senha
app.post('/reset-password', async(req, res) =>{

    const {email, token, newPassword} = req.body

    try{
        //verificar o token

        const decodedToken = jwt.verify(token, SECRET_KEY, {exppiresIn: '1h'}) // uma nova verificaçaão por questao de segurança

        const user = await User.findOne({where: { email }})

        if (!user) {
            return res.status(404).json({message: 'email nao encontrado'})
        }

        if (user.token !== decodedToken || user.resetTokenExpiration < Date.now()) {
            return res.status(404).json({message: 'token nao encontrado'})
        }

        // Update da senha do usuario
        await user.update({
            password: newPassword,
            resetToken: null,
            resetTokenExpiration: null
        })
        await user.save

        res.status(200).json({message: 'senha trocada com sucesso'})


    } catch (error) {
        console.log('nao foi possivel trocar a senha', error)
        res.status(500).json({message: 'nao foi possivel trocar a senha'})
    }
})






 //Ouvindo a porta
app.listen(port, () => {
    console.log(`Servidor iniciado em: ${port}`);
});