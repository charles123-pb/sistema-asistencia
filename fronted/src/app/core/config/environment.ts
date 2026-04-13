/**
 * Configuración de ambiente para la aplicación
 * Cambiar la URL según el entorno (desarrollo, producción, etc.)
 */

export const environment = {
  production: false,
<<<<<<< HEAD
  apiUrl: 'http://localhost:3001/api',
=======
  apiUrl: 'http://localhost:3000/api',
>>>>>>> 19a6882794dac5f16f97657b3e0ff2dd323ec598
  apiTimeout: 30000, // 30 segundos
  
  // Endpoints específicos (opcional, para mayor control)
  endpoints: {
    auth: '/auth',
    users: '/users',
    courses: '/courses',
    students: '/students',
    sessions: '/sessions',
    attendance: '/attendance',
    justifications: '/justifications',
    admin: '/admin',
  }
};
