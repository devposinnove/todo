import express from 'express'
import { GetAllTodos, CreateTodos, GetTodo, UpdateTodo, DeleteTodo } from './../controllers/todosController';
const router = express.Router()
router
    .route('/')
    .get(GetAllTodos)
    .post(CreateTodos)

router
    .route('/:id')
    .get(GetTodo)
    .patch(UpdateTodo)
    .delete(DeleteTodo)

module.exports = router
