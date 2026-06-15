import { TiendaPerfil } from '../models/Contenido.model.js';
import { Anuncio } from '../models/Contenido.model.js';
 
// ── Tienda Perfil ─────────────────────────────────────────────────────────────
 
export const findOrCreateTiendaPerfil = async (userId) => {
  const [perfil] = await TiendaPerfil.findOrCreate({
    where: { user_id: userId },
    defaults: { user_id: userId, nombre_tienda: '', slogan: '', descripcion: '' },
  });
  return perfil;
};
 
export const updateTiendaPerfil = async (userId, data) => {
  const [, [perfil]] = await TiendaPerfil.upsert(
    { user_id: userId, ...data },
    { returning: true }
  );
  return perfil;
};
 
// ── Anuncios ──────────────────────────────────────────────────────────────────
 
export const findAnunciosByUser = async (userId, soloActivos = false) => {
  return Anuncio.findAll({
    where: { user_id: userId, ...(soloActivos ? { activo: true } : {}) },
    order: [['created_at', 'DESC']],
  });
};
 
export const findAnuncioById = async (id) => {
  return Anuncio.findByPk(id);
};
 
export const createAnuncio = async (userId, data) => {
  return Anuncio.create({ user_id: userId, ...data });
};
 
export const updateAnuncio = async (id, data) => {
  const anuncio = await Anuncio.findByPk(id);
  if (!anuncio) return null;
  return anuncio.update(data);
};
 
export const deleteAnuncio = async (id) => {
  const anuncio = await Anuncio.findByPk(id);
  if (!anuncio) return null;
  await anuncio.destroy();
  return anuncio;
};