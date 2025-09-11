import { registerUser, loginUser, acceptTerms, logoutUser, updateProfile, changeUserPassword, getUserProfile } from '../services/auth.service.js';

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await registerUser({ username, email, password });
    return res.status(201).json({ user });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ error: error.message || 'Error interno' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await loginUser({ email, password });
    return res.json(data);
  } catch (error) {
    console.log(error);
    const status = error.status || 500;
    return res.status(status).json({ error: error.message || 'Error interno' });
  }
};

export const acceptUserTerms = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await acceptTerms(id);
    return res.json({ user });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ error: error.message || 'Error interno' });
  }
};

export const logout = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Token de acceso requerido' });
    }

    const result = await logoutUser(token);
    return res.json(result);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ error: error.message || 'Error interno' });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { buyer_email, country, birth_date } = req.body;
    
    const user = await updateProfile(id, { buyer_email, country, birth_date });
    return res.json({ user });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ error: error.message || 'Error interno' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    
    const result = await changeUserPassword(id, { currentPassword, newPassword });
    return res.json(result);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ error: error.message || 'Error interno' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await getUserProfile(id);
    return res.json({ user });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ error: error.message || 'Error interno' });
  }
};


