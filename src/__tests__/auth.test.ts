import request from 'supertest'
import app from '../server'
import { setupDB, teardownDB, clearDB } from '../config/setupTests'

describe('Auth API', () => {
  beforeEach(clearDB)
  beforeAll(setupDB)
  afterAll(teardownDB)

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Lucas', email: 'lucas@email.com', password: 'senhateste' })
    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
  })

  it('should not register with invalid data', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: '', email: 'invalid', password: '' })
    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
  })

  it('should not register with duplicate email', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Lucas', email: 'lucas@email.com', password: 'senhateste' })

    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Lucas', email: 'lucas@email.com', password: '654321' })
    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
  })

  it('should login with correct credentials', async () => {
    const register = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Lucas', email: 'lucas@email.com', password: 'senhateste' })
    expect(register.status).toBe(201)

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'lucas@email.com', password: 'senhateste' })
    expect(res.status).toBe(200)
    expect(res.body.data.token).toBeDefined()
  })

  it('should fail login with wrong password', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Lucas', email: 'lucas@email.com', password: 'senhateste' })

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'lucas@email.com', password: 'wrongpass' })
    expect(res.status).toBe(401)
    expect(res.body.success).toBe(false)
  })

  it('should fail login with non-existent user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'notfound@email.com', password: 'senhateste' })
    expect(res.status).toBe(401)
    expect(res.body.success).toBe(false)
  })

  it('should verify token', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Lucas', email: 'lucas@email.com', password: 'senhateste' })

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'lucas@email.com', password: 'senhateste' })
    expect(loginRes.status).toBe(200)

    const token = loginRes.body.data.token
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
  })

  it('should fail verify token with invalid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalidtoken')
    expect(res.status).toBe(401)
    expect(res.body.success).toBe(false)
  })
})
