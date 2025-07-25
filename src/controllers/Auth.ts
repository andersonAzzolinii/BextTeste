import { NextFunction, Request, Response } from 'express'
import authService from '../services/Auth'
import { registerSchema, loginSchema } from '../schemas'

export class AuthController {

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validationResult = registerSchema.safeParse(req.body)

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

      const userData = validationResult.data
      const result = await authService.register(userData)

      res.status(201).json(result)

    } catch (error: any) {
      next(error)
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validationResult = loginSchema.safeParse(req.body)

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

      const loginData = validationResult.data
      const result = await authService.login(loginData)

      res.status(200).json(result)

    } catch (error: any) {
      next(error)
    }
  }

  async me(req: Request, res: Response): Promise<void> {
    try {
      const authHeader = req.headers.authorization
      const token = authHeader && authHeader.split(' ')[1]

      if (!token) {
        res.status(401).json({
          success: false,
          message: 'Token not provided'
        })
        return
      }

      const result = await authService.verifyToken(token)

      res.status(200).json(result)

    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: 'Invalid token'
      })
    }
  }
}

export default new AuthController()