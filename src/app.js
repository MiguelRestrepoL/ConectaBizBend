import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from "cors";

// Rutas
import authRoutes from './routes/auth.routes.js';
import clientRoutes from './routes/client.routes.js';
import pedidoRoutes from './routes/pedido.routes.js';

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



app.use('/api', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/pedidos', pedidoRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: '🚀 API funcionando correctamente' });
});

export default app;

