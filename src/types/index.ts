import { Document } from 'mongoose'

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export interface IUser extends Document {
  _id: string
  name: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date

  comparePassword(candidatePassword: string): Promise<boolean>
}

export interface ITaskList extends Document {
  _id: string
  name: string
  description?: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface ITask extends Document {
  _id: string
  title: string
  description?: string
  status: TaskStatus
  dueDate?: Date
  userId: string
  listId: string
  createdAt: Date
  updatedAt: Date
}

export interface IJwtPayload {
  userId: string
  email: string
}

export interface IAuthRequest extends Express.Request {
  user?: {
    _id: string
    email: string
  }
}

export interface ICreateUserDTO {
  name: string
  email: string
  password: string
}

export interface ILoginDTO {
  email: string
  password: string
}

export interface ICreateTaskListDTO {
  name: string
  description?: string
}

export interface ICreateTaskDTO {
  title: string
  description?: string
  status?: TaskStatus
  dueDate?: Date | undefined
  listId: string
}

export interface IUpdateTaskDTO {
  title?: string
  description?: string
  status?: TaskStatus
  dueDate?: Date | undefined
  listId?: string
}

export interface ITaskFilters {
  listId?: string
  status?: TaskStatus
  dueDateFrom?: string
  dueDateTo?: string
}

export interface IUpdateTaskListDTO {
  name?: string
  description?: string
}
