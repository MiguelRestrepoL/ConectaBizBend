import {
  createCuponService, getCuponesByUserIdService, getCuponByIdService,
  updateCuponService, deleteCuponService,
  createPromocionService, getPromocionesByUserIdService, getPromocionByIdService,
  updatePromocionService, deletePromocionService,
  validateCuponData, validatePromocionData
} from '../services/marketing.service.js';
 
/* ============================================================
   CUPONES
   ============================================================ */
 
export const createCupon = async (req, res) => {
  try {
    const userId = req.user.id;
    const errors = validateCuponData(req.body);
    if (errors.length > 0) return res.status(400).json({ error: 'Datos inválidos', details: errors });
    const cupon = await createCuponService(req.body, userId);
    return res.status(201).json({ message: 'Cupón creado exitosamente', cupon });
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message || 'Error interno' });
  }
};
 
export const getCupones = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, search = '', activo } = req.query;
    const result = await getCuponesByUserIdService(userId, {
      page: parseInt(page),
      limit: parseInt(limit),
      search: search.trim(),
      activo: activo !== undefined ? activo === 'true' : undefined
    });
    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message || 'Error interno' });
  }
};
 
export const getCuponById = async (req, res) => {
  try {
    const cupon = await getCuponByIdService(req.params.id, req.user.id);
    return res.json({ cupon });
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message || 'Error interno' });
  }
};
 
export const updateCupon = async (req, res) => {
  try {
    const cupon = await updateCuponService(req.params.id, req.body, req.user.id);
    return res.json({ message: 'Cupón actualizado', cupon });
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message || 'Error interno' });
  }
};
 
export const deleteCupon = async (req, res) => {
  try {
    await deleteCuponService(req.params.id, req.user.id);
    return res.json({ message: 'Cupón eliminado exitosamente' });
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message || 'Error interno' });
  }
};
 
/* ============================================================
   PROMOCIONES
   ============================================================ */
 
export const createPromocion = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productos, ...data } = req.body;
    const errors = validatePromocionData(data);
    if (errors.length > 0) return res.status(400).json({ error: 'Datos inválidos', details: errors });
    const promocion = await createPromocionService(data, productos || [], userId);
    return res.status(201).json({ message: 'Promoción creada exitosamente', promocion });
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message || 'Error interno' });
  }
};
 
export const getPromociones = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, search = '', activa } = req.query;
    const result = await getPromocionesByUserIdService(userId, {
      page: parseInt(page),
      limit: parseInt(limit),
      search: search.trim(),
      activa: activa !== undefined ? activa === 'true' : undefined
    });
    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message || 'Error interno' });
  }
};
 
export const getPromocionById = async (req, res) => {
  try {
    const promocion = await getPromocionByIdService(req.params.id, req.user.id);
    return res.json({ promocion });
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message || 'Error interno' });
  }
};
 
export const updatePromocion = async (req, res) => {
  try {
    const { productos, ...data } = req.body;
    const promocion = await updatePromocionService(req.params.id, data, productos, req.user.id);
    return res.json({ message: 'Promoción actualizada', promocion });
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message || 'Error interno' });
  }
};
 
export const deletePromocion = async (req, res) => {
  try {
    await deletePromocionService(req.params.id, req.user.id);
    return res.json({ message: 'Promoción eliminada exitosamente' });
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message || 'Error interno' });
  }
};