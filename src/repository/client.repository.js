import { Op } from 'sequelize';
import { Client } from '../models/Client.model.js';
import { NaturalClient } from '../models/NaturalClient.model.js';
import { JuridicalClient } from '../models/JuridicalClient.js';
import { User } from '../models/User.model.js';

/* ============================================================
   🟢 CREAR CLIENTE
   ============================================================ */
export const createClient = async (clientData) => {
  const { tipo_cliente, ...rest } = clientData;

  // 1️⃣ Crear el cliente base con todos los campos comunes
  const client = await Client.create({
    tipo_cliente,
    user_id: rest.user_id,
    correo_electronico: rest.correo_electronico,
    numero_telefono: rest.numero_telefono,
    codigo_pais_telefono: rest.codigo_pais_telefono,
    idioma: rest.idioma,
    recibe_emails_marketing: rest.recibe_emails_marketing,
    recibe_sms_marketing: rest.recibe_sms_marketing,
    direccion: rest.direccion,
    ciudad: rest.ciudad,
    pais_residencia: rest.pais_residencia,
    departamento_estado: rest.departamento_estado,
    codigo_postal: rest.codigo_postal,
    apartamento_local: rest.apartamento_local,
    telefono_residencia: rest.telefono_residencia,
    codigo_pais_residencia: rest.codigo_pais_residencia,
    recaudar_impuestos: rest.recaudar_impuestos,
    notas: rest.notas,
    etiquetas: rest.etiquetas
  });

  // 2️⃣ Crear el registro específico (natural o jurídica)
  if (tipo_cliente === 'persona_natural') {
    await NaturalClient.create({ ...rest, client_id: client.id });
  } else if (tipo_cliente === 'persona_juridica') {
    await JuridicalClient.create({ ...rest, client_id: client.id });
  }

  // 3️⃣ Retornar con includes
  return findClientById(client.id);
};

/* ============================================================
   🔵 OBTENER CLIENTE POR ID
   ============================================================ */
export const findClientById = async (id) => {
  return Client.findByPk(id, {
    include: [
      { model: User, as: 'user', attributes: ['id', 'username', 'email'] },
      { model: NaturalClient, as: 'persona_natural' },
      { model: JuridicalClient, as: 'persona_juridica' }
    ]
  });
};

/* ============================================================
   🟣 LISTAR CLIENTES DE UN USUARIO (con paginación y búsqueda)
   ============================================================ */
export const findClientsByUserId = async (userId, options = {}) => {
  const { 
    page = 1, 
    limit = 10, 
    search = '', 
    includeInactive = false // 👈 Nuevo parámetro
  } = options;

  const offset = (page - 1) * limit;

  // Base: siempre filtra por usuario
  const whereClause = { user_id: userId };

  // 👇 Si no se quieren incluir los inactivos, filtramos por state: true
  if (!includeInactive) {
    whereClause.state = true;
  }

  // Búsqueda textual opcional
  if (search) {
    whereClause[Op.or] = [
      { '$persona_natural.nombre$': { [Op.iLike]: `%${search}%` } },
      { '$persona_natural.apellido$': { [Op.iLike]: `%${search}%` } },
      { '$persona_juridica.razon_social$': { [Op.iLike]: `%${search}%` } },
      { '$persona_juridica.nit$': { [Op.iLike]: `%${search}%` } },
      { correo_electronico: { [Op.iLike]: `%${search}%` } }
    ];
  }

  const { count, rows } = await Client.findAndCountAll({
    where: whereClause,
    include: [
      { model: User, as: 'user', attributes: ['id', 'username', 'email'] },
      { model: NaturalClient, as: 'persona_natural' },
      { model: JuridicalClient, as: 'persona_juridica' }
    ],
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


/* ============================================================
   🟡 ACTUALIZAR CLIENTE
   ============================================================ */
export const updateClient = async (id, clientData) => {
  const client = await Client.findByPk(id);
  if (!client) return null;

  const { tipo_cliente, ...rest } = clientData;

  await client.update({ tipo_cliente: tipo_cliente || client.tipo_cliente });

  if (client.tipo_cliente === 'persona_natural') {
    const data = await NaturalClient.findOne({ where: { client_id: client.id } });
    if (data) await data.update(rest);
  } else if (client.tipo_cliente === 'persona_juridica') {
    const data = await JuridicalClient.findOne({ where: { client_id: client.id } });
    if (data) await data.update(rest);
  }

  return findClientById(client.id);
};

/* ============================================================
   🔴 ELIMINAR CLIENTE
   ============================================================ */
export const deleteClient = async (id) => {
  const client = await Client.findByPk(id);
  if (!client) return null;

  client.state = false;
  await client.save()
  return client; // Retorna el cliente actualizado
}



/* ============================================================
   🔍 BUSCAR POR CAMPOS ESPECÍFICOS
   ============================================================ */
export const findClientByEmail = async (email) => {
  return Client.findOne({
    where: { correo_electronico: email },
    include: [
      { model: NaturalClient, as: 'persona_natural' },
      { model: JuridicalClient, as: 'persona_juridica' }
    ]
  });
};

export const findClientByNit = async (nit) => {
  return Client.findOne({
    include: [
      {
        model: JuridicalClient,
        as: 'persona_juridica',
        where: { nit }
      }
    ]
  });
};

export const findClientByPhone = async (phone) => {
  return Client.findOne({
    where: { numero_telefono: phone },
    include: [
      { model: NaturalClient, as: 'persona_natural' },
      { model: JuridicalClient, as: 'persona_juridica' }
    ]
  });
};

export const findClientsByType = async (userId, tipoCliente, options = {}) => {
  const { page = 1, limit = 10 } = options;
  const offset = (page - 1) * limit;

  const include =
    tipoCliente === 'persona_natural'
      ? [{ model: NaturalClient, as: 'persona_natural' }]
      : [{ model: JuridicalClient, as: 'persona_juridica' }];

  const { count, rows } = await Client.findAndCountAll({
    where: { user_id: userId, tipo_cliente: tipoCliente },
    include,
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
