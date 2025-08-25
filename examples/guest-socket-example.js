// Ejemplo específico para el endpoint GET /guests con WebSockets
import { io } from 'socket.io-client';
import { useState, useEffect } from 'react';

class GuestSocketManager {
  constructor() {
    this.socket = null;
    this.guests = [];
    this.callbacks = {
      onGuestsFetched: null
    };
  }

  // Conectar al WebSocket
  connect() {
    this.socket = io('http://localhost:3000');
    
    this.socket.on('connect', () => {
    });

    this.socket.on('disconnect', () => {
    });

    // Configurar listener SOLO para cuando se obtienen todos los invitados
    this.setupGuestListener();
  }

  // Configurar listener específico para el evento de obtener invitados
  setupGuestListener() {
    // SOLO este evento se emite desde GET /guests
    this.socket.on('guests-fetched', (data) => {
      
      if (this.callbacks.onGuestsFetched) {
        this.callbacks.onGuestsFetched(data);
      }
    });
  }

  // Configurar callback para cuando se obtienen los invitados
  onGuestsFetched(callback) {
    this.callbacks.onGuestsFetched = callback;
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
export function useGuestSocket() {
  const [guestsCount, setGuestsCount] = useState(0);
  const [lastFetchTime, setLastFetchTime] = useState(null);
  const [socketManager, setSocketManager] = useState(null);

  useEffect(() => {
    const manager = new GuestSocketManager();
    
    // Configurar callback para cuando se obtienen los invitados
    manager.onGuestsFetched((data) => {
      setGuestsCount(data.count);
      setLastFetchTime(data.timestamp);
    });

    // Conectar al WebSocket
    manager.connect();
    setSocketManager(manager);

    return () => {
      manager.disconnect();
    };
  }, []);

  return { guestsCount, lastFetchTime, socketManager };
}

// Ejemplo de componente React que solo escucha el evento de obtener invitados
export function GuestCountComponent() {
  const { guestsCount, lastFetchTime, socketManager } = useGuestSocket();

  return (
    <div>
      <h3>Contador de Invitados en Tiempo Real</h3>
      <p>Total de invitados: <strong>{guestsCount}</strong></p>
      {lastFetchTime && (
        <p>Última actualización: {new Date(lastFetchTime).toLocaleString()}</p>
      )}
      <small>
        Este componente se actualiza automáticamente cuando alguien hace GET /guests
      </small>
    </div>
  );
}

// Ejemplo de uso en Vanilla JavaScript
export function initGuestSocket() {
  const manager = new GuestSocketManager();
  
  // Configurar callback para cuando se obtienen los invitados
  manager.onGuestsFetched((data) => { 
    // Aquí puedes actualizar tu UI
    updateGuestCount(data.count);
    updateLastFetchTime(data.timestamp);
  });

  // Conectar
  manager.connect();
  
  return manager;
}

// Función para actualizar el contador de invitados en el DOM
function updateGuestCount(count) {
  const countElement = document.getElementById('guest-count');
  if (countElement) {
    countElement.textContent = count;
  }
}

// Función para actualizar la última vez que se obtuvieron los invitados
function updateLastFetchTime(timestamp) {
  const timeElement = document.getElementById('last-fetch-time');
  if (timeElement) {
    timeElement.textContent = new Date(timestamp).toLocaleString();
  }
}

// Ejemplo de HTML que se actualiza automáticamente
export const guestCountHTML = `
<div id="guest-dashboard">
  <h3>Dashboard de Invitados</h3>
  <div class="stats">
    <p>Total de invitados: <span id="guest-count">0</span></p>
    <p>Última actualización: <span id="last-fetch-time">Nunca</span></p>
  </div>
  <small>
    Este dashboard se actualiza automáticamente cuando alguien consulta la lista de invitados
  </small>
</div>
`;

export default GuestSocketManager; 