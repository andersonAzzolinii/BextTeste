import request from 'supertest'
import app from '../server'
import { setupDB, teardownDB, clearDB } from '../config/setupTests'

describe('Tasks routes', () => {
  let token: string

  async function createUserAndReturnToken() {
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Lucas', email: 'lucas@email.com', password: 'senhateste' })

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'lucas@email.com', password: 'senhateste' })

    return loginRes.body.data.token
  }

  beforeAll(async () => {
    await clearDB()
    await setupDB()

    token = await createUserAndReturnToken()
  })

  afterAll(teardownDB)

  async function createListTask(name: string, description: string) {
    const res = await request(app)
      .post('/api/task-lists')
      .set('Authorization', `Bearer ${token}`)
      .send({ name, description })
    expect(res.status).toBe(201)
    return res.body.data._id
  }

  async function createTask(title: string, description: string, listId?: string) {
    return await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title,
        description,
        status: 'pending',
        listId
      })
  }


  it('should create a new task', async () => {
    const listTasksId = await createListTask('Minha Lista', 'Descrição da lista')
    const res = await createTask('New Task', 'Task description', listTasksId)

    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.data.title).toBe('New Task')
  })


  it('should not create a task with invalid data', async () => {
    const res = await createTask('', '')
    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
  })

  it('should get all tasks for user', async () => {
    const listTasksId = await createListTask('Minha Lista', 'Descrição da lista')

    await createTask('Task 1', 'Desc 1', listTasksId)
    await createTask('Task 2', 'Desc 2', listTasksId)

    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data.tasks)).toBe(true)
    expect(res.body.data.tasks.length).toBeGreaterThanOrEqual(2)
  })

  it('should get task by ID', async () => {
    const listTasksId = await createListTask('Minha Lista', 'Descrição da lista')
    const createRes = await createTask('New Task', 'Task description', listTasksId)
    const taskId = createRes.body.data._id

    const res = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data._id).toBe(taskId)
  })

  it('should update a task', async () => {
    const listTasksId = await createListTask('Minha Lista', 'Descrição da lista')
    const createRes = await createTask('Task to update', 'Desc', listTasksId)
    const taskId = createRes.body.data._id

    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Task', description: 'Updated Desc', listId: listTasksId })
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.title).toBe('Updated Task')
  })

  it('should delete a task', async () => {
    const listTasksId = await createListTask('Minha Lista', 'Descrição da lista')
    const createRes = await createTask('Task to delete', 'Desc', listTasksId)
    const taskId = createRes.body.data._id

    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
  })
})