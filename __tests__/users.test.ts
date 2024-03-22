import dotenv from 'dotenv'
dotenv.config({ path: './config.env' })
import mongoose from 'mongoose'
import request from 'supertest'
import app from '../app'
import User from '../models/userModel'

describe('Database Connection', () => {
    let userId = ''
    beforeAll(async () => {
        try {
            console.log('Connecting to MongoDB...')
            await mongoose.connect('mongodb://127.0.0.1:27017/Todo-dbs', {
                useNewUrlParser: true,
            })
            console.log('Connected to MongoDB')
            await mongoose.connection.db.dropCollection('users')
            console.log('Db Cleared')
            const newUser = await User.create({
                name: 'Mugishha',
                email: 'mugish@gmail.com',
                password: 'walmond',
                confirmPassword: 'walmond',
                role: 'admin',
            })
            userId = newUser._id
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
    let gToken = ''

    test('Get Users', async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({ email: 'mugish@gmail.com', password: 'walmond' })
        gToken = res.body.token
        const response = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${gToken}`)
        expect(response.status).toBe(200)
    })
    test('Get single User', async () => {
        const response = await request(app)
            .get(`/api/users/${userId}`)
            .set('Authorization', `Bearer ${gToken}`)
        expect(response.status).toBe(200)
    })
})
