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


