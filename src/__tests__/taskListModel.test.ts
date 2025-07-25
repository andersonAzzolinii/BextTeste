import { createTaskListSchema } from '../schemas';
import mongoose from 'mongoose';
import TaskList from '../models/TaskList';
import { clearDB, setupDB, teardownDB } from '../config/setupTests';
import User from '../models/User';

describe('TaskList model', () => {
  beforeAll(setupDB)
  afterAll(teardownDB)
  beforeEach(clearDB)

  it('should save a valid TaskList', async () => {
    process.env.COMPLEMENT_PASS = 'test_salt';
    const user = new User({
      name: 'Lucas',
      email: 'lucas@email.com',
      password: 'senhateste'
    });
    await user.save();

    const taskList = new TaskList({
      name: 'Minha Lista',
      description: 'Descrição da lista',
      userId: user._id.toString() // use o _id do usuário criado
    });

    const saved = await taskList.save();
    expect(saved.name).toBe('Minha Lista');
    expect(saved.description).toBe('Descrição da lista');
    expect(saved.userId).toBe(user._id.toString());
  });

  it('should fail to save without userId', async () => {
    const taskList = new TaskList({
      name: 'Sem usuário',
      description: 'Desc'
    });
    let error;
    try {
      await taskList.save();
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect((error as Error).message).toMatch(/User ID is required/);
  });

  it('should fail to save with empty name', async () => {
    const taskList = new TaskList({
      name: '',
      description: 'Desc',
      userId: '507f1f77bcf86cd799439011'
    });
    let error;
    try {
      await taskList.save();
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect((error as Error).message).toMatch(/List name is required/);
  });

  // it('should validate correct data', () => {
  //   const result = createTaskListSchema.safeParse({
  //     name: 'Minha Lista',
  //     description: 'Descrição da lista'
  //   });
  //   expect(result.success).toBe(true);
  // });

  // it('should fail with empty name', () => {
  //   const result = createTaskListSchema.safeParse({
  //     name: '',
  //     description: 'Descrição da lista'
  //   });
  //   expect(result.success).toBe(false);
  // });

  // it('should fail with extra fields', () => {
  //   const result = createTaskListSchema.safeParse({
  //     name: 'Minha Lista',
  //     description: 'Descrição',
  //     extra: 'campo'
  //   });
  //   expect(result.success).toBe(false);
  // });

});

