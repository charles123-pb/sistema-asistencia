# Sistema de Asistencia - Backend + Frontend

Aplicación de asistencia universitaria con backend Spring Boot y frontend Angular.

## Arquitectura

- **Backend:** Spring Boot 3.x (Java), REST API, JWT authentication, H2/PostgreSQL
- **Frontend:** Angular 21.x, standalone components, Tailwind CSS, Material Design
- **Comunicación:** CORS configurado, API proxy en desarrollo

## Requisitos

- **Backend:** Java 17+, Maven 3.8+
- **Frontend:** Node.js 18+, npm 9+
- **Base de datos:** H2 (dev) o PostgreSQL (producción)

## Configuración Rápida (Desarrollo)

### 1. Clonar repositorio
```bash
git clone <tu-repo>
cd sistema-asistencia-main
```

### 2. Backend - Configurar variables de entorno

Copia `.env.example` → `.env` en la carpeta `backend/`:
```bash
cp backend/.env.example backend/.env
```

Contenido de `backend/.env` (ejemplo de desarrollo):
```env
SERVER_PORT=3001
SPRING_DATASOURCE_URL=jdbc:h2:mem:attendancedb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
SPRING_DATASOURCE_DRIVER=org.h2.Driver
SPRING_DATASOURCE_USERNAME=sa
SPRING_DATASOURCE_PASSWORD=

JWT_SECRET=MiClaveSecretaMuyLargaParaJWTQueDebeSerDe256BitsOmas12345678901234567890
JWT_EXPIRATION=86400000

CORS_ALLOWED_ORIGINS=http://localhost:4200,http://127.0.0.1:4200

ADMIN_EMAIL=admin@universidad.edu
ADMIN_PIN=0000

SPRING_PROFILES_ACTIVE=dev
```

### 3. Backend - Arrancar servidor

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

El backend estará disponible en: **http://localhost:3001**

### 4. Frontend - Instalar dependencias

```bash
cd ../fronted
npm install
```

### 5. Frontend - Arrancar servidor con proxy

```bash
npm run start:proxy
```

El frontend estará disponible en: **http://localhost:4200**

## Flujo de Login

1. Accede a **http://localhost:4200/login**
2. Selecciona usuario (Admin o Docente)
3. Ingresa PIN:
   - **Admin:** `0000`
   - **Docente:** (según datos seed)

## Prueba de Conectividad

### Test Backend (Terminal/PowerShell)

Prueba el endpoint `/api/auth/login`:
```powershell
$headers = @{"Content-Type"="application/json"}
$body = @{userId=1; pin="0000"} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:3001/api/auth/login" -Method POST -Headers $headers -Body $body
```

**Respuesta esperada:** Token JWT + datos del usuario (HTTP 200)

### Test Frontend

El componente `LoginComponent` ya está configurado para comunicarse con el backend mediante `AuthServiceBackend` y `ApiService`.

## Estructura de Carpetas

```
sistema-asistencia-main/
├── backend/
│   ├── src/main/java/com/attendance/
│   │   ├── config/       # Configuración (CORS, Security, Data Init)
│   │   ├── controller/   # Endpoints REST (Auth, Courses, Admin)
│   │   ├── entity/       # Modelos JPA (User, Course, etc.)
│   │   ├── repository/   # Spring Data JPA
│   │   ├── security/     # JWT, Auth filters
│   │   └── service/      # Lógica de negocio
│   ├── resources/
│   │   └── application.properties  # Configuración del servidor
│   ├── .env.example      # Variables de entorno de ejemplo
│   └── pom.xml          # Dependencias Maven
│
├── fronted/
│   ├── src/app/
│   │   ├── core/
│   │   │   ├── config/         # environment.ts
│   │   │   ├── guards/         # Auth guard
│   │   │   ├── interceptors/   # API interceptor (JWT)
│   │   │   ├── models/         # Interfaces TypeScript
│   │   │   └── services/       # Auth, API, Data
│   │   ├── features/           # Componentes por módulo
│   │   └── shared/             # Componentes reutilizables
│   ├── .env.example            # Variables de entorno frontend
│   ├── proxy.conf.json         # Proxy para /api en desarrollo
│   └── package.json            # Dependencias npm
```

