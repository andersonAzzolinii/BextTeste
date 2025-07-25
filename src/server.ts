import express from 'express'
import dotenv from 'dotenv'
import database from './config/database'
import { errorHandler, notFoundHandler } from './middlewares/error'
import routes from './routes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

app.use('/api', routes)

async function connectDB() {
  try {
    await database.connect()
  } catch (error) {
    console.error('Falha ao iniciar o servidor:', error)
    process.exit(1)
  }
}

app.use(notFoundHandler)
app.use(errorHandler)

connectDB()
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`)
})
export default app