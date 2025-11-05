import { Audit } from '../models/Audit.model.js';
import { Op } from 'sequelize';

export const createAudit = async ({ user_id, entity_type, entity_id, action, metadata }) => {
  return Audit.create({ user_id, entity_type, entity_id, action, metadata });
};

export const findAuditsByUser = async (userId, { limit = 20, offset = 0 } = {}) => {
  return Audit.findAll({
    where: { user_id: userId },
    order: [['created_at', 'DESC']],
    limit,
    offset
  });
};

export const userHasAudit = async (userId) => {
  const count = await Audit.count({ where: { user_id: userId } });
  return count > 0;
};

export const findAudits = async ({ userId, entityType, entityId, action, from, to, limit = 50, offset = 0 } = {}) => {
  const where = {};
  if (userId) where.user_id = userId;
  if (entityType) where.entity_type = entityType;
  if (entityId) where.entity_id = entityId;
  if (action) where.action = action;
  if (from || to) {
    where.created_at = {};
    if (from) where.created_at[Op.gte] = from;
    if (to) where.created_at[Op.lte] = to;
  }

  return Audit.findAll({ where, order: [['created_at', 'DESC']], limit, offset });
};


