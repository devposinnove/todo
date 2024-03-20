import Joi from 'joi'

const todoIdSchema = Joi.object({
    id: Joi.string().alphanum().required(),
})

export default todoIdSchema