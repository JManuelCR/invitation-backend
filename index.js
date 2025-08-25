require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const http = require('http');
const app = require('./src/server');
const { initializeSocket } = require('./src/lib/socket.lib');

const { DB_USERNAME, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;
const port = process.env.PORT || 3000;
const databaseUrl = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`;

mongoose
.connect(databaseUrl)
.then(() => {
    // Crear servidor HTTP
    const server = http.createServer(app);
    
    // Inicializar sockets
    initializeSocket(server);
    
    // Iniciar servidor
    server.listen(port, () => {
        console.log(`Servidor corriendo en puerto ${port}`);
        console.log(`WebSocket disponible en ws://localhost:${port}`);
        console.log(process.env.SECRET_KEY)
    });
})
.catch((error) => {
    console.error('Error connecting to MongoDB', error);
});