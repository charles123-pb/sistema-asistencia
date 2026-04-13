# Credenciales de Acceso - Sistema de Asistencia

## URLs de Acceso

- **Frontend (Login):** http://localhost:4200/login
- **Backend API:** http://localhost:3001
- **H2 Console (dev):** http://localhost:3001/h2-console
- **Admin Dashboard:** http://localhost:4200/admin

---

## Usuarios Seeded (Desarrollo)

### Administrador
```
ID:     1
Nombre: Administrador
Email:  admin@universidad.edu
PIN:    0000
Rol:    ADMIN
Acceso: Panel administrativo, gestión de usuarios, estadísticas
```

### Docente (Ejemplo)
```
ID:     2
Nombre: Juan Pérez
Email:  jperez@universidad.edu
PIN:    5678
Rol:    TEACHER
Acceso: Crear cursos, registrar asistencia, justificaciones
```

---

## Flujo de Login

1. **Abre navegador:** http://localhost:4200/login
2. **Selecciona usuario:** Administrador o Juan Pérez
3. **Ingresa PIN:**
   - Admin: `0000`
   - Docente: `5678`
4. **Redirige automáticamente** al dashboard según rol

---

## Configuración del Backend

### Variables de Entorno (`backend/.env`)
```env
# Server
SERVER_PORT=3001

# JWT
JWT_SECRET=MiClaveSecretaMuyLargaParaJWTQueDebeSerDe256BitsOmas12345678901234567890
JWT_EXPIRATION=86400000

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:4200,http://127.0.0.1:4200

# Admin Seed
ADMIN_EMAIL=admin@universidad.edu
ADMIN_PIN=0000

# Datasource (H2)
SPRING_DATASOURCE_URL=jdbc:h2:mem:attendancedb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
SPRING_DATASOURCE_DRIVER=org.h2.Driver
SPRING_DATASOURCE_USERNAME=sa
SPRING_DATASOURCE_PASSWORD=

# Spring Profile
SPRING_PROFILES_ACTIVE=dev
```

---

## Endpoints Disponibles

### Públicos (Sin Autenticación)
```
POST   /api/auth/login        - Login (userId, pin)
GET    /api/users             - Listar usuarios activos
GET    /api/users/{id}        - Obtener usuario por ID
```

### Autenticados (Requieren JWT)
```
GET    /api/auth/me           - Usuario actual
GET    /api/courses           - Mis cursos
POST   /api/courses           - Crear curso
GET    /api/courses/{id}      - Detalle del curso
POST   /api/courses/{id}/students  - Agregar estudiante
POST   /api/courses/{id}/sessions  - Crear sesión
PUT    /api/courses/{id}/attendance/{studentId}/{sessionId}  - Registrar asistencia
```

### Admin Only
```
GET    /api/admin/stats       - Estadísticas del sistema
GET    /api/admin/users       - Listar todos los usuarios
```

---

## Header de Autenticación

Para llamadas autenticadas, incluir:
```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json; charset=utf-8
```

---

## Test Rápido (PowerShell)

### Login
```powershell
$headers = @{"Content-Type"="application/json"}
$body = @{userId=1; pin="0000"} | ConvertTo-Json
$response = Invoke-WebRequest -Uri "http://localhost:3001/api/auth/login" -Method POST -Headers $headers -Body $body -UseBasicParsing
$response.Content | ConvertFrom-Json | Format-List
```

### Obtener Usuario Autenticado
```powershell
$token = "YOUR_JWT_TOKEN_HERE"
$headers = @{"Authorization"="Bearer $token"}
$response = Invoke-WebRequest -Uri "http://localhost:3001/api/auth/me" -Method GET -Headers $headers -UseBasicParsing
$response.Content | ConvertFrom-Json | Format-List
```

### Crear Curso
```powershell
$token = "YOUR_JWT_TOKEN_HERE"
$headers = @{"Content-Type"="application/json; charset=utf-8"; "Authorization"="Bearer $token"}
$course = @{
  name="Mathematics I"
  code="MAT101"
  sec="01"
  sem="2024-I"
  credits=4
  minatt=80
  color=1
  icon=1
  desc="Calculus course"
} | ConvertTo-Json
$response = Invoke-WebRequest -Uri "http://localhost:3001/api/courses" -Method POST -Headers $headers -Body $course -UseBasicParsing
$response.Content | ConvertFrom-Json | Format-List
```

---

## Cambios Recientes (Fixes)

✓ **AuthController**: PIN ahora usa `PasswordEncoder.matches()` (BCrypt)  
✓ **UserController**: Nuevo endpoint público `/api/users`  
✓ **SecurityConfig**: Permite `/api/users` sin autenticación  
✓ **DataInitializer**: PIN del admin hasheado con BCrypt en seed  

---

## Notas Importantes

- Los PINs son **hasheados con BCrypt** en la base de datos
- Los tokens JWT **expiran en 24 horas** (configurable vía `JWT_EXPIRATION`)
- Para cambiar credenciales del admin, editar `ADMIN_PIN` en `.env`
- Para producción: cambiar `JWT_SECRET` a valor largo y seguro
- BD desarrollo usa **H2 en memoria** (se reinicia con cada restart)
- Para caracteres especiales en payloads, usar header: `Content-Type: application/json; charset=utf-8`

---

## Troubleshooting

### "Credenciales incorrectas"
- Verificar PIN correcto (admin: 0000, docente: 5678)
- Reiniciar backend después de cambios en AuthController
- Limpiar localStorage del navegador: `localStorage.clear()`

### Login no carga usuarios
- Verificar endpoint `/api/users` devuelve usuarios activos
- Revisar CORS en `application.properties`
- Verificar `proxy.conf.json` redirige `/api` a `3001`

### Curso no se crea
- Incluir header: `Content-Type: application/json; charset=utf-8`
- Verificar token JWT válido en Authorization header
- Revisar logs backend por errores



