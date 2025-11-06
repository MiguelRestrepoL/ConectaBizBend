import { createAudit, findAuditsByUser, userHasAudit, findAudits } from '../repository/audit.repository.js';

export const logAudit = async ({ userId, entityType, entityId, action, metadata }) => {
  return createAudit({
    user_id: userId,
    entity_type: entityType,
    entity_id: entityId,
    action,
    metadata
  });
};

export const getUserAudits = async (userId, { limit, offset } = {}) => {
  return findAuditsByUser(userId, { limit, offset });
};

export const checkUserHasAudit = async (userId) => {
  return userHasAudit(userId);
};

export const queryAudits = async (filters) => {
  return findAudits(filters);
};


