import {
  createClientService,
  getClientByIdService,
  getClientsByUserIdService,
  getClientsByTypeService,
  updateClientService,
  deleteClientService,
  validateClientData,
  updateClientStateService
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
    const { page = 1, limit = 10, search = '', includeInactive } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      search: search.trim(),
      includeInactive: includeInactive === 'true' // 👈 Convertir string a boolean
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

export const getClientsByType = async (req, res) => {
  try {
    const userId = req.user.id;
    const { tipo } = req.params;
    const { page = 1, limit = 10, search = '' } = req.query;

    // Validar tipo de cliente
    if (!['persona_natural', 'persona_juridica'].includes(tipo)) {
      return res.status(400).json({ 
        error: 'Tipo de cliente inválido. Debe ser "persona_natural" o "persona_juridica"' 
      });
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      search: search.trim()
    };

    const result = await getClientsByTypeService(userId, tipo, options);
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

export const updateClientState = async (req, res) => {
  try {
    const { id } = req.params;
    const { state } = req.body;
    const userId = req.user.id;

    const client = await updateClientStateService(id, state, userId);
    return res.json({ 
      message: 'Estado del cliente actualizado exitosamente',
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
    
    // Obtener estadísticas por tipo
    const naturalResult = await getClientsByTypeService(userId, 'persona_natural', { page: 1, limit: 1 });
    const juridicaResult = await getClientsByTypeService(userId, 'persona_juridica', { page: 1, limit: 1 });
    
    const stats = {
      totalClients: result.total,
      totalPages: result.totalPages,
      byType: {
        persona_natural: {
          total: naturalResult.total,
          totalPages: naturalResult.totalPages
        },
        persona_juridica: {
          total: juridicaResult.total,
          totalPages: juridicaResult.totalPages
        }
      }
    };

    return res.json({ stats });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ 
      error: error.message || 'Error interno del servidor' 
    });
  }
};
