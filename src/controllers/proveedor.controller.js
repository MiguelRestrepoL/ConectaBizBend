import {
  createProveedorService,
  getProveedoresService,
  getProveedorByIdService,
  updateProveedorService,
  deleteProveedorService,
} from '../services/proveedor.service.js';
 
export const createProveedor = async (req, res) => {
  try {
    const data = await createProveedorService(req.user.id, req.body);
    return res.status(201).json({ success: true, data });
  } catch (e) {
    return res.status(e.status || 500).json({ error: e.message });
  }
};
 
export const getProveedores = async (req, res) => {
  try {
    const { page, limit, search, includeInactive } = req.query;
    const data = await getProveedoresService(req.user.id, {
      page, limit, search,
      includeInactive: includeInactive === 'true',
    });
    return res.json({ success: true, ...data });
  } catch (e) {
    return res.status(e.status || 500).json({ error: e.message });
  }
};
 
export const getProveedorById = async (req, res) => {
  try {
    const data = await getProveedorByIdService(req.user.id, parseInt(req.params.id));
    return res.json({ success: true, data });
  } catch (e) {
    return res.status(e.status || 500).json({ error: e.message });
  }
};
 
export const updateProveedor = async (req, res) => {
  try {
    const data = await updateProveedorService(req.user.id, parseInt(req.params.id), req.body);
    return res.json({ success: true, data });
  } catch (e) {
    return res.status(e.status || 500).json({ error: e.message });
  }
};
 
export const deleteProveedor = async (req, res) => {
  try {
    await deleteProveedorService(req.user.id, parseInt(req.params.id));
    return res.json({ success: true, message: 'Proveedor eliminado' });
  } catch (e) {
    return res.status(e.status || 500).json({ error: e.message });
  }
};