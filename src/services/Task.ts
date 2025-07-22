import Task from '../models/Task'
import TaskList from '../models/TaskList'
import { ICreateTaskDTO, IUpdateTaskDTO, ITaskFilters } from '../types'

export class TaskService {
  /**
   * Create new task
   */
  async create(userId: string, taskData: ICreateTaskDTO) {
    // Verify if list exists and belongs to user
    const taskList = await TaskList.findOne({ _id: taskData.listId, userId })

    if (!taskList) {
      throw new Error('Task list not found')
    }

    const task = new Task({
      title: taskData.title,
      description: taskData.description,
      status: taskData.status,
      dueDate: taskData.dueDate ? new Date(taskData.dueDate) : undefined,
      userId,
      listId: taskData.listId
    })

    await task.save()

    // Populate list info
    await task.populate('listId', 'name')

    return {
      success: true,
      message: 'Task created successfully',
      data: {
        ...task.toObject()
      }
    }
  }

  async getUserTasks(userId: string, filters: ITaskFilters = {}) {
    const query: any = { userId }

    if (filters.listId) {
      query.listId = filters.listId
    }

    if (filters.status) {
      query.status = filters.status
    }

    if (filters.dueDateFrom || filters.dueDateTo) {
      query.dueDate = {}

      if (filters.dueDateFrom) {
        query.dueDate.$gte = new Date(filters.dueDateFrom)
      }

      if (filters.dueDateTo) {
        query.dueDate.$lte = new Date(filters.dueDateTo)
      }
    }

    const tasks = await Task.find(query)
      .populate('listId', 'name')
      .sort({ createdAt: -1 })

    return {
      success: true,
      message: 'Tasks retrieved successfully',
      data: {
        tasks,
        count: tasks.length
      }
    }
  }

  async getById(taskId: string, userId: string) {
    const task = await Task.findOne({ _id: taskId, userId })
      .populate('listId', 'name')

    if (!task) {
      throw new Error('Task not found')
    }

    return {
      success: true,
      message: 'Task retrieved successfully',
      data: {
        ...task.toObject()
      }
    }
  }

  async update(taskId: string, userId: string, updateData: IUpdateTaskDTO) {
    const task = await Task.findOne({ _id: taskId, userId })

    if (!task) {
      throw new Error('Task not found')
    }

    if (updateData.listId && updateData.listId !== task.listId) {
      const newTaskList = await TaskList.findOne({
        _id: updateData.listId,
        userId
      })

      if (!newTaskList) {
        throw new Error('New task list not found')
      }
    }

    Object.assign(task, updateData)

    await task.save()
    await task.populate('listId', 'name')

    return {
      success: true,
      message: 'Task updated successfully',
      data: {
        ...task.toObject()
      }
    }
  }

  async delete(taskId: string, userId: string) {
    const task = await Task.findOne({ _id: taskId, userId })

    if (!task) {
      throw new Error('Task not found')
    }

    await Task.findByIdAndDelete(taskId)

    return {
      success: true,
      message: 'Task deleted successfully'
    }
  }

  async getByListId(listId: string, userId: string) {
    const taskList = await TaskList.findOne({ _id: listId, userId })

    if (!taskList) {
      throw new Error('Task list not found')
    }

    const tasks = await Task.find({ listId, userId })
      .sort({ createdAt: -1 })

    return {
      success: true,
      message: 'Tasks retrieved successfully',
      data: {
        tasks,
        count: tasks.length,
        listName: taskList.name
      }
    }
  }
}

export default new TaskService()