import App from "./app.js";
import { connectDB, sequelize } from "./config/database.js";
import './models/index.js'; 


async function main() {
    try {
        await connectDB();

        const PORT = process.env.PORT || 3000;

        //sincroniza los modelos con la base de datos (force: true borra y recrea las tablas)
        await sequelize.sync({ force: true });
        console.log('📦 Base de datos recreada según los modelos');
        console.log('⚠️  IMPORTANTE: Cambia force: true a force: false en src/index.js para futuras ejecuciones');

        App.listen(PORT, () => {
            console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("❌ Error al conectarse a la base de datos", error);
    }
}

main();
