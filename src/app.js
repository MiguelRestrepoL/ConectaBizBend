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
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
};

// En producción, permitir múltiples orígenes
if (process.env.NODE_ENV === 'production') {
  corsOptions.origin = [
    process.env.FRONTEND_URL,
    'https://tu-dominio-frontend.com',
    'https://www.tu-dominio-frontend.com'
  ];
}

app.use(cors(corsOptions));
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

