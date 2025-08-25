# Configuración para Render - Solución del Error JWT

## 🚨 Error Actual
```
{"success":false,"message":"Cannot access 'payload' before initialization"}
```

## 🔧 Solución

### 1. Ir a tu Dashboard de Render
- Accede a [render.com](https://render.com)
- Ve a tu dashboard
- Selecciona tu servicio

### 2. Configurar Variables de Entorno
Ve a **Environment** → **Environment Variables** y agrega:

#### Variable Obligatoria (Principal)
```
SECRET_KEY = tu_clave_secreta_muy_segura_aqui_2024
```

#### Variables de Base de Datos
```
DB_USERNAME = tu_usuario_mongodb
DB_PASSWORD = tu_password_mongodb
DB_HOST = cluster.mongodb.net
DB_NAME = nombre_de_tu_base_de_datos
```

#### Variables Opcionales
```
NODE_ENV = production
PORT = 10000
```

### 3. Generar una Clave Secreta Segura

#### Opción A: Usar Node.js
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### Opción B: Usar Online Generator
- Ve a [generate-secret.vercel.app](https://generate-secret.vercel.app/32)
- Copia la clave generada

#### Opción C: Usar esta clave (solo para pruebas)
```
colabora_secret_key_2024_production_secure_64_chars_long_key_very_secure
```

### 4. Ejemplo de Configuración Completa
```
SECRET_KEY=8f7d9e6c5b4a3928f7d9e6c5b4a3928f7d9e6c5b4a3928f7d9e6c5b4a3928
DB_USERNAME=usuario_mongodb
DB_PASSWORD=password_mongodb
DB_HOST=cluster0.abc123.mongodb.net
DB_NAME=invitacion_boda
NODE_ENV=production
PORT=10000
```

### 5. Reiniciar el Servicio
- Después de agregar las variables
- Ve a **Manual Deploy** → **Deploy latest commit**
- O espera a que se despliegue automáticamente

## 🔍 Verificar Configuración

### 1. En los Logs de Render
Deberías ver:
```
✅ Configuración validada correctamente
🔧 Configuración del servidor:
  - Entorno: production
  - Puerto: 10000
  - SECRET_KEY configurada: SÍ
  - Base de datos: cluster0.abc123.mongodb.net/invitacion_boda
✅ Conectado a MongoDB
🚀 Servidor corriendo en puerto 10000
🌐 WebSocket disponible en ws://localhost:10000
📱 Entorno: production
```

### 2. Si hay Errores
```
❌ Errores de configuración:
  - SECRET_KEY no está configurada
  - Variables de base de datos incompletas
⚠️ ADVERTENCIA: Ejecutando en producción con configuración incompleta
```

## 🚀 Después de la Configuración

### 1. Probar Login
```bash
POST https://tu-app.onrender.com/auth
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "password123"
}
```

### 2. Probar Endpoint Protegido
```bash
GET https://tu-app.onrender.com/guest/guests
Authorization: Bearer tu_token_jwt_aqui
```

## 🔒 Seguridad

### 1. Clave Secreta
- **NUNCA** uses la clave por defecto en producción
- **SIEMPRE** usa una clave aleatoria de al menos 32 caracteres
- **NUNCA** subas la clave a Git

### 2. Variables de Entorno
- **SIEMPRE** usa variables de entorno en producción
- **NUNCA** hardcodees credenciales en el código
- **SIEMPRE** valida la configuración al iniciar

## 📞 Soporte

Si sigues teniendo problemas:

1. **Verifica los logs** en Render
2. **Confirma las variables** están configuradas
3. **Reinicia el servicio** después de cambios
4. **Verifica la conexión** a MongoDB

## 🎯 Resumen

El error se soluciona agregando:
```
SECRET_KEY = tu_clave_secreta_aqui
```

En las variables de entorno de Render.

## 🔧 Cambios Realizados en el Código

1. **Corregido el error de `payload`** en `user.usecase.js`
2. **Mejorado el manejo de errores** en `jwt.lib.js`
3. **Agregada validación de configuración** al iniciar el servidor
4. **Fallback para SECRET_KEY** si no está configurada
5. **Mejor logging** para debug en producción 