//Primero se revisa la BD para verificar si el usuario existe
// Si existe, se genera un token
// Si no existe, se genera un error
import jwt from 'jsonwebtoken'
import { BadRequestError} from '../errors/index.js'

const login = async (req, res) => {
    const { username, password } = req.body
    if(!username || !password) {
       throw new BadRequestError('Please provide email and password')
    }
    const id = new Date().getDate()
    const token = jwt.sign({ id, username }, process.env.JWT_SECRET, { expiresIn: '30d' })    
    res.status(200).json({ msg: 'User created', token})    
}

const dashboard = async (req, res) => {  
    const luckyNumber = Math.floor(Math.random() * 100)
    const {username} = req.user
    res.status(200).json({
        msg: `Hello, ${username}`,
        secret: `Here is your authorized data, your lucky number is ${luckyNumber}`
    })   
}

export {login, dashboard}