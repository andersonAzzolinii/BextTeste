import express from 'express';
import dotenv from 'dotenv';
import database from './config/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function connectDB() {
  try {
    await database.connect();
  } catch (error) {
    console.error('Falha ao iniciar o servidor:', error);
    process.exit(1);
  }
}

connectDB();
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
export default app;