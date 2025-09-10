import jwt from 'jsonwebtoken';
import {
  createUser,
  findByEmailOrUsername,
  findByEmailWithPassword,
  acceptTermsByUserId,
} from '../repository/user.repository.js';
import { addTokenToBlacklist, isTokenBlacklisted } from '../repository/blacklistedToken.repository.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const registerUser = async ({ username, email, password }) => {
  const existing = await findByEmailOrUsername({ email, username });
  if (existing) {
    const conflict = existing.email === email ? 'email' : 'username';
    const error = new Error(`El ${conflict} ya está registrado`);
    error.status = 409;
    throw error;
  }
  const user = await createUser({ username, email, password });
  return user;
};

export const loginUser = async ({ email, password }) => {
  const user = await findByEmailWithPassword(email);
  if (!user) {
    const error = new Error('Credenciales inválidas');
    error.status = 401;
    throw error;
  }

  const isValid = await user.validatePassword(password);
  if (!isValid) {
    const error = new Error('Credenciales inválidas');
    error.status = 401;
    throw error;
  }

  const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  const { password: _omit, ...userData } = user.get({ plain: true });
  return { token, user: userData };
};

export const acceptTerms = async (userId) => {
  const user = await acceptTermsByUserId(userId);
  if (!user) {
    const error = new Error('Usuario no encontrado');
    error.status = 404;
    throw error;
  }
  return user;
};

export const logoutUser = async (token) => {
  try {
    // Decodificar el token para obtener la información del usuario y expiración
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.sub;
    const expiresAt = new Date(decoded.exp * 1000); // Convertir timestamp a fecha

    // Agregar el token a la blacklist
    await addTokenToBlacklist(token, userId, expiresAt);
    
    return { message: 'Logout exitoso' };
  } catch (error) {
    // Si el token ya expiró o es inválido, no es necesario hacer nada
    // pero devolvemos un mensaje de éxito para no revelar información
    return { message: 'Logout exitoso' };
  }
};

export const verifyTokenNotBlacklisted = async (token) => {
  const isBlacklisted = await isTokenBlacklisted(token);
  if (isBlacklisted) {
    const error = new Error('Token inválido');
    error.status = 401;
    throw error;
  }
  return true;
};


