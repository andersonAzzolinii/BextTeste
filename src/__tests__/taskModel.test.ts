import { createTaskListSchema } from '../schemas';

describe('TaskList schema', () => {
  it('should validate correct data', () => {
    const result = createTaskListSchema.safeParse({
      name: 'Minha Lista',
      description: 'Descrição da lista'
    });
    expect(result.success).toBe(true);
  });

  it('should fail with empty name', () => {
    const result = createTaskListSchema.safeParse({
      name: '',
      description: 'Descrição da lista'
    });
    expect(result.success).toBe(false);
  });

  it('should fail with extra fields', () => {
    const result = createTaskListSchema.safeParse({
      name: 'Minha Lista',
      description: 'Descrição',
      extra: 'campo'
    });
    expect(result.success).toBe(false);
  });
});
