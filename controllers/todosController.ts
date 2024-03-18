import { Request, Response } from 'express';
import Todos from '../models/todos'; 

export const GetAllTodos = async (req: Request, res: Response): Promise<void> => {
    try {
        const todos = await Todos.find();
        res.status(200).json({
            status: 'success',
            data: {
                todos,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
};

export const CreateTodos = async (req: Request, res: Response): Promise<void> => {
    try {
        const todo = await Todos.create(req.body);
        console.log(todo);
        res.status(201).json({
            status: 'success',
            data: {
                todo,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err,
        });
    }
};

export const GetTodo = async (req: Request, res: Response): Promise<void> => {
    try {
        const todo = await Todos.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                todo,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
};

export const UpdateTodo = async (req: Request, res: Response): Promise<void> => {
    try {
        const todo = await Todos.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );
        res.status(200).json({
            status: 'success',
            data: {
                todo,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
};

export const DeleteTodo = async (req: Request, res: Response): Promise<void> => {
    try {
        await Todos.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err,
        });
    }
};
