import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import apiRoutes from './routes/index.js';
import { errorHandler } from './middlewares/errorMiddleware.js';
import { sanitizeInput } from './middlewares/securityMiddleware.js';

export const createApp = () => {
  const app = express();
  const isProduction = process.env.NODE_ENV === 'production';
  const normalizeOrigin = (value) => value.replace(/\/+$/, '');
  const rawOrigins = process.env.CLIENT_URLS || process.env.CLIENT_URL || '';
  const configuredOrigins = rawOrigins
    .split(',')
    .map((x) => x.trim())
    .map((x) => normalizeOrigin(x))
    .filter(Boolean);
  const devOrigins = ['http://localhost:5173', 'http://localhost:5174'];
  const allowList = Array.from(new Set(isProduction ? configuredOrigins : [...configuredOrigins, ...devOrigins]));
  const isLocalDevOrigin = (origin) => {
    try {
      const { hostname, port, protocol } = new URL(origin);
      return (
        !isProduction &&
        protocol === 'http:' &&
        ['localhost', '127.0.0.1', '::1'].includes(hostname) &&
        Number(port) >= 5173 &&
        Number(port) <= 5199
      );
    } catch {
      return false;
    }
  };

  const corsOptions = {
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      // In development/tests allow local tools without strict origin matching.
      if (!isProduction && allowList.length === 0) return callback(null, true);
      if (allowList.includes(normalizeOrigin(origin))) return callback(null, true);
      if (isLocalDevOrigin(origin)) return callback(null, true);

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      referrerPolicy: { policy: 'no-referrer' },
      contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
    })
  );
  app.use(cors(corsOptions));
  app.set('trust proxy', 1);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(sanitizeInput);
  app.use(morgan(isProduction ? 'combined' : 'dev'));

  app.get('/api', (req, res) => {
    res.json({
      ok: true,
      service: 'graven-api',
      endpoints: {
        health: '/api/health',
      },
    });
  });
  app.get('/api/health', (req, res) => res.json({ ok: true, service: 'graven-api' }));
  app.use('/api', apiRoutes);

  app.use((req, res) => res.status(404).json({ message: 'Route not found' }));
  app.use(errorHandler);

  return app;
};
