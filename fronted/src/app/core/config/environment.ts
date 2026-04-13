/**
 * Desarrollo: URL absoluta del API. Angular 21 + `ng serve` usa Vite y el proxy
 * `proxy.conf.*` no reenvía las peticiones como antes; sin esto, `/api` pegaba al :4200 y fallaba.
 *
 * Mismo puerto que `server.port` en backend/application.properties (por defecto 3001).
 */
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3001/api',
  apiTimeout: 30000,

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
