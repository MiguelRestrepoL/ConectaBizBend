import { getUserAudits, checkUserHasAudit, queryAudits } from '../services/audit.service.js';

export const listMyAudits = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit || '20', 10);
    const offset = parseInt(req.query.offset || '0', 10);
    const audits = await getUserAudits(userId, { limit, offset });
    return res.json({ audits });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ error: error.message || 'Error interno del servidor' });
  }
};

export const hasMyAudits = async (req, res) => {
  try {
    const userId = req.user.id;
    const has = await checkUserHasAudit(userId);
    return res.json({ has });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ error: error.message || 'Error interno del servidor' });
  }
};

export const findAuditsController = async (req, res) => {
  try {
    const { entity_type, entity_id, action, from, to, limit, offset } = req.query;
    const filters = {
      userId: req.user.id,
      entityType: entity_type,
      entityId: entity_id ? parseInt(entity_id, 10) : undefined,
      action,
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined
    };
    const audits = await queryAudits(filters);
    return res.json({ audits });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ error: error.message || 'Error interno del servidor' });
  }
};


