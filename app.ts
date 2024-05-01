import express from 'express'
import morgan from 'morgan'
import todosRouter from './routes/todosRouter'
import userRouter from './routes/useRouter'

// import swaggerjsdoc from 'swagger-jsdoc'
import swaggerui from 'swagger-ui-express'
import documentation from './swagger.json'




const app = express()
//1)Middlewares
app.use(morgan('dev'))
app.use(express.json())
app.use('/docs', swaggerui.serve, swaggerui.setup(documentation))
app.use('/api/users', userRouter)
app.use('/api/todos', todosRouter)

export default app
