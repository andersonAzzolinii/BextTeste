import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcryptjs'
import { IUser } from '../types'

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required'], 
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name must be at most 50 characters long']
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true, 
    lowercase: true, 
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false 
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function (_, ret) {
      const { password, __v, ...cleanUser } = ret
      return cleanUser
    }
  }
})

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  try {
    const complementPass = process.env.COMPLEMENT_PASS

    if (!complementPass) {
      throw new Error('COMPLEMENT_PASS not configured')
    }

    const passwordWithAppSalt = this.password + complementPass

    const bcryptSalt = await bcrypt.genSalt(12)

    this.password = await bcrypt.hash(passwordWithAppSalt, bcryptSalt)

    next()
  } catch (error) {
    next(error as Error)
  }
})

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  try {
    const complementPass = process.env.COMPLEMENT_PASS

    if (!complementPass) {
      throw new Error('COMPLEMENT_PASS not configured')
    }

    const candidateWithAppSalt = candidatePassword + complementPass

    return await bcrypt.compare(candidateWithAppSalt, this.password)
  } catch (error) {
    console.error('Error comparing password:', error)
    return false
  }
}

export default mongoose.model<IUser>('User', userSchema)