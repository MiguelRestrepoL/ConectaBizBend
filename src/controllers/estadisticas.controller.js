import { getEstadisticasService } from '../services/estadisticas.service.js';
 
export const getEstadisticas = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fecha_inicio, fecha_fin } = req.query;
 
    const data = await getEstadisticasService(userId, {
      fechaInicio: fecha_inicio,
      fechaFin: fecha_fin
    });
 
    return res.json({ success: true, data });
  } catch (error) {
    console.error('Error en estadísticas:', error);
    return res.status(error.status || 500).json({ error: error.message || 'Error interno' });
  }
};
 