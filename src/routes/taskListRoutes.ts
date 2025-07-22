import { Router } from 'express'
import taskListController from '../controllers/TaskList'
import taskController from '../controllers/Task'
import { authenticateToken } from '../middlewares/auth'

const router = Router()

router.use(authenticateToken)
router.post('/', taskListController.create)
router.get('/', taskListController.getUserTaskLists)
router.get('/:id', taskListController.getById)
router.put('/:id', taskListController.update)
router.delete('/:id', taskListController.delete)
router.get('/:listId/tasks', taskController.getByListId)

export default router