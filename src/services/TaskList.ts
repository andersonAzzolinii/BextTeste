import TaskList from '../models/TaskList';
import { ICreateTaskListDTO, IUpdateTaskListDTO } from '../types';

export class TaskListService {

  async create(userId: string, taskListData: ICreateTaskListDTO) {
    const taskList = new TaskList({
      name: taskListData.name,
      description: taskListData.description,
      userId
    });

    await taskList.save();

    return {
      success: true,
      message: 'Task list created successfully',
      data: {
        _id: taskList._id,
        name: taskList.name,
        description: taskList.description,
        userId: taskList.userId,
        createdAt: taskList.createdAt,
        updatedAt: taskList.updatedAt
      }
    };
  }

  async getUserTaskLists(userId: string) {
    const taskLists = await TaskList.find({ userId }).sort({ createdAt: -1 });

    return {
      success: true,
      message: 'Task lists retrieved successfully',
      data: {
        taskLists,
        count: taskLists.length
      }
    };
  }

  async getById(listId: string, userId: string) {
    const taskList = await TaskList.findOne({ _id: listId, userId });

    if (!taskList) {
      throw new Error('Task list not found');
    }

    return {
      success: true,
      message: 'Task list retrieved successfully',
      data: {
        ...taskList.toObject(),
      }
    };
  }

  async update(listId: string, userId: string, updateData: IUpdateTaskListDTO) {
    const taskList = await TaskList.findOne({ _id: listId, userId });

    if (!taskList) {
      throw new Error('Task list not found');
    }

    if (updateData.name !== undefined) taskList.name = updateData.name;
    if (updateData.description !== undefined) taskList.description = updateData.description;

    await taskList.save();

    return {
      success: true,
      message: 'Task list updated successfully',
      data: {
        ...taskList.toObject(),
      }
    };
  }

  async delete(listId: string, userId: string) {
    const taskList = await TaskList.findOne({ _id: listId, userId });

    if (!taskList) {
      throw new Error('Task list not found');
    }

    const Task = require('../models/Task').default;
    const tasksCount = await Task.countDocuments({ listId });

    if (tasksCount > 0) {
      throw new Error('Cannot delete list with existing tasks');
    }

    await TaskList.findByIdAndDelete(listId);

    return {
      success: true,
      message: 'Task list deleted successfully'
    };
  }
}

export default new TaskListService();