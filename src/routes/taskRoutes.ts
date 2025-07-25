import { Router } from 'express'
import taskController from '../controllers/Task'
import { authenticateToken } from '../middlewares/auth'

const router = Router()

router.use(authenticateToken)

router.post('/', taskController.create)
router.get('/', taskController.getUserTasks)
router.get('/:id', taskController.getById)
router.put('/:id', taskController.update)
router.delete('/:id', taskController.delete)

export default router