import jwt from 'jsonwebtoken'
import { ICreateUserDTO, ILoginDTO, IJwtPayload } from '../types'
import User from '../models/User'

export class AuthService {

  private generateToken(userId: string, email: string): string {
    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      throw new Error('JWT_SECRET não configurado')
    }

    const payload: IJwtPayload = {
      userId,
      email
    }

    return jwt.sign(payload, jwtSecret, {
      expiresIn: '7d'
    })
  }


  async register(userData: ICreateUserDTO) {
    try {
      const existingUser = await User.findOne({ email: userData.email })
      if (existingUser) {
        throw new Error('Email is already registered')
      }

      const user = new User({
        name: userData.name,
        email: userData.email,
        password: userData.password
      })

      await user.save()

      const token = this.generateToken(user._id, user.email)

      return {
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
          },
          token
        }
      }

    } catch (error) {
      throw error
    }
  }

  async login(loginData: ILoginDTO) {
    try {
      const user = await User.findOne({ email: loginData.email }).select('+password')
      if (!user) {
        throw new Error('Invalid credentials')
      }

      const isPasswordValid = await user.comparePassword(loginData.password)
      if (!isPasswordValid) {
        throw new Error('Invalid credentials')
      }

      const token = this.generateToken(user._id, user.email)

      return {
        success: true,
        message: 'Login successful',
        data: {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
          },
          token
        }
      }

    } catch (error) {
      throw error
    }
  }

  async verifyToken(token: string) {
    try {
      const jwtSecret = process.env.JWT_SECRET
      if (!jwtSecret) {
        throw new Error('JWT_SECRET not found')
      }

      const decoded = jwt.verify(token, jwtSecret) as IJwtPayload

      const user = await User.findById(decoded.userId)
      if (!user) {
        throw new Error('User not found')
      }

      return {
        success: true,
        data: {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email
          }
        }
      }

    } catch (error) {
      throw error
    }
  }
}

export default new AuthService()