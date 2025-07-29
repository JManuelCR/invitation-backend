# Configuración de CORS

## ¿Qué es CORS?

CORS (Cross-Origin Resource Sharing) es un mecanismo de seguridad que permite que un servidor web permita que recursos sean accedidos por un dominio diferente al que sirve el recurso.

## Configuración Actual

El backend está configurado para permitir conexiones desde los siguientes orígenes en desarrollo:

- `http://localhost:3000` (React default)
- `http://localhost:3001` (React alternate)
- `http://localhost:5173` (Vite default)
- `http://localhost:5174` (Vite default)
- `http://localhost:8080` (Vue default)
- `http://localhost:4200` (Angular default)
- `http://127.0.0.1:3000`
- `http://127.0.0.1:3001`
- `http://127.0.0.1:5173`
- `http://127.0.0.1:8080`
- `http://127.0.0.1:4200`

## Configuración para Producción

Para configurar CORS en producción, agrega estas variables a tu archivo `.env`:

```env
NODE_ENV=production
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

## Métodos HTTP Permitidos

- GET
- POST
- PUT
- DELETE
- PATCH
- OPTIONS

## Headers Permitidos

- Content-Type
- Authorization
- X-Requested-With
- Accept
- Origin
- Access-Control-Request-Method
- Access-Control-Request-Headers

## Solución de Problemas

### Error: "Access to fetch at 'http://localhost:3000/guest' from origin 'http://localhost:5173' has been blocked by CORS policy"

**Solución:** Verifica que tu frontend esté corriendo en uno de los puertos permitidos o agrega el puerto a la lista de orígenes permitidos en `src/middlewares/cors.middleware.js`.

### Error: "Request header field authorization is not allowed by Access-Control-Allow-Headers"

**Solución:** El header 'Authorization' ya está incluido en la configuración. Verifica que estés enviando el header correctamente desde el frontend.

### Error: "The request client is not a secure context and the resource is in more-restrictive private network access policy"

**Solución:** Este error es común en Chrome. Intenta usar `http://127.0.0.1` en lugar de `http://localhost`.

## Testing CORS

Puedes probar la configuración de CORS con curl:

```bash
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     http://localhost:3000/guest
```

## Notas Importantes

1. **Credentials**: La configuración permite cookies y headers de autenticación (`credentials: true`)
2. **Preflight**: Las solicitudes OPTIONS se manejan automáticamente
3. **Logging**: Los orígenes bloqueados se registran en la consola del servidor
4. **Flexibilidad**: En desarrollo, se permiten requests sin origin (útil para testing con Postman) 