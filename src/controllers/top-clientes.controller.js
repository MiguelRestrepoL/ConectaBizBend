import { getTopClientesService } from '../services/top-clientes.service.js';
 
export const getTopClientes = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 10, fecha_inicio, fecha_fin } = req.query;
 
    const data = await getTopClientesService(userId, {
      limit: Math.min(parseInt(limit) || 10, 50), // máximo 50
      fechaInicio: fecha_inicio,
      fechaFin: fecha_fin,
    });
 
    return res.json({ success: true, data });
  } catch (error) {
    console.error('Error en top-clientes:', error);
    return res.status(error.status || 500).json({ error: error.message || 'Error interno' });
  }
};
 