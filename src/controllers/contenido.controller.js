import {
  getTiendaPerfilService,
  saveTiendaPerfilService,
  getAnunciosService,
  createAnuncioService,
  updateAnuncioService,
  deleteAnuncioService,
} from '../services/contenido.service.js';
 
// ── Tienda ────────────────────────────────────────────────────────────────────
 
export const getTiendaPerfil = async (req, res) => {
  try {
    const data = await getTiendaPerfilService(req.user.id);
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message || 'Error interno' });
  }
};
 
export const saveTiendaPerfil = async (req, res) => {
  try {
    const data = await saveTiendaPerfilService(req.user.id, req.body);
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message || 'Error interno' });
  }
};
 
// ── Anuncios ──────────────────────────────────────────────────────────────────
 
export const getAnuncios = async (req, res) => {
  try {
    const soloActivos = req.query.activos === 'true';
    const data = await getAnunciosService(req.user.id, soloActivos);
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message || 'Error interno' });
  }
};
 
export const createAnuncio = async (req, res) => {
  try {
    const data = await createAnuncioService(req.user.id, req.body);
    return res.status(201).json({ success: true, data });
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message || 'Error interno' });
  }
};
 
export const updateAnuncio = async (req, res) => {
  try {
    const data = await updateAnuncioService(req.user.id, parseInt(req.params.id), req.body);
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message || 'Error interno' });
  }
};
 
export const deleteAnuncio = async (req, res) => {
  try {
    await deleteAnuncioService(req.user.id, parseInt(req.params.id));
    return res.json({ success: true, message: 'Anuncio eliminado' });
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message || 'Error interno' });
  }
};