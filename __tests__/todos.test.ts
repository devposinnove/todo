import dotenv from 'dotenv'
dotenv.config({ path: './config.env' })
import mongoose from 'mongoose'
import request from 'supertest'
import app from '../app'

// interface EnvConfig {
//     PORT: string | number;
//     DATABASE: string;
//     DATABASE_PASSWORD: string;
// }

describe('Database Connection', () => {
    beforeAll(async () => {
        try {
            console.log('Connecting to MongoDB...')
            // const { DATABASE, DATABASE_PASSWORD } = process.env as unknown as EnvConfig;
            // const DB = DATABASE.replace('<PASSWORD>', DATABASE_PASSWORD);
            await mongoose.connect('mongodb://127.0.0.1:27017/Todo-dbs', {
                useNewUrlParser: true,
                useCreateIndex: true,
                useFindAndModify: false,
                useUnifiedTopology: true,
            })
            console.log('Connected to MongoDB')
            await mongoose.connection.db.dropCollection('users');
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

    test('Not loggedin', async () => {
        const token = ''
        const response = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(401)
    })
})
