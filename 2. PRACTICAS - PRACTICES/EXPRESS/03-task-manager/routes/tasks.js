import express from 'express'
const router = express.Router()

import tasksControllers from '../controllers/tasks.js'

router.route('/').get(tasksControllers.getAllTasks).post(tasksControllers.createTask)
router.route('/:id').get(tasksControllers.getTask).patch(tasksControllers.updateTask).delete(tasksControllers.deleteTask)

export default router