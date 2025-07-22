import { Request, Response, NextFunction } from 'express'
import taskService from '../services/Task'
import { createTaskSchema, updateTaskSchema, taskFiltersSchema } from '../schemas'
import { AuthRequest } from '../middlewares/auth'

export class TaskController {

  async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validationResult = createTaskSchema.safeParse(req.body)

      if (!validationResult.success) {
        const errors = validationResult.error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))

        res.status(400).json({
          success: false,
          message: 'Invalid data',
          errors
        })
        return
      }

      const userId = req.user!._id
      const taskData = validationResult.data
      const result = await taskService.create(userId, taskData)

      res.status(201).json(result)

    } catch (error) {
      next(error)
    }
  }

  async getUserTasks(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validationResult = taskFiltersSchema.safeParse(req.query)

      if (!validationResult.success) {
        const errors = validationResult.error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))

        res.status(400).json({
          success: false,
          message: 'Invalid filters',
          errors
        })
        return
      }

      const userId = req.user!._id
      const filters = validationResult.data
      const result = await taskService.getUserTasks(userId, filters)

      res.status(200).json(result)

    } catch (error) {
      next(error)
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const userId = req.user!._id
      const result = await taskService.getById(id, userId)

      res.status(200).json(result)

    } catch (error) {
      next(error)
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validationResult = updateTaskSchema.safeParse(req.body)

      if (!validationResult.success) {
        const errors = validationResult.error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))

        res.status(400).json({
          success: false,
          message: 'Invalid data',
          errors
        })
        return
      }

      const { id } = req.params
      const userId = req.user!._id
      const updateData = validationResult.data
      const result = await taskService.update(id, userId, updateData)

      res.status(200).json(result)

    } catch (error) {
      next(error)
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const userId = req.user!._id
      const result = await taskService.delete(id, userId)

      res.status(200).json(result)

    } catch (error) {
      next(error)
    }
  }

  async getByListId(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { listId } = req.params
      const userId = req.user!._id
      const result = await taskService.getByListId(listId, userId)

      res.status(200).json(result)

    } catch (error) {
      next(error)
    }
  }
}

export default new TaskController()