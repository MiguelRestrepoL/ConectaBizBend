import {
  createClient,
  findClientById,
  findClientsByUserId,
  updateClient,
  deleteClient,
  findClientsByType,
  findClientByEmail,
  findClientByPhone,
  findClientByNit,
  updateClientState
} from '../repository/client.repository.js';
import { logAudit } from './audit.service.js';

export const createClientService = async (clientData, userId) => {
  // Validar que el email no esté duplicado para este usuario
  const existingEmail = await findClientByEmail(clientData.correo_electronico);
  if (existingEmail) {
    const error = new Error('Ya existe un cliente con este correo electrónico');
    error.status = 409;
    throw error;
  }

  // Validar que el teléfono no esté duplicado para este usuario
  const existingPhone = await findClientByPhone(clientData.numero_telefono);
  if (existingPhone) {
    const error = new Error('Ya existe un cliente con este número de teléfono');
    error.status = 409;
    throw error;
  }

  // Si es persona jurídica, validar que el NIT no esté duplicado
  if (clientData.tipo_cliente === 'persona_juridica' && clientData.nit) {
    const existingNit = await findClientByNit(clientData.nit);
    if (existingNit) {
      const error = new Error('Ya existe un cliente con este NIT');
      error.status = 409;
      throw error;
    }
  }

  // Agregar el user_id a los datos del cliente
  const clientWithUserId = {
    ...clientData,
    user_id: userId
  };

  const client = await createClient(clientWithUserId);

  // Auditoría: creación de cliente
  try {
    await logAudit({
      userId,
      entityType: 'client',
      entityId: client.id,
      action: 'create',
      metadata: {
        correo_electronico: client.correo_electronico,
        numero_telefono: client.numero_telefono,
        tipo_cliente: client.tipo_cliente
      }
    });
  } catch (_e) {
    // Evitar que falle la creación por error de auditoría
  }

  return client;
};

export const getClientByIdService = async (id, userId) => {
  const client = await findClientById(id);
  
  if (!client) {
    const error = new Error('Cliente no encontrado');
    error.status = 404;
    throw error;
  }

  // Verificar que el cliente pertenece al usuario
  if (client.user_id !== userId) {
    const error = new Error('No tienes permisos para acceder a este cliente');
    error.status = 403;
    throw error;
  }

  return client;
};

export const getClientsByUserIdService = async (userId, options = {}) => {
  const result = await findClientsByUserId(userId, options);
  return result;
};

export const getClientsByTypeService = async (userId, tipoCliente, options = {}) => {
  const result = await findClientsByType(userId, tipoCliente, options);
  return result;
};

export const updateClientService = async (id, clientData, userId) => {
  const client = await findClientById(id);
  
  if (!client) {
    const error = new Error('Cliente no encontrado');
    error.status = 404;
    throw error;
  }



  // Verificar que el cliente pertenece al usuario
  if (client.user_id !== userId) {
    const error = new Error('No tienes permisos para modificar este cliente');
    error.status = 403;
    throw error;
  }

  // Si se está actualizando el email, verificar que no esté duplicado
  if (clientData.correo_electronico && clientData.correo_electronico !== client.correo_electronico) {
    const existingEmail = await findClientByEmailAndUserId(clientData.correo_electronico, userId);
    if (existingEmail && existingEmail.id !== id) {
      const error = new Error('Ya existe un cliente con este correo electrónico');
      error.status = 409;
      throw error;
    }
  }

  // Si se está actualizando el teléfono, verificar que no esté duplicado
  if (clientData.numero_telefono && clientData.numero_telefono !== client.numero_telefono) {
    const existingPhone = await findClientByPhoneAndUserId(clientData.numero_telefono, userId);
    if (existingPhone && existingPhone.id !== id) {
      const error = new Error('Ya existe un cliente con este número de teléfono');
      error.status = 409;
      throw error;
    }
  }


  const updatedClient = await updateClient(id, clientData);
  return updatedClient;
};

export const deleteClientService = async (id, userId) => {
  const client = await findClientById(id);
  
  if (!client) {
    const error = new Error('Cliente no encontrado');
    error.status = 404;
    throw error;
  }

  // Verificar que el cliente pertenece al usuario
  if (client.user_id !== userId) {
    const error = new Error('No tienes permisos para eliminar este cliente');
    error.status = 403;
    throw error;
  }

  const deletedClient = await deleteClient(id);
  return deletedClient;
};

export const updateClientStateService = async (id, state) => {
  const client = await updateClientState(id, state);
  if (!client) {
    const error = new Error('Cliente no encontrado');
    error.status = 404;
    throw error;
  }
  return client;
};


export const validateClientData = (clientData) => {
  const errors = [];

  // Validar tipo de cliente
  if (!clientData.tipo_cliente || !['persona_natural', 'persona_juridica'].includes(clientData.tipo_cliente)) {
    errors.push('El tipo de cliente debe ser "persona_natural" o "persona_juridica"');
  }

  // Validaciones comunes
  if (!clientData.correo_electronico || clientData.correo_electronico.trim() === '') {
    errors.push('El correo electrónico es obligatorio');
  } else {
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clientData.correo_electronico)) {
      errors.push('El formato del correo electrónico no es válido');
    }
  }

  if (!clientData.numero_telefono || clientData.numero_telefono.trim() === '') {
    errors.push('El número de teléfono es obligatorio');
  }

  // Validaciones específicas por tipo de cliente
  if (clientData.tipo_cliente === 'persona_natural') {
    if (!clientData.nombre || clientData.nombre.trim() === '') {
      errors.push('El nombre es obligatorio para persona natural');
    }
    if (!clientData.apellido || clientData.apellido.trim() === '') {
      errors.push('El apellido es obligatorio para persona natural');
    }
  } else if (clientData.tipo_cliente === 'persona_juridica') {
    if (!clientData.razon_social || clientData.razon_social.trim() === '') {
      errors.push('La razón social es obligatoria para persona jurídica');
    }
    if (!clientData.nit || clientData.nit.trim() === '') {
      errors.push('El NIT es obligatorio para persona jurídica');
    }
    if (!clientData.representante_legal || clientData.representante_legal.trim() === '') {
      errors.push('El representante legal es obligatorio para persona jurídica');
    }
    
    // Validar tipo de empresa si se proporciona
    if (clientData.tipo_empresa && !['SAS', 'LTDA', 'SA', 'SRL', 'EIRL', 'SOCIEDAD_COLECTIVA', 'SOCIEDAD_EN_COMANDITA', 'OTRO'].includes(clientData.tipo_empresa)) {
      errors.push('El tipo de empresa no es válido');
    }
  }

  // Validar enum de recaudar_impuestos
  if (clientData.recaudar_impuestos && !['recaudar', 'recaudar_con_excepcion', 'no_recaudar'].includes(clientData.recaudar_impuestos)) {
    errors.push('El valor de recaudar_impuestos no es válido');
  }

  return errors;
};
