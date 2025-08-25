# Uso de WebSockets en la API - Solo GET /guests

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

### 3. Escuchar Evento Específico de Invitados

#### Evento ÚNICO - Solo se emite desde GET /guests
```javascript
// Cuando se obtienen todos los invitados (GET /guests)
socket.on('guests-fetched', (data) => {
  console.log('Lista de invitados obtenida:', data);
  console.log('Total de invitados:', data.count);
  console.log('Timestamp:', data.timestamp);
  
  // Actualizar tu UI aquí
  updateGuestCount(data.count);
  updateLastFetchTime(data.timestamp);
});
```

## Ejemplo Completo de React - Solo Contador de Invitados

```jsx
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

function GuestCountComponent() {
  const [guestsCount, setGuestsCount] = useState(0);
  const [lastFetchTime, setLastFetchTime] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Conectar al WebSocket
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    // Escuchar SOLO el evento de obtener invitados
    newSocket.on('guests-fetched', (data) => {
      console.log(`Se obtuvieron ${data.count} invitados`);
      setGuestsCount(data.count);
      setLastFetchTime(data.timestamp);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <div>
      <h2>Contador de Invitados en Tiempo Real</h2>
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

export default GuestCountComponent;
```

## Ejemplo de Vanilla JavaScript

```javascript
// Conectar al WebSocket
const socket = io('http://localhost:3000');

// Escuchar SOLO el evento de obtener invitados
socket.on('guests-fetched', (data) => {
  console.log('🎉 Evento emitido desde GET /guests!');
  console.log(`Se obtuvieron ${data.count} invitados`);
  
  // Actualizar tu UI aquí
  updateGuestCount(data.count);
  updateLastFetchTime(data.timestamp);
});

// Función para actualizar el contador
function updateGuestCount(count) {
  const countElement = document.getElementById('guest-count');
  if (countElement) {
    countElement.textContent = count;
  }
}

// Función para actualizar la última vez
function updateLastFetchTime(timestamp) {
  const timeElement = document.getElementById('last-fetch-time');
  if (timeElement) {
    timeElement.textContent = new Date(timestamp).toLocaleString();
  }
}
```

## Evento Disponible

### Evento ÚNICO de Invitados
- **`guests-fetched`** - Se emite SOLO cuando se hace GET /guests
  - `action`: "fetched"
  - `count`: número total de invitados
  - `timestamp`: momento exacto de la consulta

## Cómo Funciona

1. **Cliente se conecta** al WebSocket
2. **Escucha SOLO el evento** `guests-fetched`
3. **Cuando alguien hace GET /guests** (desde cualquier cliente)
4. **Se emite automáticamente** el evento `guests-fetched`
5. **Todos los clientes conectados** reciben la notificación
6. **La UI se actualiza** con el nuevo conteo

## Casos de Uso

### 1. Dashboard en Tiempo Real
- Mostrar contador de invitados siempre actualizado
- Ver cuándo fue la última consulta
- No necesitas refrescar la página

### 2. Notificaciones
- Saber cuándo alguien consulta la lista
- Mantener estadísticas actualizadas
- Sincronización entre múltiples pantallas

### 3. Auditoría
- Rastrear cuándo se consultan los invitados
- Mantener logs de actividad
- Monitoreo de uso del sistema

## Ventajas de esta Implementación

1. **Específica**: Solo afecta al endpoint que quieres
2. **Ligera**: No interfiere con otros endpoints
3. **Eficiente**: Solo emite cuando es necesario
4. **Simple**: Fácil de implementar y mantener
5. **Focalizada**: Solo para el caso de uso que necesitas

## Configuración del Servidor

El servidor está configurado para:
- Aceptar conexiones WebSocket
- Emitir SOLO el evento `guests-fetched` cuando se hace GET /guests
- NO interferir con otros endpoints
- Mantener el funcionamiento original de todas las demás rutas 