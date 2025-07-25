import { Router } from 'express'
import authRoutes from './authRoutes'
import taskListRoutes from './taskListRoutes'
import taskRoutes from './taskRoutes'


const router = Router()

router.use('/auth', authRoutes)
router.use('/task-lists', taskListRoutes)
router.use('/tasks', taskRoutes)

export default router