import { cleanExpiredTokens } from '../repository/blacklistedToken.repository.js';

const cleanTokens = async () => {
  try {
    const deletedCount = await cleanExpiredTokens();
    console.log(`✅ Se eliminaron ${deletedCount} tokens expirados`);
  } catch (error) {
    console.error('❌ Error al limpiar tokens expirados:', error);
  }
};

// Ejecutar la limpieza
cleanTokens();
