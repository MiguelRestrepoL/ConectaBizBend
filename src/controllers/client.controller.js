import {
  createClientService,
  getClientByIdService,
  getClientsByUserIdService,
  updateClientService,
  deleteClientService,
  validateClientData
} from '../services/client.service.js';

export const createClient = async (req, res) => {
  try {
    const clientData = req.body;
    const userId = req.user.id; // Asumiendo que el middleware de auth agrega req.user

    // Validar datos del cliente
    const validationErrors = validateClientData(clientData);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        error: 'Datos de cliente inválidos',
        details: validationErrors 
      });
    }

    const client = await createClientService(clientData, userId);
    return res.status(201).json({ 
      message: 'Cliente creado exitosamente',
      client 
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ 
      error: error.message || 'Error interno del servidor' 
    });
  }
};

export const getClientById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const client = await getClientByIdService(id, userId);
    return res.json({ client });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ 
      error: error.message || 'Error interno del servidor' 
    });
  }
};

export const getClients = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, search = '' } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      search: search.trim()
    };

    const result = await getClientsByUserIdService(userId, options);
    return res.json(result);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ 
      error: error.message || 'Error interno del servidor' 
    });
  }
};

export const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const clientData = req.body;
    const userId = req.user.id;

    // Validar datos del cliente si se proporcionan
    if (Object.keys(clientData).length > 0) {
      const validationErrors = validateClientData(clientData);
      if (validationErrors.length > 0) {
        return res.status(400).json({ 
          error: 'Datos de cliente inválidos',
          details: validationErrors 
        });
      }
    }

    const client = await updateClientService(id, clientData, userId);
    return res.json({ 
      message: 'Cliente actualizado exitosamente',
      client 
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ 
      error: error.message || 'Error interno del servidor' 
    });
  }
};

export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const client = await deleteClientService(id, userId);
    return res.json({ 
      message: 'Cliente eliminado exitosamente',
      client 
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ 
      error: error.message || 'Error interno del servidor' 
    });
  }
};

export const getClientStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Obtener estadísticas básicas de clientes
    const result = await getClientsByUserIdService(userId, { page: 1, limit: 1 });
    
    const stats = {
      totalClients: result.total,
      totalPages: result.totalPages
    };

    return res.json({ stats });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ 
      error: error.message || 'Error interno del servidor' 
    });
  }
};
