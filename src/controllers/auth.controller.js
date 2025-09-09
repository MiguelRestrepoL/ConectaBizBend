import { registerUser, loginUser, acceptTerms } from '../services/auth.service.js';

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


