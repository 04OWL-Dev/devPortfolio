import {CustomError} from '../error/custom-error.js'
const errorHandlerMiddleware = (err, req, res, next) => {
    if(err instanceof CustomError) {
        return res.status(err.statusCode).json({ msg: err.message })
    }
    res.status(500).json({ msg: 'Something went wrong, please try again' })
}

export default errorHandlerMiddleware