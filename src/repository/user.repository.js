import { Op } from 'sequelize';
import { User } from '../models/User.model.js';

export const createUser = async ({ username, email, password }) => {
  return User.create({ username, email, password });
};

export const findByEmailOrUsername = async ({ email, username }) => {
  return User.findOne({
    where: {
      [Op.or]: [email ? { email } : null, username ? { username } : null].filter(Boolean),
    },
  });
};

export const findByEmailWithPassword = async (email) => {
  return User.unscoped().findOne({ where: { email } });
};

export const findById = async (id) => {
  return User.findByPk(id);
};

export const acceptTermsByUserId = async (id) => {
  const user = await User.findByPk(id);
  if (!user) return null;
  user.accepted_terms = true;
  await user.save();
  return user;
};

export const updateUserProfile = async (id, { buyer_email, country, birth_date }) => {
  const user = await User.findByPk(id);
  if (!user) return null;
  
  const updateData = {};
  if (buyer_email !== undefined) updateData.buyer_email = buyer_email;
  if (country !== undefined) updateData.country = country;
  if (birth_date !== undefined) updateData.birth_date = birth_date;
  
  await user.update(updateData);
  return user;
};

export const findByBuyerEmail = async (buyer_email) => {
  return User.findOne({ where: { buyer_email } });
};

export const changePassword = async (id, currentPassword, newPassword) => {
  const user = await User.unscoped().findByPk(id);
  if (!user) return null;
  
  // Verificar que la contraseña actual sea correcta
  const isCurrentPasswordValid = await user.validatePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    const error = new Error('La contraseña actual es incorrecta');
    error.status = 400;
    throw error;
  }
  
  // Actualizar con la nueva contraseña
  user.password = newPassword;
  await user.save();
  return user;
};

export const getUserById = async (id) => {
  return User.findByPk(id);
};


