const { Server } = require('socket.io');

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:3000",
        "http://localhost:3001", 
        "http://localhost:5173",
        "http://localhost:8080",
        "https://invitation-nine-tan.vercel.app",
        "https://guest-table-control.vercel.app"
      ],
      methods: ["GET", "POST"],
      credentials: true
    },
    allowEIO3: true,
    transports: ['websocket', 'polling']
  });

  // Manejar conexiones de clientes
  io.on('connection', (socket) => {
    console.log('🔌 Cliente conectado:', socket.id);

    // Unirse a una sala específica (por ejemplo, para un evento de boda)
    socket.on('join-wedding', (weddingId) => {
      socket.join(`wedding-${weddingId}`);
      console.log(`👰 Cliente ${socket.id} se unió a la boda ${weddingId}`);
    });

    // Unirse a una sala de invitados específicos
    socket.on('join-guest-room', (guestId) => {
      socket.join(`guest-${guestId}`);
      console.log(`👤 Cliente ${socket.id} se unió a la sala del invitado ${guestId}`);
    });

    // Manejar solicitud de invitados
    socket.on('request-guests', async () => {
      console.log('📋 Cliente solicitó lista de invitados');
      try {
        const { getAllGuests } = require('../usesCases/guest.usecase');
        const guests = await getAllGuests();
        socket.emit('guests-fetched', {
          action: 'fetched',
          guests: guests,
          count: guests.length,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        socket.emit('guest-update-error', {
          message: 'Error al obtener invitados',
          error: error.message
        });
      }
    });

    // Manejar actualización de invitado
    socket.on('guest-update', async (guestData) => {
      console.log('🔄 Cliente actualizando invitado:', guestData);
      try {
        const { updateGuest } = require('../usesCases/guest.usecase');
        const updatedGuest = await updateGuest(guestData.guestInvitationId, guestData);
        
        if (updatedGuest) {
          // Confirmar actualización al cliente
          socket.emit('guest-update-confirmed', {
            action: 'updated',
            guest: updatedGuest,
            timestamp: new Date().toISOString()
          });
          
          // Notificar a todos los clientes
          io.emit('guest-updated', {
            action: 'updated',
            guest: updatedGuest,
            timestamp: new Date().toISOString()
          });
        } else {
          socket.emit('guest-update-error', {
            message: 'Invitado no encontrado'
          });
        }
      } catch (error) {
        socket.emit('guest-update-error', {
          message: 'Error al actualizar invitado',
          error: error.message
        });
      }
    });

    // Manejar agregar invitado
    socket.on('guest-add', async (guestData) => {
      console.log('➕ Cliente agregando invitado:', guestData);
      try {
        const { createGuest } = require('../usesCases/guest.usecase');
        const newGuest = await createGuest(guestData);
        
        if (newGuest) {
          // Notificar a todos los clientes
          io.emit('guest-added', {
            action: 'added',
            guest: newGuest,
            timestamp: new Date().toISOString()
          });
        }
      } catch (error) {
        socket.emit('guest-update-error', {
          message: 'Error al agregar invitado',
          error: error.message
        });
      }
    });

    // Manejar eliminar invitado
    socket.on('guest-remove', async (data) => {
      console.log('➖ Cliente eliminando invitado:', data);
      try {
        const { deleteGuest } = require('../usesCases/guest.usecase');
        const deletedGuest = await deleteGuest(data.id);
        
        if (deletedGuest) {
          // Notificar a todos los clientes
          io.emit('guest-removed', {
            action: 'removed',
            guestId: data.id,
            timestamp: new Date().toISOString()
          });
        }
      } catch (error) {
        socket.emit('guest-update-error', {
          message: 'Error al eliminar invitado',
          error: error.message
        });
      }
    });

    // Manejar ping/pong para heartbeat
    socket.on('ping', () => {
      socket.emit('pong');
    });

    // Desconexión
    socket.on('disconnect', (reason) => {
      console.log('❌ Cliente desconectado:', socket.id, 'Razón:', reason);
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