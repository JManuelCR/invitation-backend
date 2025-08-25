const jwt = require("jsonwebtoken");

// Obtener la clave secreta del entorno o usar una por defecto
const SECRET_KEY = process.env.SECRET_KEY || "colabora_secret_key_2024_default";

// Verificar que la clave secreta esté disponible
if (!SECRET_KEY) {
    console.error("⚠️ ADVERTENCIA: SECRET_KEY no está configurada. Usando clave por defecto.");
}


const sign = (payload = {}) => {
    try {
        if (!SECRET_KEY) {
            throw new Error("SECRET_KEY no está configurada");
        }
        return jwt.sign(payload, SECRET_KEY, { expiresIn: "5h" });
    } catch (error) {
        console.error("Error al firmar JWT:", error);
        throw new Error("Error al generar token: " + error.message);
    }
}

const verify = (token) => {
    try {
        if (!SECRET_KEY) {
            throw new Error("SECRET_KEY no está configurada");
        }
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        console.error("Error al verificar JWT:", error);
        throw new Error("Token inválido o expirado: " + error.message);
    }
}

module.exports = { sign, verify };