## Endpoints Principales

### Auth
- `POST /api/auth/login` - Autenticación (userId, pin)
- `GET /api/auth/me` - Usuario actual (requiere JWT)

### Courses
- `GET /api/courses` - Listar cursos
- `POST /api/courses` - Crear curso
- `GET /api/courses/{id}` - Detalle del curso
- `GET /api/courses/{id}/students` - Estudiantes del curso
- `POST /api/courses/{id}/sessions` - Crear sesión

### Sessions (Asistencia)
- `POST /api/courses/{id}/sessions` - Nueva sesión
- `GET /api/courses/{id}/attendance` - Asistencia registrada

## Configuración Producción

### Backend - PostgreSQL

En `backend/application.properties` (o `.env`), descomentar y configurar:
```properties
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/attendancedb
SPRING_DATASOURCE_DRIVER=org.postgresql.Driver
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=TuPasswordSegura
CORS_ALLOWED_ORIGINS=https://tudominio.com
JWT_SECRET=GenerarUnSecretoMuyLargoYSeguro_MinimoDe256Bits
```

### Frontend - Build

```bash
cd fronted
npm run build
```

Archivos generados en `fronted/dist/` — servir con Nginx o similar.

### Reverse Proxy (Nginx)

Ejemplo para servir frontend + proxy API:
```nginx
upstream backend {
  server localhost:3001;
}

server {
  listen 443 ssl http2;
  server_name api.tudominio.com;

  ssl_certificate /path/to/cert.pem;
  ssl_certificate_key /path/to/key.pem;

  # Frontend
  root /var/www/html/frontend/dist;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  # API proxy
  location /api/ {
    proxy_pass http://backend;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

## Variables de Entorno Completas

### Backend
- `SERVER_PORT` - Puerto del servidor (default: 3001)
- `JWT_SECRET` - Clave para firmar tokens JWT
- `JWT_EXPIRATION` - Expiración de tokens (ms)
- `CORS_ALLOWED_ORIGINS` - Orígenes permitidos (comma-separated)
- `SPRING_DATASOURCE_*` - Configuración de BD
- `ADMIN_EMAIL` - Email del usuario admin seed
- `ADMIN_PIN` - PIN del usuario admin seed

### Frontend
Editar `src/app/core/config/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3001/api',  // Para requests directos (sin proxy)
  apiTimeout: 30000,
  endpoints: { /* ... */ }
};
```

## Troubleshooting

### El frontend no puede conectar al backend
1. Verifica que el backend está levantado: `http://localhost:3001/h2-console`
2. Revisa logs del backend por errores CORS
3. Verifica `cors.allowed-origins` en `application.properties`
4. Prueba manualmente el endpoint con curl/PowerShell

### CORS preflight (OPTIONS) falla
- Backend debe permitir `OPTIONS` en rutas públicas (ya configurado en `SecurityConfig`)
- Verifica headers: `Vary`, `Access-Control-Allow-Origin`

### JWT token inválido o expirado
- Verifica que `JWT_SECRET` es el mismo en seed y login
- Revisa `JWT_EXPIRATION` (default: 24 horas)
- Limpia localStorage en el navegador: `localStorage.clear()`

### H2 Console no se carga
- Verifica `spring.h2.console.enabled=true` en `application.properties`
- Accede a: **http://localhost:3001/h2-console**

## Scripts Útiles

### Backend - Build y run
```bash
cd backend
mvn clean package
java -jar target/attendance-backend-*.jar
```

### Frontend - Development
```bash
cd fronted
npm start          # sin proxy
npm run start:proxy # con proxy a /api
npm run build      # build production
npm run test       # tests unitarios
```

## Seguridad

- ⚠️ Cambiar `JWT_SECRET` en producción (generar uno fuerte)
- ⚠️ Habilitar HTTPS/TLS en producción
- ⚠️ Usar variables de entorno reales (nunca en código)
- ⚠️ Restringir CORS a dominios concretos
- ⚠️ Hash BCrypt para PINs/passwords (ya en `DataInitializer`)

## Licencia

Proyecto académico © 2026

---

**Preguntas o issues?** Revisa los logs del backend (`mvn spring-boot:run`) y consola del navegador (F12).
