import dotenv from 'dotenv'
import request from 'supertest'
dotenv.config({ path: './config.env' })
import mongoose from 'mongoose'
import app from '../app'

interface EnvConfig {
    PORT: string | number
    DATABASE: string
    DATABASE_PASSWORD: string
}
let gToken = ''
describe('Database Connection', () => {
    beforeAll(async () => {
        try {
            console.log('Connecting to MongoDB...')
            const { DATABASE, DATABASE_PASSWORD } =
                process.env as unknown as EnvConfig
            const DB = DATABASE.replace('<PASSWORD>', DATABASE_PASSWORD)
            await mongoose.connect(DB, {
                useNewUrlParser: true,
                useCreateIndex: true,
                useFindAndModify: false,
                useUnifiedTopology: true,
            })
            console.log('Connected to MongoDB')
            await mongoose.connection.db.dropCollection('users')
            console.log('Db Cleared')
        } catch (error) {
            console.error('Error connecting to MongoDB:', error)
            process.exit(1)
        }
    }, 50000)

    afterAll(async () => {
        try {
            await mongoose.connection.close()
        } catch (error) {
            console.error('Error closing MongoDB connection:', error)
        }
    })
    test('No Credentials provided', async () => {
        const response = await request(app).post('/api/users/login/').send({})
        expect(response.status).toBe(400)
        expect(response.body.message).toBe('Enter email and password')
    })
    test('Not registered', async () => {
        const response = await request(app).post('/api/users/login/').send({
            email: 'mugishseph092@gmail.com',
            password: 'walmond',
        })
        expect(response.status).toBe(401)
        expect(response.body.message).toBe('Incorrect password or email')
    })
    let userId = ''
    test('Successful signup', async () => {
        const response = await request(app).post('/api/users/signup/').send({
            name: 'joseph',
            email: 'mugishajoseph08@gmail.com',
            password: 'walmond',
            confirmPassword: 'walmond',
            role: 'admin',
        })
        userId = response.body.data.User._id
        expect(response.status).toBe(201)
        expect(response.body.status).toBe('success')
    })
    test('User already registered', async () => {
        const response = await request(app).post('/api/users/signup/').send({
            name: 'joseph',
            email: 'mugishajoseph08@gmail.com',
            password: 'walmond',
            confirmPassword: 'walmond',
            role: 'admin',
        })
        expect(response.status).toBe(500)
    })
    test('Successfully Login', async () => {
        const response = await request(app).post('/api/users/login/').send({
            email: 'mugishajoseph08@gmail.com',
            password: 'walmond',
        })
        gToken = response.body.token
        expect(response.status).toBe(200)
        expect(response.body.token).toBeDefined()
    })
    test('Token exists', async () => {
        const response = await request(app)
            .get('/api/todos')
            .set('Authorization', `Bearer ${gToken}`)
        expect(response.statusCode).toBe(200)
    })
    test('Not loggedin', async () => {
        const token = ''
        const response = await request(app)
            .get('/api/todos')
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(401)
    })
    let todoId = ''
    test('Create todo Successful', async () => {
        const response = await request(app)
            .post('/api/todos')
            .set('Authorization', `Bearer ${gToken}`)
            .send({
                title: 'New todo-app',
            })
        todoId = response.body.data.todo._id
        expect(response.status).toBe(201)
        expect(response.body.status).toBe('success')
    })
    test('Get single todo', async () => {
        const response = await request(app)
            .get(`/api/todos/${todoId}`)
            .set('Authorization', `Bearer ${gToken}`)
        expect(response.status).toBe(200)
        expect(response.body.status).toBe('success')
    })
    test('Update todo', async () => {
        const response = await request(app)
            .patch(`/api/todos/${todoId}`)
            .set('Authorization', `Bearer ${gToken}`)
            .send({
                title: 'New todo-appp',
            })
        expect(response.status).toBe(200)
        expect(response.body.status).toBe('success')
    })
    test('Delete todo', async () => {
        const response = await request(app)
            .delete(`/api/todos/${todoId}`)
            .set('Authorization', `Bearer ${gToken}`)
        expect(response.status).toBe(204)
    })
    test('Update User', async () => {
        const response = await request(app)
            .patch(`/api/users/${userId}`)
            .set('Authorization', `Bearer ${gToken}`)
            .send({
                name: 'Qasim',
            })
        expect(response.status).toBe(200)
        expect(response.body.status).toBe('success')
    })
    test('Get single User', async () => {
        const response = await request(app)
            .get(`/api/users/${userId}`)
            .set('Authorization', `Bearer ${gToken}`)
        expect(response.status).toBe(200)
        expect(response.body.status).toBe('success')
    })
    test('Forget password || Find user while email is missing', async () => {
        const response = await request(app)
            .post('/api/users/forgetPassword')
            .send({})
        expect(response.status).toBe(400)
        expect(response.body.status).toBe('fail')
        expect(response.body.message).toBe('Please enter your email')
    })
    test('Forget password || Find user using invalid email', async () => {
        const response = await request(app)
            .post('/api/users/forgetpassword')
            .send({
                email: 'mugishajosepfh08@gmail.com',
            })
        expect(response.status).toBe(404)
    })
    test('Forget password || Find user using email', async () => {
        const response = await request(app)
            .post('/api/users/forgetpassword')
            .send({
                email: 'mugishajoseph08@gmail.com',
            })
        expect(response.status).toBe(200)
    })

    test('Delete User', async () => {
        const response = await request(app)
            .delete(`/api/users/${userId}`)
            .set('Authorization', `Bearer ${gToken}`)
        expect(response.status).toBe(204)
    })
    
})
