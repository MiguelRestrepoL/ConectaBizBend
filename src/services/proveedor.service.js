import {
  createProveedor,
  findProveedorById,
  findProveedoresByUserId,
  updateProveedor,
  deleteProveedor,
} from '../repository/proveedor.repository.js';
 
const validate = (data, requireNombre = true) => {
  const errors = [];
  if (requireNombre && !data.nombre?.trim()) errors.push('El nombre es obligatorio');
  if (data.correo && !/\S+@\S+\.\S+/.test(data.correo)) errors.push('El correo no es válido');
  return errors;
};
 
const ALLOWED = ['nombre', 'contacto', 'correo', 'telefono', 'direccion', 'ciudad', 'pais', 'notas', 'activo'];
const clean = (data) => {
  const out = {};
  ALLOWED.forEach((k) => { if (data[k] !== undefined) out[k] = data[k]; });
  return out;
};
 
export const createProveedorService = async (userId, data) => {
  const errors = validate(data);
  if (errors.length) { const e = new Error(errors.join(', ')); e.status = 400; throw e; }
  return createProveedor({ ...clean(data), user_id: userId });
};
 
export const getProveedoresService = async (userId, options) => {
  return findProveedoresByUserId(userId, options);
};
 
export const getProveedorByIdService = async (userId, id) => {
  const p = await findProveedorById(id);
  if (!p) { const e = new Error('Proveedor no encontrado'); e.status = 404; throw e; }
  if (p.user_id !== userId) { const e = new Error('Sin permisos'); e.status = 403; throw e; }
  return p;
};
 
export const updateProveedorService = async (userId, id, data) => {
  const p = await findProveedorById(id);
  if (!p) { const e = new Error('Proveedor no encontrado'); e.status = 404; throw e; }
  if (p.user_id !== userId) { const e = new Error('Sin permisos'); e.status = 403; throw e; }
  const errors = validate(data, false); // nombre opcional en update
  if (errors.length) { const e = new Error(errors.join(', ')); e.status = 400; throw e; }
  return updateProveedor(id, clean(data));
};
 
export const deleteProveedorService = async (userId, id) => {
  const p = await findProveedorById(id);
  if (!p) { const e = new Error('Proveedor no encontrado'); e.status = 404; throw e; }
  if (p.user_id !== userId) { const e = new Error('Sin permisos'); e.status = 403; throw e; }
  return deleteProveedor(id);
};