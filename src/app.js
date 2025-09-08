import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const App = express();

// Middlewares
App.use(morgan('dev'));
App.use(express.json());

// Ruta de prueba
App.get('/', (req, res) => {
  res.json({ message: '🚀 API funcionando correctamente' });
});

export default App;
