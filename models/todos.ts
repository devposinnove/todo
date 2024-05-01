import mongoose from 'mongoose'

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    dueDate: {
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