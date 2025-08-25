# API Endpoints Documentation

## Endpoints Públicos (No requieren JWT)

### Autenticación
- `POST /auth` - Login de usuario

### Usuario
- `POST /user` - Crear nuevo usuario

## Endpoints Protegidos (Requieren JWT Bearer Token)

### Usuario
- `GET /user` - Obtener todos los usuarios
- `GET /user/:id` - Obtener usuario por ID
- `PATCH /user` - Actualizar usuario
- `DELETE /user/:id` - Eliminar usuario

### Invitados
- `GET /guest/guests` - Obtener todos los invitados
- `POST /guest` - Crear nuevo invitado
- `GET /guest/:guestId` - Obtener invitado por ID
- `PATCH /guest/:guestId` - Actualizar invitado
- `DELETE /guest/:guestId` - Eliminar invitado

## Uso de JWT

Para los endpoints protegidos, incluir en el header:
```
Authorization: Bearer <tu_token_jwt>
```

## Ejemplo de uso en Postman

### Endpoint Público (Crear Usuario)
```
POST http://localhost:3000/user
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "password123"
}
```

### Endpoint Protegido (Obtener Usuarios)
```
GET http://localhost:3000/user
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

## Notas Importantes

- El endpoint `POST /user` es público para permitir el registro de nuevos usuarios
- Todos los demás endpoints de usuario e invitados requieren autenticación JWT
- El token JWT se obtiene mediante el endpoint de login (`POST /auth`)
- Los tokens tienen la clave secreta "colabora" 