const { emitToAll, emitToRoom, emitToClient } = require('../lib/socket.lib');

// Middleware para emitir eventos a todos los clientes
const emitToAllClients = (event, data) => {
  return (req, res, next) => {
    // Agregar función de emisión al request
    req.emitToAll = (eventName, eventData) => {
      emitToAll(eventName, eventData);
    };
    
    // Emitir el evento especificado
    if (event && data) {
      emitToAll(event, data);
    }
    
    next();
  };
};

// Middleware para emitir eventos a una sala específica
const emitToSpecificRoom = (room, event, data) => {
  return (req, res, next) => {
    // Agregar función de emisión al request
    req.emitToRoom = (roomName, eventName, eventData) => {
      emitToRoom(roomName, eventName, eventData);
    };
    
    // Emitir el evento especificado
    if (room && event && data) {
      emitToRoom(room, event, data);
    }
    
    next();
  };
};

// Middleware para emitir eventos a un cliente específico
const emitToSpecificClient = (socketId, event, data) => {
  return (req, res, next) => {
    // Agregar función de emisión al request
    req.emitToClient = (clientId, eventName, eventData) => {
      emitToClient(clientId, eventName, eventData);
    };
    
    // Emitir el evento especificado
    if (socketId && event && data) {
      emitToClient(socketId, event, data);
    }
    
    next();
  };
};

// Middleware genérico que agrega funciones de socket al request
const addSocketFunctions = () => {
  return (req, res, next) => {
    req.emitToAll = (event, data) => emitToAll(event, data);
    req.emitToRoom = (room, event, data) => emitToRoom(room, event, data);
    req.emitToClient = (socketId, event, data) => emitToClient(socketId, event, data);
    next();
  };
};

module.exports = {
  emitToAllClients,
  emitToSpecificRoom,
  emitToSpecificClient,
  addSocketFunctions
}; 