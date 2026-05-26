const required = ['NODE_ENV', 'MONGODB_URI', 'JWT_SECRET', 'CLIENT_URLS', 'JWT_ISSUER', 'JWT_AUDIENCE'];
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`Missing required Render env vars: ${missing.join(', ')}`);
  process.exit(1);
}

if (process.env.NODE_ENV !== 'production') {
  console.error('NODE_ENV must be "production" on Render.');
  process.exit(1);
}

if (!process.env.MONGODB_URI.includes('mongodb+srv://')) {
  console.warn('Warning: MONGODB_URI is not using Atlas SRV format.');
}

console.log('Render environment validation passed.');
