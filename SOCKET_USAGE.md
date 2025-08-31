# Uso de WebSockets en la API - Eventos de Invitados

## Configuración del Cliente (Frontend)

### 1. Instalar Socket.IO Client
```bash
npm install socket.io-client
```

### 2. Conectar al WebSocket
```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

// Escuchar conexión
socket.on('connect', () => {
  console.log('Conectado al servidor WebSocket');
});

// Escuchar desconexión
socket.on('disconnect', () => {
  console.log('Desconectado del servidor WebSocket');
});
```

### 3. Escuchar Eventos de Invitados en Tiempo Real

#### Eventos Disponibles

```javascript
// 1. Cuando se obtienen todos los invitados (GET /guests)
socket.on('guests-fetched', (data) => {
  console.log('Lista de invitados obtenida:', data);
  console.log('Total de invitados:', data.count);
  console.log('Timestamp:', data.timestamp);
  
  // Actualizar tu UI aquí
  updateGuestCount(data.count);
  updateLastFetchTime(data.timestamp);
});

// 2. Cuando se crea un nuevo invitado (POST /guest)
socket.on('guest-created', (data) => {
  console.log('Nuevo invitado creado:', data);
  console.log('Datos del invitado:', data.guest);
  console.log('Timestamp:', data.timestamp);
  
  // Actualizar tu UI aquí
  addGuestToList(data.guest);
  updateGuestCount();
});

// 3. Cuando se actualiza un invitado (PATCH /guest/:id)
socket.on('guest-updated', (data) => {
  console.log('Invitado actualizado:', data);
  console.log('ID del invitado:', data.guestId);
  console.log('Datos actualizados:', data.guest);
  console.log('Timestamp:', data.timestamp);
  
  // Actualizar tu UI aquí
  updateGuestInList(data.guestId, data.guest);
});

// 4. Cuando se elimina un invitado (DELETE /guest/:id)
socket.on('guest-deleted', (data) => {
  console.log('Invitado eliminado:', data);
  console.log('ID del invitado:', data.guestId);
  console.log('Timestamp:', data.timestamp);
  
  // Actualizar tu UI aquí
  removeGuestFromList(data.guestId);
  updateGuestCount();
});
```

## Ejemplo Completo de React - Lista de Invitados en Tiempo Real

```jsx
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

function GuestListComponent() {
  const [guests, setGuests] = useState([]);
  const [guestsCount, setGuestsCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Conectar al WebSocket
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    // Escuchar todos los eventos de invitados
    newSocket.on('guests-fetched', (data) => {
      console.log(`Se obtuvieron ${data.count} invitados`);
      setGuestsCount(data.count);
      setLastUpdate(data.timestamp);
    });

    newSocket.on('guest-created', (data) => {
      console.log('Nuevo invitado creado:', data.guest.guestName);
      setGuests(prev => [...prev, data.guest]);
      setGuestsCount(prev => prev + 1);
      setLastUpdate(data.timestamp);
    });

    newSocket.on('guest-updated', (data) => {
      console.log('Invitado actualizado:', data.guest.guestName);
      setGuests(prev => 
        prev.map(guest => 
          guest._id === data.guestId ? data.guest : guest
        )
      );
      setLastUpdate(data.timestamp);
    });

    newSocket.on('guest-deleted', (data) => {
      console.log('Invitado eliminado:', data.guestId);
      setGuests(prev => 
        prev.filter(guest => guest._id !== data.guestId)
      );
      setGuestsCount(prev => prev - 1);
      setLastUpdate(data.timestamp);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <div>
      <h2>Lista de Invitados en Tiempo Real</h2>
      <div className="stats">
        <p>Total de invitados: <strong>{guestsCount}</strong></p>
        {lastUpdate && (
          <p>Última actualización: {new Date(lastUpdate).toLocaleString()}</p>
        )}
      </div>
      
      <ul>
        {guests.map(guest => (
          <li key={guest._id}>
            <strong>{guest.guestName}</strong> - {guest.guestType}
            <span className="status">{guest.guestInvited}</span>
          </li>
        ))}
      </ul>
      
      <small>
        Esta lista se actualiza automáticamente cuando:
        • Se consultan todos los invitados (GET /guests)
        • Se crea un nuevo invitado (POST /guest)
        • Se actualiza un invitado (PATCH /guest/:id)
        • Se elimina un invitado (DELETE /guest/:id)
      </small>
    </div>
  );
}

export default GuestListComponent;
```

