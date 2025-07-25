import request from 'supertest'
import app from '../server'
import { setupDB, teardownDB, clearDB } from '../config/setupTests'

describe('ListTask routes', () => {
  let token: string

  async function createListTask(name: string, description: string) {
    const res = await request(app)
      .post('/api/task-lists')
      .set('Authorization', `Bearer ${token}`)
      .send({ name, description })
    return res
  }

  async function createUserAndReturnToken(): Promise<string> {
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Lucas', email: 'lucas@email.com', password: 'senhateste' })

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'lucas@email.com', password: 'senhateste' })
    return loginRes.body.data.token as string
  }


  beforeAll(async () => {
    await setupDB()
    await clearDB()

    token = await createUserAndReturnToken()
  })

  afterAll(teardownDB)

  it('should create a new listTask', async () => {
    const res = await createListTask('New ListTask', 'ListTask description')
    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
  })

  it('should not create a listTask with invalid data', async () => {
    const res = await createListTask('', '')
    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
  })

  it('should get by ID', async () => {
    const createRes = await createListTask('New Task', 'Task description')
    expect(createRes.status).toBe(201)

    const res = await request(app)
      .get(`/api/task-lists/${createRes.body.data._id}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data._id).toBe(createRes.body.data._id)

  })

  it('should update listTask', async () => {
    const createRes = await createListTask('New Task', 'Task description')
    expect(createRes.status).toBe(201)

    const res = await request(app)
      .put(`/api/task-lists/${createRes.body.data._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Task', description: 'Updated description' })
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data._id).toBe(createRes.body.data._id)

  })

  it('should delete listTask', async () => {
    const createRes = await createListTask('New Task', 'Task description')
    expect(createRes.status).toBe(201)

    const res = await request(app)
      .delete(`/api/task-lists/${createRes.body.data._id}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
  })

})
