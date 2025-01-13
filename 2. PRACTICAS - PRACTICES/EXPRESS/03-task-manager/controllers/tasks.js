import Task from '../models/Task.js'
import asyncWrapper from '../middleware/async.js'
import { createCustomError, CustomError } from '../error/custom-error.js'
const tasksControllers = {

    getAllTasks: asyncWrapper (async (req, res) => {
            const tasks = await Task.find({})
            res.status(200).json({tasks})
    }),
    
    createTask: asyncWrapper (async (req, res) => {
            const task = await Task.create(req.body)
            res.status(201).json({task})       
    }),

    getTask: asyncWrapper (async (req, res, next) => {        
            const tasks = await Task.findOne({ _id: req.params.id })
        if (!tasks) {
                return next(createCustomError(`No task with id : ${req.params.id}`, 404))
            }
            res.status(200).json({tasks})
    }),

    updateTask: asyncWrapper( async (req, res) => {
            const task = await Task.findOneAndReplace({_id: req.params.id}, req.body, {new:true, runValidators: true}) //Sin los validadores, no se devolvera el nuevo registro, aunque se haga en la BD y además, no se aplicarán las validaciones predefinidas. 
            if (!task) {
                return next(createCustomError(`No task with id : ${req.params.id}`, 404))
            }            
            res.status(200).json({task})
    }),

    deleteTask: asyncWrapper (async (req, res) => {
            const task = await Task.findOneAndDelete({ _id: req.params.id })
            if (!task) {
                return next(createCustomError(`No task with id : ${req.params.id}`, 404))
            }
            res.status(200).json({task})   
    }),
}

export default tasksControllers