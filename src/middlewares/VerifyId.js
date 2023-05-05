const User = require('../models/User')

const verifyUserId = async (res, req, next) => {
    const { id } = req.params; // Aqui o id o usuario colocar vira para params da requisição

    try {
        const user = await User.findByPk(id) // pegar o id que o usuario colocou e checar se ele bate com o ID

        if (!user) {

            return res.status(400).json({message: 'usuario/id nao encontrado'})
        }
        req.user = user // Atrelando usuario a req da rota, assim ele estara salvo para consumir
      //  res.status(200).json({message: 'usuario encontrado', id})
        next();

    }
    catch (error) {
        console.log('Nao foi possivel' , error)
         res.status(400).json({message: error.message})

    }
}

module.exports = verifyUserId;