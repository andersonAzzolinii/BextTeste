import mongoose from 'mongoose'

class Database {

  public async connect(): Promise<void> {
    try {
      const mongoUri = process.env.MONGODB_URI
      
      if (!mongoUri) {
        throw new Error('MONGODB_URI not defined in .env')
      }

      await mongoose.connect(mongoUri)
      
      console.log('connected to MongoDB')
      
    } catch (error) {
      console.error('Error to connect to MongoDB:', error)
      process.exit(1) 
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect()
      console.log('Disconnect from MongoDB')
    } catch (error) {
      console.error('Error to disconnect MongoDB:', error)
    }
  }

}

export default new Database()