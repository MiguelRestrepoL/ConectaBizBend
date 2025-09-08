import App from "./app.js";
import { connectDB, sequelize } from "./config/database.js";
import './models/index.js'; 


async function main() {
    try {
        await connectDB();

        const PORT = process.env.PORT || 3000;

        //sincroniza los modelos con la base de datos
        await sequelize.sync({ force: false });
        console.log('📦 Modelos sincronizados con la base de datos');

        App.listen(PORT, () => {
            console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("❌ Error al conectarse a la base de datos", error);
    }
}

main();
