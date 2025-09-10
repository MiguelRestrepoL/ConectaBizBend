import {
  createPedidoService,
  getPedidoByIdService,
  getPedidosByUserIdService,
  getPedidosByClienteIdService,
  updatePedidoService,
  deletePedidoService,
  getPedidoStatsService,
  validatePedidoData
} from '../services/pedido.service.js';

export const createPedido = async (req, res) => {
  try {
    const pedidoData = req.body;
    const userId = req.user.id;

    // Validar datos del pedido
    const validationErrors = validatePedidoData(pedidoData);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        error: 'Datos de pedido inválidos',
        details: validationErrors 
      });
    }

    const pedido = await createPedidoService(pedidoData, userId);
    return res.status(201).json({ 
      message: 'Pedido creado exitosamente',
      pedido 
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ 
      error: error.message || 'Error interno del servidor' 
    });
  }
};

export const getPedidoById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const pedido = await getPedidoByIdService(id, userId);
    return res.json({ pedido });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ 
      error: error.message || 'Error interno del servidor' 
    });
  }
};

export const getPedidos = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, search = '', estado = '', cliente_id = '' } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      search: search.trim(),
      estado: estado.trim(),
      cliente_id: cliente_id.trim()
    };

    const result = await getPedidosByUserIdService(userId, options);
    return res.json(result);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ 
      error: error.message || 'Error interno del servidor' 
    });
  }
};

export const getPedidosByCliente = async (req, res) => {
  try {
    const { clienteId } = req.params;
    const userId = req.user.id;
    const { page = 1, limit = 10, estado = '' } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      estado: estado.trim()
    };

    const result = await getPedidosByClienteIdService(clienteId, userId, options);
    return res.json(result);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ 
      error: error.message || 'Error interno del servidor' 
    });
  }
};

export const updatePedido = async (req, res) => {
  try {
    const { id } = req.params;
    const pedidoData = req.body;
    const userId = req.user.id;

    // Validar datos del pedido si se proporcionan
    if (Object.keys(pedidoData).length > 0) {
      const validationErrors = validatePedidoData(pedidoData);
      if (validationErrors.length > 0) {
        return res.status(400).json({ 
          error: 'Datos de pedido inválidos',
          details: validationErrors 
        });
      }
    }

    const pedido = await updatePedidoService(id, pedidoData, userId);
    return res.json({ 
      message: 'Pedido actualizado exitosamente',
      pedido 
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ 
      error: error.message || 'Error interno del servidor' 
    });
  }
};

export const deletePedido = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const pedido = await deletePedidoService(id, userId);
    return res.json({ 
      message: 'Pedido eliminado exitosamente',
      pedido 
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ 
      error: error.message || 'Error interno del servidor' 
    });
  }
};

export const getPedidoStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const stats = await getPedidoStatsService(userId);
    return res.json({ stats });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ 
      error: error.message || 'Error interno del servidor' 
    });
  }
};

export const updatePedidoEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const userId = req.user.id;

    // Validar que el estado sea válido
    if (!estado || !['preparando', 'enviado', 'entregado'].includes(estado)) {
      return res.status(400).json({ 
        error: 'Estado inválido. Debe ser: preparando, enviado o entregado' 
      });
    }

    const pedidoData = { estado };
    const pedido = await updatePedidoService(id, pedidoData, userId);
    
    return res.json({ 
      message: `Estado del pedido actualizado a: ${estado}`,
      pedido 
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ 
      error: error.message || 'Error interno del servidor' 
    });
  }
};
