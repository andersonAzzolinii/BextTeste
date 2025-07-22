import User from '../models/User'
import { setupDB, teardownDB, clearDB } from '../config/setupTests'

describe('User model - comparePassword', () => {
  beforeAll(setupDB)
  afterAll(teardownDB)
  beforeEach(clearDB)

  async function createUser(name: string, email: string, password: string) {
    process.env.COMPLEMENT_PASS = 'test_salt'
    const user = new User({
      name,
      email,
      password: password
    })
    await user.save()
    return user
  }

  it('should return true for correct password', async () => {
    const user = await createUser('Lucas', 'lucas@email.com', 'mypassword')

    const isValid = await user.comparePassword('mypassword')
    expect(isValid).toBe(true)
  })

  it('should return false for wrong password', async () => {
    const user = await createUser('Lucas', 'lucas@email.com', 'mypassword')

    const isValid = await user.comparePassword('wrongpassword')
    expect(isValid).toBe(false)
  })

})