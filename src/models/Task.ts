import mongoose, { Schema } from 'mongoose'
import { ITask, TaskStatus } from '../types'

const taskSchema = new Schema<ITask>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [1, 'Title must be at least 1 character long'],
    maxlength: [200, 'Title must be at most 200 characters long']
  },

  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description must be at most 1000 characters long']
  },

  status: {
    type: String,
    enum: {
      values: Object.values(TaskStatus),
      message: 'Status must be: pending, in_progress or completed'
    },
    default: TaskStatus.PENDING
  },

  dueDate: {
    type: Date,
    validate: {
      validator: function (value: Date) {
        if (this.isNew && value && value < new Date()) {
          return false
        }
        return true
      },
      message: 'Due date cannot be in the past'
    }
  },

  userId: {
    type: String,
    required: [true, 'User ID is required'],
    ref: 'User'
  },

  listId: {
    type: String,
    required: [true, 'List ID is required'],
    ref: 'TaskList'
  }
}, {
  timestamps: true,

  toJSON: {
    transform: function (_, ret) {
      const { __v, ...taskWithoutVersion } = ret
      return taskWithoutVersion
    }
  }
})

taskSchema.pre('save', async function (next) {
  try {
    const User = mongoose.model('User')
    const userExists = await User.findById(this.userId)

    if (!userExists) {
      return next(new Error('User not found'))
    }

    const TaskList = mongoose.model('TaskList')
    const list = await TaskList.findOne({
      _id: this.listId,
      userId: this.userId
    })

    if (!list) {
      return next(new Error('list not found or does not belong to user'))
    }

    next()
  } catch (error) {
    next(error as Error)
  }
})

taskSchema.statics.findWithFilters = function (userId: string, filters: any = {}) {
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

  return this.find(query)
    .populate('listId', 'name')
    .sort({ createdAt: -1 })
}

export default mongoose.model<ITask>('Task', taskSchema)