import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { IJwtPayload } from '../types'

export interface AuthRequest extends Request {
  user?: {
    _id: string
    email: string
  }
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Token not found'
      })
      return
    }

    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      res.status(500).json({
        success: false,
        message: 'JWT configuration not found'
      })
      return
    }

    const decoded = jwt.verify(token, jwtSecret) as IJwtPayload
    
    req.user = {
      _id: decoded.userId,
      email: decoded.email
    }

    next()
    
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(403).json({
        success: false,
        message: 'Invalid token'
      })
      return
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      res.status(403).json({
        success: false,
        message: 'Token expired'
      })
      return
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}