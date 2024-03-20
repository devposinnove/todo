import express, { Request, Response } from 'express'
// import {protect} from './../controllers/authController'
const authController = require('./../controllers/authController')
import {
    GetAllTodos,
    CreateTodos,
    GetTodo,
    UpdateTodo,
    DeleteTodo,
} from './../controllers/todosController'
import todoSchema from '../validation/todoValidation'
const router = express.Router()
router
    .route('/')
    .get(authController.protect,GetAllTodos)
    .post(authController.protect,(req: Request, res: Response) => {
        const { error } = todoSchema.validate(req.body)
        if (error) {
            return res.status(400).json({ error: error.details[0].message })
        }
        CreateTodos(req,res)
    })

router.route('/:id').get(authController.protect,GetTodo).patch(authController.protect,UpdateTodo).delete(authController.protect,DeleteTodo)

export default router
