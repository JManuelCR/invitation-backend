// Configuración simple de variables de entorno
require('dotenv').config();

const env = {
  // JWT Configuration
  SECRET_KEY: process.env.SECRET_KEY || "colabora_secret_key_2024_default",
  
  // Database Configuration
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  
  // Server Configuration
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development'
};

// Validar configuración crítica
const validateEnv = () => {
  const errors = [];
  
  if (!env.SECRET_KEY) {
    errors.push("SECRET_KEY no está configurada");
  }
  
  if (!env.DB_USERNAME || !env.DB_PASSWORD || !env.DB_HOST || !env.DB_NAME) {
    errors.push("Variables de base de datos incompletas");
  }
  
  if (errors.length > 0) {
    console.error("❌ Errores de configuración:");
    errors.forEach(error => console.error(`  - ${error}`));
    
    if (env.NODE_ENV === 'production') {
      console.error("⚠️ ADVERTENCIA: Ejecutando en producción con configuración incompleta");
    }
  } else {
  }
  
  return errors.length === 0;
};

// Mostrar configuración (sin mostrar datos sensibles)
const showEnv = () => {
};

module.exports = {
  env,
  validateEnv,
  showEnv
}; 