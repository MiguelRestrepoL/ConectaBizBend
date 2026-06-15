import {
  findOrCreateTiendaPerfil,
  updateTiendaPerfil,
  findAnunciosByUser,
  findAnuncioById,
  createAnuncio,
  updateAnuncio,
  deleteAnuncio,
} from '../repository/contenido.repository.js';
 
// ── Tienda ────────────────────────────────────────────────────────────────────
 
export const getTiendaPerfilService = async (userId) => {
  return findOrCreateTiendaPerfil(userId);
};
 
export const saveTiendaPerfilService = async (userId, data) => {
  const allowed = ['nombre_tienda', 'slogan', 'descripcion'];
  const clean = {};
  allowed.forEach((k) => { if (data[k] !== undefined) clean[k] = data[k]; });
  return updateTiendaPerfil(userId, clean);
};
 
// ── Anuncios ──────────────────────────────────────────────────────────────────
 
export const getAnunciosService = async (userId, soloActivos) => {
  return findAnunciosByUser(userId, soloActivos);
};
 
export const createAnuncioService = async (userId, data) => {
  const { titulo, contenido, tipo = 'info', activo = true } = data;
 
  if (!titulo?.trim()) {
    const e = new Error('El título es requerido'); e.status = 400; throw e;
  }
  if (!contenido?.trim()) {
    const e = new Error('El contenido es requerido'); e.status = 400; throw e;
  }
  if (!['info', 'advertencia', 'promocion'].includes(tipo)) {
    const e = new Error('Tipo inválido'); e.status = 400; throw e;
  }
 
  return createAnuncio(userId, { titulo: titulo.trim(), contenido: contenido.trim(), tipo, activo });
};
 
export const updateAnuncioService = async (userId, id, data) => {
  const anuncio = await findAnuncioById(id);
  if (!anuncio) { const e = new Error('Anuncio no encontrado'); e.status = 404; throw e; }
  if (anuncio.user_id !== userId) { const e = new Error('Sin permisos'); e.status = 403; throw e; }
 
  const allowed = ['titulo', 'contenido', 'tipo', 'activo'];
  const clean = {};
  allowed.forEach((k) => { if (data[k] !== undefined) clean[k] = data[k]; });
 
  return updateAnuncio(id, clean);
};
 
export const deleteAnuncioService = async (userId, id) => {
  const anuncio = await findAnuncioById(id);
  if (!anuncio) { const e = new Error('Anuncio no encontrado'); e.status = 404; throw e; }
  if (anuncio.user_id !== userId) { const e = new Error('Sin permisos'); e.status = 403; throw e; }
  return deleteAnuncio(id);
};
 