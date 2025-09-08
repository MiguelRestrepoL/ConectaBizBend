import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const App = express();

// Middlewares
App.use(morgan('dev'));
App.use(express.json());

// Rutas
import authRoutes from './routes/auth.routes.js';
App.use('/api', authRoutes);

// Ruta de prueba
App.get('/', (req, res) => {
  res.json({ message: '🚀 API funcionando correctamente' });
});

export default App;
