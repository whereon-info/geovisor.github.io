const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Token del DENUE (reemplázalo por el tuyo)
const TOKEN_DENUE = "33602899-98fd-4db7-8ce9-41c0330f1d7e";

// Middleware
app.use(cors());
app.use(express.json());

// Servir frontend estático
app.use(express.static(path.join(__dirname, "../frontend")));

// Ruta para API DENUE
app.get("/api/denue/:condi/:lonlat/:mts", async (req, res) => {
    try {
        const { condi, lonlat, mts } = req.params;
        const url = `https://www.inegi.org.mx/app/api/denue/v1/consulta/buscar/${encodeURIComponent(condi)}/${lonlat}/${mts}/${TOKEN_DENUE}`;

        console.log(`🔍 Consultando: ${url}`);
        const response = await fetch(url);

        if (!response.ok) throw new Error(`Error API DENUE: ${response.status}`);
        const data = await response.json();

        if (Array.isArray(data)) {
            res.json(data);
        } else {
            console.warn("⚠️ Respuesta inesperada:", data);
            res.json([]);
        }
    } catch (error) {
        console.error("❌ Error consultando DENUE:", error.message);
        res.status(500).json({ error: "Error consultando DENUE" });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
