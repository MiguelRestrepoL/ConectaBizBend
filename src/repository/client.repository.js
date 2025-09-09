import { Op } from 'sequelize';
import { Client } from '../models/Client.model.js';

export const createClient = async (clientData) => {
  return Client.create(clientData);
};

export const findClientById = async (id) => {
  return Client.findByPk(id, {
    include: [{
      association: 'user',
      attributes: ['id', 'username', 'email']
    }]
  });
};

export const findClientsByUserId = async (userId, options = {}) => {
  const { page = 1, limit = 10, search = '' } = options;
  const offset = (page - 1) * limit;

  const whereClause = {
    user_id: userId
  };

  // Búsqueda por nombre, apellido o email
  if (search) {
    whereClause[Op.or] = [
      { nombre: { [Op.iLike]: `%${search}%` } },
      { apellido: { [Op.iLike]: `%${search}%` } },
      { correo_electronico: { [Op.iLike]: `%${search}%` } }
    ];
  }

  const { count, rows } = await Client.findAndCountAll({
    where: whereClause,
    include: [{
      association: 'user',
      attributes: ['id', 'username', 'email']
    }],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['created_at', 'DESC']]
  });

  return {
    clients: rows,
    total: count,
    page: parseInt(page),
    totalPages: Math.ceil(count / limit)
  };
};

export const updateClient = async (id, clientData) => {
  const client = await Client.findByPk(id);
  if (!client) return null;
  
  await client.update(clientData);
  return client;
};

export const deleteClient = async (id) => {
  const client = await Client.findByPk(id);
  if (!client) return null;
  
  await client.destroy();
  return client;
};

export const findClientByEmail = async (email) => {
  return Client.findOne({ where: { correo_electronico: email } });
};

export const findClientByEmailAndUserId = async (email, userId) => {
  return Client.findOne({ 
    where: { 
      correo_electronico: email,
      user_id: userId
    } 
  });
};

export const findClientByPhone = async (phoneNumber) => {
  return Client.findOne({ where: { numero_telefono: phoneNumber } });
};

export const findClientByPhoneAndUserId = async (phoneNumber, userId) => {
  return Client.findOne({ 
    where: { 
      numero_telefono: phoneNumber,
      user_id: userId
    } 
  });
};
