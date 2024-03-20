import Joi from 'joi'

const todoSchema = Joi.object({
    title: Joi.string().min(7).required(),
})

export default todoSchema
