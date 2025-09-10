import { Op } from 'sequelize';
import { BlacklistedToken } from '../models/BlacklistedToken.model.js';

export const addTokenToBlacklist = async (token, userId, expiresAt) => {
  return BlacklistedToken.create({
    token,
    user_id: userId,
    expires_at: expiresAt
  });
};

export const isTokenBlacklisted = async (token) => {
  const blacklistedToken = await BlacklistedToken.findOne({
    where: { token }
  });
  return !!blacklistedToken;
};

export const cleanExpiredTokens = async () => {
  const now = new Date();
  return BlacklistedToken.destroy({
    where: {
      expires_at: {
        [Op.lt]: now
      }
    }
  });
};

export const blacklistAllUserTokens = async (userId) => {
  // Esta función podría ser útil para invalidar todos los tokens de un usuario
  // Por ejemplo, cuando se cambia la contraseña
  return BlacklistedToken.destroy({
    where: { user_id: userId }
  });
};
