// const mongoose = require('mongoose')
import mongoose from 'mongoose'

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    due_date: {
        type: Date,
        default: new Date(),
    },
    completed: {
        type: Boolean,
        default: false,
    },
})
const Todos = mongoose.model('Todos', todoSchema)
export default Todos
