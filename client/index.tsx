import helmet from 'helmet';

const API_URL = process.env.API_URL || 'http://localhost:3000';

const policy = `
  default-src 'self';
  script-src 'self' 'wasm-unsafe-eval';
  connect-src 'self' ${API_URL};
  style-src 'self' 'unsafe-inline';
  img-src 'self' data:;
`.replace(/\n/g, '');

if (process.env.NODE_ENV === 'production') {
  helmet.contentSecurityPolicy({ directives: { policy } });
}