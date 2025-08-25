// Ejemplo práctico de uso de WebSockets para usuarios en tiempo real
import { io } from 'socket.io-client';
import { useState, useEffect } from 'react';

class UserSocketManager {
  constructor() {
    this.socket = null;
    this.users = [];
    this.callbacks = {
      onUserCreated: null,
      onUserUpdated: null,
      onUserDeleted: null,
      onUsersFetched: null
    };
  }

  // Conectar al WebSocket
  connect() {
    this.socket = io('http://localhost:3000');
    
    this.socket.on('connect', () => {
    });

    this.socket.on('disconnect', () => {
    });

    // Configurar listeners para eventos de usuarios
    this.setupUserListeners();
  }

  // Configurar listeners para eventos de usuarios
  setupUserListeners() {
    // Cuando se crea un nuevo usuario
    this.socket.on('user-created', (data) => {
      this.users.push(data.user);
      
      if (this.callbacks.onUserCreated) {
        this.callbacks.onUserCreated(data.user);
      }
    });

    // Cuando se actualiza un usuario
    this.socket.on('user-updated', (data) => {
      
      const index = this.users.findIndex(user => user._id === data.userId);
      if (index !== -1) {
        this.users[index] = data.user;
      }
      
      if (this.callbacks.onUserUpdated) {
        this.callbacks.onUserUpdated(data.user, data.userId);
      }
    });

    // Cuando se elimina un usuario
    this.socket.on('user-deleted', (data) => {
      
      this.users = this.users.filter(user => user._id !== data.userId);
      
      if (this.callbacks.onUserDeleted) {
        this.callbacks.onUserDeleted(data.userId);
      }
    });

    // Cuando se obtienen todos los usuarios
    this.socket.on('users-fetched', (data) => {
      
      if (this.callbacks.onUsersFetched) {
        this.callbacks.onUsersFetched(data.count);
      }
    });
  }

  // Unirse a la sala de un usuario específico
  joinUserRoom(userId) {
    if (this.socket) {
      this.socket.emit('join-user-room', userId);
    }
  }

  // Unirse a la sala de invitados
  joinGuestRoom(guestId) {
    if (this.socket) {
      this.socket.emit('join-guest-room', guestId);
    }
  }

  // Unirse a la sala de una boda
  joinWedding(weddingId) {
    if (this.socket) {
      this.socket.emit('join-wedding', weddingId);
    }
  }

  // Configurar callbacks para eventos
  onUserCreated(callback) {
    this.callbacks.onUserCreated = callback;
  }

  onUserUpdated(callback) {
    this.callbacks.onUserUpdated = callback;
  }

  onUserDeleted(callback) {
    this.callbacks.onUserDeleted = callback;
  }

  onUsersFetched(callback) {
    this.callbacks.onUsersFetched = callback;
  }

  // Obtener lista actual de usuarios
  getUsers() {
    return this.users;
  }

  // Desconectar
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

// Ejemplo de uso en React
export function useUserSocket() {
  const [users, setUsers] = useState([]);
  const [socketManager, setSocketManager] = useState(null);

  useEffect(() => {
    const manager = new UserSocketManager();
    
    // Configurar callbacks
    manager.onUserCreated((newUser) => {
      setUsers(prev => [...prev, newUser]);
    });

    manager.onUserUpdated((updatedUser, userId) => {
      setUsers(prev => 
        prev.map(user => 
          user._id === userId ? updatedUser : user
        )
      );
    });

    manager.onUserDeleted((userId) => {
      setUsers(prev => 
        prev.filter(user => user._id !== userId)
      );
    });

    manager.onUsersFetched((count) => {
    });

    // Conectar al WebSocket
    manager.connect();
    setSocketManager(manager);

    return () => {
      manager.disconnect();
    };
  }, []);

  return { users, socketManager };
}

// Ejemplo de uso en componente React
export function UserListComponent() {
  const { users, socketManager } = useUserSocket();

  useEffect(() => {
    if (socketManager) {
      // Unirse a la sala principal de usuarios
      socketManager.joinWedding('main-wedding');
    }
  }, [socketManager]);

  return (
    <div>
      <h2>Lista de Usuarios en Tiempo Real</h2>
      <p>Total: {users.length} usuarios</p>
      <ul>
        {users.map(user => (
          <li key={user._id}>
            <strong>{user.name}</strong> - {user.email} 
            <span className="badge">{user.userType}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Ejemplo de uso en Vanilla JavaScript
export function initUserSocket() {
  const manager = new UserSocketManager();
  
  // Configurar callbacks
  manager.onUserCreated((user) => {
    // Aquí puedes actualizar tu UI
    updateUserList();
  });

  manager.onUserUpdated((user, userId) => {
    // Aquí puedes actualizar tu UI
    updateUserInList(user);
  });

  manager.onUserDeleted((userId) => {
    // Aquí puedes actualizar tu UI
    removeUserFromList(userId);
  });

  // Conectar
  manager.connect();
  
  return manager;
}

// Función para actualizar la lista de usuarios en el DOM
function updateUserList() {
  // Implementa la lógica para actualizar tu UI
}

// Función para actualizar un usuario específico en la lista
function updateUserInList(user) {
  // Implementa la lógica para actualizar un usuario específico
}

// Función para remover un usuario de la lista
function removeUserFromList(userId) {
  // Implementa la lógica para remover un usuario
}

export default UserSocketManager; 