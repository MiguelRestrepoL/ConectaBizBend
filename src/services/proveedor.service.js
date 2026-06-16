import {
  createProveedor,
  findProveedorById,
  findProveedoresByUserId,
  updateProveedor,
  deleteProveedor,
} from '../repository/proveedor.repository.js';
import { logAudit } from './audit.service.js';
 
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
 
  const proveedor = await createProveedor({ ...clean(data), user_id: userId });
 
  try {
    await logAudit({
      userId,
      entityType: 'proveedor',
      entityId: proveedor.id,
      action: 'create',
      metadata: { nombre: proveedor.nombre, correo: proveedor.correo, ciudad: proveedor.ciudad },
    });
  } catch (_e) {}
 
  return proveedor;
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
  const errors = validate(data, false);
  if (errors.length) { const e = new Error(errors.join(', ')); e.status = 400; throw e; }
 
  const updated = await updateProveedor(id, clean(data));
 
  try {
    await logAudit({
      userId,
      entityType: 'proveedor',
      entityId: id,
      action: data.activo !== undefined && Object.keys(clean(data)).length === 1 ? 'toggle_estado' : 'update',
      metadata: { nombre: p.nombre, cambios: Object.keys(clean(data)), activo: data.activo },
    });
  } catch (_e) {}
 
  return updated;
};
 
export const deleteProveedorService = async (userId, id) => {
  const p = await findProveedorById(id);
  if (!p) { const e = new Error('Proveedor no encontrado'); e.status = 404; throw e; }
  if (p.user_id !== userId) { const e = new Error('Sin permisos'); e.status = 403; throw e; }
 
  const result = await deleteProveedor(id);
 
  try {
    await logAudit({
      userId,
      entityType: 'proveedor',
      entityId: id,
      action: 'delete',
      metadata: { nombre: p.nombre, correo: p.correo },
    });
  } catch (_e) {}
 
  return result;
};