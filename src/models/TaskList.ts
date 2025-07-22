import mongoose, { Schema } from 'mongoose'
import { ITaskList } from '../types'

const taskListSchema = new Schema<ITaskList>({
  name: {
    type: String,
    required: [true, 'List name is required'],
    trim: true,
    minlength: [1, 'List name must be at least 1 character long'],
    maxlength: [100, 'List name must be at most 100 characters long']
  },

  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description must be at most 500 characters long']
  },

  userId: {
    type: String,
    required: [true, 'User ID is required'],
    ref: 'User'
  }
}, {
  timestamps: true, 
  toJSON: {
    transform: function (_, ret) {
      const { __v, ...taskListWithoutVersion } = ret
      return taskListWithoutVersion
    }
  }
})

taskListSchema.pre('save', async function (next) {
  try {
    const User = mongoose.model('User')
    const userExists = await User.findById(this.userId)

    if (!userExists) {
      const error = new Error('User not found')
      return next(error)
    }

    next()
  } catch (error) {
    next(error as Error)
  }
})

export default mongoose.model<ITaskList>('TaskList', taskListSchema)