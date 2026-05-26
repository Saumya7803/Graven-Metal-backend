const REQUIRED_ENV = ['MONGODB_URI', 'JWT_SECRET', 'CLIENT_URLS', 'JWT_ISSUER', 'JWT_AUDIENCE'];

export function validateEnv() {
  if (process.env.NODE_ENV !== 'production') return;

  const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required production environment variables: ${missing.join(', ')}`);
  }
}
