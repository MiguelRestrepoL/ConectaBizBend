import { connectDB, sequelize } from './src/config/database.js';
import './src/models/index.js';
import { User, Client } from './src/models/index.js';

async function testAssociations() {
  try {
    await connectDB();
    console.log('✅ Conectado a la base de datos');
    
    // Verificar si las asociaciones están definidas
    console.log('🔍 Verificando asociaciones...');
    
    // Verificar asociación en User
    if (User.associations && User.associations.clients) {
      console.log('✅ Asociación User -> Client encontrada');
    } else {
      console.log('❌ Asociación User -> Client NO encontrada');
    }
    
    // Verificar asociación en Client
    if (Client.associations && Client.associations.user) {
      console.log('✅ Asociación Client -> User encontrada');
    } else {
      console.log('❌ Asociación Client -> User NO encontrada');
    }
    
    // Intentar hacer una consulta con include
    console.log('🔍 Probando consulta con include...');
    const clients = await Client.findAll({
      include: [{
        association: 'user',
        attributes: ['id', 'username', 'email']
      }],
      limit: 1
    });
    
    console.log('✅ Consulta con include funcionó correctamente');
    console.log('📊 Clientes encontrados:', clients.length);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await sequelize.close();
  }
}

testAssociations();
