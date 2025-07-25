import { z } from 'zod'
import { TaskStatus } from '../types'

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name must be at most 50 characters long')
    .trim(),

  email: z
    .email('Invalid email')
    .toLowerCase()
    .trim(),

  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(100, 'Password must be at most 100 characters long')
})

export const loginSchema = z.object({
  email: z
    .email('Invalid email')
    .toLowerCase()
    .trim(),

  password: z
    .string()
    .min(1, 'Password is required')
})

export const createTaskListSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters long')
    .trim(),

  description: z
    .string()
    .max(500, 'Description must be at most 500 characters long')
    .trim(),
})
  .strict()

export const updateTaskListSchema = z.object({
  name: z
    .string()
    .min(1, 'Name must be at least 1 character long')
    .max(100, 'Name must be at most 100 characters long')
    .trim(),

  description: z
    .string()
    .max(500, 'Description must be at most 500 characters long')
    .trim()
})
  .strict()
  .refine(
    (data) => {
      const hasName = data.name !== undefined && data.name !== ''
      const hasDescription = data.description !== undefined
      return hasName || hasDescription
    },
    {
      message: 'At least one field (name or description) must be provided',
    }
  )

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be at most 200 characters long')
    .trim(),

  description: z
    .string()
    .min(1, 'Description is required')
    .max(1000, 'Description must be at most 1000 characters long')
    .trim(),

  status: z
    .enum([TaskStatus.PENDING, TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED])
    .default(TaskStatus.PENDING),

  dueDate: z
    .iso.date('Invalid date format')
    .refine((dateStr) => {
      const date = new Date(dateStr)
      return date > new Date()
    }, 'Due date must be in the future')
    .transform((str) => new Date(str))
    .optional(),

  listId: z
    .string()
    .min(1, 'List ID is required')
}).strict()

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title must be at least 1 character long')
    .max(200, 'Title must be at most 200 characters long')
    .trim()
    .optional(),

  description: z
    .string()
    .max(1000, 'Description must be at most 1000 characters long')
    .trim()
    .optional(),

  status: z
    .enum([TaskStatus.PENDING, TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED])
    .optional(),

  dueDate: z
    .iso.date('Invalid date format')
    .transform((str) => new Date(str))
    .optional(),

  listId: z
    .string()
    .min(1, 'List ID is required')
}).strict()

export const taskFiltersSchema = z.object({
  listId: z.string().optional(),
  status: z.enum([TaskStatus.PENDING, TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED]).optional(),
  dueDateFrom: z.iso.date().optional(),
  dueDateTo: z.iso.date().optional()
}).strict()

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type CreateTaskListInput = z.infer<typeof createTaskListSchema>
export type UpdateTaskListInput = z.infer<typeof updateTaskListSchema>
export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
export type TaskFiltersInput = z.infer<typeof taskFiltersSchema>