const { Server } = require('socket.io');

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:3000",
        "http://localhost:3001", 
        "http://localhost:5173",
        "https://invitation-nine-tan.vercel.app"
      ],
      methods: ["GET", "POST"]
    }
  });

  // Manejar conexiones de clientes
  io.on('connection', (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);

    // Unirse a una sala específica (por ejemplo, para un evento de boda)
    socket.on('join-wedding', (weddingId) => {
      socket.join(`wedding-${weddingId}`);
      console.log(`Cliente ${socket.id} se unió a la boda ${weddingId}`);
    });

    // Unirse a una sala de invitados específicos
    socket.on('join-guest-room', (guestId) => {
      socket.join(`guest-${guestId}`);
      console.log(`Cliente ${socket.id} se unió a la sala del invitado ${guestId}`);
    });

    // Desconexión
    socket.on('disconnect', () => {
      console.log(`Cliente desconectado: ${socket.id}`);
    });
  });

  return io;
};

// Función para emitir eventos a todos los clientes
const emitToAll = (event, data) => {
  if (io) {
    io.emit(event, data);
  }
};

// Función para emitir eventos a una sala específica
const emitToRoom = (room, event, data) => {
  if (io) {
    io.to(room).emit(event, data);
  }
};

// Función para emitir eventos a un cliente específico
const emitToClient = (socketId, event, data) => {
  if (io) {
    io.to(socketId).emit(event, data);
  }
};

module.exports = {
  initializeSocket,
  emitToAll,
  emitToRoom,
  emitToClient
}; 