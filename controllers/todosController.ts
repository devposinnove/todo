import { Request, Response } from 'express'
import Todos from '../models/todos'


interface AuthenticatedRequest extends Request {
    user?: any
}

export const GetAllTodos = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        
        const todos = await Todos.find({ createdBy: req.user._id });
        res.status(200).json({
            status: 'success',
            results: todos.length,
            data: {
                todos,
            },
        })
        console.log(req.user._id);
        
        
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        })
    }
}

export const CreateTodos = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const { title } = req.body;
        const { _id: createdBy } = req.user._id;
        const todo = await Todos.create({title,createdBy})
        console.log(todo)
        res.status(201).json({
            status: 'success',
            data: {
                todo,
            },
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err,
        })
    }
}

export const GetTodo = async (req: Request, res: Response): Promise<void> => {
    try {
        const todo = await Todos.findById(req.params.id)
        res.status(200).json({
            status: 'success',
            data: {
                todo,
            },
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        })
    }
}

export const UpdateTodo = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const todo = await Todos.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            {
                new: true,
                runValidators: true,
            }
        )
        res.status(200).json({
            status: 'success',
            data: {
                todo,
            },
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        })
    }
}

export const DeleteTodo = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        await Todos.findByIdAndDelete(req.params.id)
        res.status(204).json({
            status: 'success',
            data: null,
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err,
        })
    }
}
