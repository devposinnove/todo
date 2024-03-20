import express from 'express'
import morgan from 'morgan'
import todosRouter from './routes/todosRouter'
import userRouter from './routes/useRouter'

const app = express()
//1)Middlewares
app.use(morgan('dev'))
app.use(express.json())
app.use('/api/users', userRouter)
app.use('/api/todos', todosRouter)

export default app
