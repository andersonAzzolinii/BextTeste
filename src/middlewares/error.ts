import { Request, Response } from 'express'

export interface CustomError extends Error {
  statusCode?: number
}

export const errorHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  next: Function
): void => {
  console.error('Error captured:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  })

  if (error.message === 'Email is already registered') {
    res.status(400).json({
      success: false,
      message: 'Email is already registered'
    })
    return
  }

  if (error.message === 'Task not found') {
    res.status(404).json({
      success: false,
      message: 'Task not found'
    })
    return
  }

  if (error.message === 'New task list not found') {
    res.status(404).json({
      success: false,
      message: 'New task list not found'
    })
    return
  }

  if (error.message === 'Cannot delete list with existing tasks') {
    res.status(404).json({
      success: false,
      message: 'Cannot delete list with existing tasks'
    })
    return
  }

  if (error.message === 'Task list not found') {
    res.status(404).json({
      success: false,
      message: 'Task list not found'
    })
    return
  }

  if (error.message === 'Invalid credentials') {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    })
    return
  }



  if (error.statusCode) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message
    })
    return
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error'
  })
}

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`
  })
}