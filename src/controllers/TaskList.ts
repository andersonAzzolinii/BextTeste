import { Response, NextFunction } from 'express'
import taskListService from '../services/TaskList'
import { createTaskListSchema, updateTaskListSchema } from '../schemas'
import { AuthRequest } from '../middlewares/auth'

export class TaskListController {
  async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validationResult = createTaskListSchema.safeParse(req.body)

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
      const taskListData = validationResult.data
      const result = await taskListService.create(userId, taskListData)

      res.status(201).json(result)

    } catch (error) {
      next(error)
    }
  }

  async getUserTaskLists(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!._id
      const result = await taskListService.getUserTaskLists(userId)

      res.status(200).json(result)

    } catch (error) {
      next(error)
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const userId = req.user!._id
      const result = await taskListService.getById(id, userId)

      res.status(200).json(result)

    } catch (error) {
      next(error)
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validationResult = updateTaskListSchema.safeParse(req.body)

      if (!validationResult.success) {
        const errors = validationResult.error.issues.map(err => ({
          field: err.path.length > 0 ? err.path.join('.') : 'validation',
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
      const userId = req.user!._id.toString()
      const updateData = validationResult.data

      const result = await taskListService.update(id, userId, updateData)

      res.status(200).json(result)

    } catch (error) {
      next(error)
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const userId = req.user!._id
      const result = await taskListService.delete(id, userId)

      res.status(200).json(result)

    } catch (error) {
      next(error)
    }
  }
}

export default new TaskListController()