import jwt from 'jsonwebtoken';

export const signToken = (payload) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is missing');
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    issuer: process.env.JWT_ISSUER || 'graven-metal-api',
    audience: process.env.JWT_AUDIENCE || 'graven-metal-client',
    algorithm: 'HS256',
  });
};