## Ejemplo de Vanilla JavaScript

```javascript
// Conectar al WebSocket
const socket = io('http://localhost:3000');

// Escuchar todos los eventos de invitados
socket.on('guests-fetched', (data) => {
  console.log('🎉 Lista de invitados actualizada!');
  updateGuestCount(data.count);
  updateLastFetchTime(data.timestamp);
});

socket.on('guest-created', (data) => {
  console.log('🆕 Nuevo invitado creado:', data.guest.guestName);
  addGuestToList(data.guest);
  updateGuestCount();
});

socket.on('guest-updated', (data) => {
  console.log('✏️ Invitado actualizado:', data.guest.guestName);
  updateGuestInList(data.guestId, data.guest);
});

socket.on('guest-deleted', (data) => {
  console.log('🗑️ Invitado eliminado:', data.guestId);
  removeGuestFromList(data.guestId);
  updateGuestCount();
});

// Funciones para actualizar la UI
function updateGuestCount(count) {
  const countElement = document.getElementById('guest-count');
  if (countElement) {
    countElement.textContent = count;
  }
}

function updateLastFetchTime(timestamp) {
  const timeElement = document.getElementById('last-fetch-time');
  if (timeElement) {
    timeElement.textContent = new Date(timestamp).toLocaleString();
  }
}

function addGuestToList(guest) {
  const listElement = document.getElementById('guest-list');
  if (listElement) {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${guest.guestName}</strong> - ${guest.guestType}`;
    li.setAttribute('data-guest-id', guest._id);
    listElement.appendChild(li);
  }
}

function updateGuestInList(guestId, updatedGuest) {
  const guestElement = document.querySelector(`[data-guest-id="${guestId}"]`);
  if (guestElement) {
    guestElement.innerHTML = `<strong>${updatedGuest.guestName}</strong> - ${updatedGuest.guestType}`;
  }
}

function removeGuestFromList(guestId) {
  const guestElement = document.querySelector(`[data-guest-id="${guestId}"]`);
  if (guestElement) {
    guestElement.remove();
  }
}
```

## Eventos Disponibles

### Eventos de Invitados
- **`guests-fetched`** - Se emite cuando se hace GET /guests
  - `action`: "fetched"
  - `count`: número total de invitados
  - `timestamp`: momento exacto de la consulta

- **`guest-created`** - Se emite cuando se hace POST /guest
  - `action`: "created"
  - `guest`: objeto completo del invitado creado
  - `timestamp`: momento exacto de la creación

- **`guest-updated`** - Se emite cuando se hace PATCH /guest/:id
  - `action`: "updated"
  - `guestId`: ID del invitado actualizado
  - `guest`: objeto completo del invitado actualizado
  - `timestamp`: momento exacto de la actualización

- **`guest-deleted`** - Se emite cuando se hace DELETE /guest/:id
  - `action`: "deleted"
  - `guestId`: ID del invitado eliminado
  - `timestamp`: momento exacto de la eliminación

## Cómo Funciona

1. **Cliente se conecta** al WebSocket
2. **Escucha todos los eventos** de invitados
3. **Cuando se hace cualquier operación CRUD** (desde cualquier cliente)
4. **Se emite automáticamente** el evento correspondiente
5. **Todos los clientes conectados** reciben la notificación
6. **La UI se actualiza** sin necesidad de refrescar

## Casos de Uso

### 1. Dashboard en Tiempo Real
- Ver cambios de invitados inmediatamente
- Contador siempre actualizado
- Lista sincronizada entre múltiples pantallas

### 2. Aplicación Móvil
- Notificaciones push para cambios
- Sincronización automática
- Experiencia fluida sin refrescar

### 3. Panel de Administración
- Ver cambios en tiempo real
- Auditoría de operaciones
- Monitoreo de actividad

## Ventajas de esta Implementación

1. **Tiempo Real**: Los cambios se reflejan inmediatamente
2. **Completa**: Cubre todas las operaciones CRUD
3. **Eficiente**: Solo emite cuando es necesario
4. **Consistente**: Misma estructura de datos para todos los eventos
5. **Escalable**: Funciona con múltiples clientes conectados 