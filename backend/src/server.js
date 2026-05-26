import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { createApp } from './app.js';
import { closeDB, connectDB } from './config/db.js';
import { ensureDevUsers } from './config/devBootstrap.js';
import { validateEnv } from './config/env.js';

const envCandidates = [path.join('backend', '.env'), '.env'];
const envPath = envCandidates.find((candidate) => fs.existsSync(path.resolve(process.cwd(), candidate)));
dotenv.config(envPath ? { path: envPath } : undefined);
validateEnv();

const app = createApp();
const PORT = process.env.PORT || 5000;

await connectDB();
await ensureDevUsers();

const server = app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});

let isShuttingDown = false;
const shutdown = (signal) => {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log(`Received ${signal}. Starting graceful shutdown...`);

  server.close(async () => {
    try {
      await closeDB();
    } catch (error) {
      console.error('Error closing MongoDB connection:', error.message);
    } finally {
      process.exit(0);
    }
  });

  setTimeout(() => {
    console.error('Force closing after graceful shutdown timeout');
    process.exit(1);
  }, 10000).unref();
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error.message);
  process.exit(1);
});
