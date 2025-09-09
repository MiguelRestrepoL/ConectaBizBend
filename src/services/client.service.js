import {
  createClient,
  findClientById,
  findClientsByUserId,
  updateClient,
  deleteClient,
  findClientByEmailAndUserId,
  findClientByPhoneAndUserId
} from '../repository/client.repository.js';

export const createClientService = async (clientData, userId) => {
  // Validar que el email no esté duplicado para este usuario
  const existingEmail = await findClientByEmailAndUserId(clientData.correo_electronico, userId);
  if (existingEmail) {
    const error = new Error('Ya existe un cliente con este correo electrónico');
    error.status = 409;
    throw error;
  }

  // Validar que el teléfono no esté duplicado para este usuario
  const existingPhone = await findClientByPhoneAndUserId(clientData.numero_telefono, userId);
  if (existingPhone) {
    const error = new Error('Ya existe un cliente con este número de teléfono');
    error.status = 409;
    throw error;
  }

  // Agregar el user_id a los datos del cliente
  const clientWithUserId = {
    ...clientData,
    user_id: userId
  };

  const client = await createClient(clientWithUserId);
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

export const validateClientData = (clientData) => {
  const errors = [];

  // Validaciones obligatorias
  if (!clientData.nombre || clientData.nombre.trim() === '') {
    errors.push('El nombre es obligatorio');
  }

  if (!clientData.apellido || clientData.apellido.trim() === '') {
    errors.push('El apellido es obligatorio');
  }

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

  // Validar enum de recaudar_impuestos
  if (clientData.recaudar_impuestos && !['recaudar', 'recaudar_con_excepcion', 'no_recaudar'].includes(clientData.recaudar_impuestos)) {
    errors.push('El valor de recaudar_impuestos no es válido');
  }

  return errors;
};
