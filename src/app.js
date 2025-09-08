import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from "cors";

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());

// Rutas
import authRoutes from './routes/auth.routes.js';
app.use('/api', authRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: '🚀 API funcionando correctamente' });
});

export default app;

