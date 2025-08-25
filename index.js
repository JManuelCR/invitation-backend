require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const http = require('http');
const app = require('./src/server');
const { initializeSocket } = require('./src/lib/socket.lib');
const { env, validateEnv, showEnv } = require('./src/config/env');

// Validar configuración antes de iniciar
if (!validateEnv()) {
  console.error("❌ No se puede iniciar el servidor con configuración inválida");
  process.exit(1);
}

// Mostrar configuración
showEnv();

const databaseUrl = `mongodb+srv://${env.DB_USERNAME}:${env.DB_PASSWORD}@${env.DB_HOST}/${env.DB_NAME}`;

mongoose
.connect(databaseUrl)
.then(() => {
    
    // Crear servidor HTTP
    const server = http.createServer(app);
    
    // Inicializar sockets
    initializeSocket(server);
    
    // Iniciar servidor
    server.listen(env.PORT, () => {
    });
})
.catch((error) => {
    console.error('❌ Error connecting to MongoDB:', error);
    process.exit(1);
});