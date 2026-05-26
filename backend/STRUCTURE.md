# Backend Structure

This backend uses a scalable structure:

- `server.js` (root entry)
- `src/server.js` (runtime bootstrap)
- `src/app.js` (Express app setup)
- `src/config/` (DB and config)
- `src/routes/` (API modules)
- `src/controllers/` (request handlers)
- `src/models/` (Mongoose schemas)
- `src/middlewares/` (active middleware implementations)
- `src/middleware/` (alias export layer)
- `src/utils/` (helpers)
- `src/constants/` (permissions/constants)

Env setup:
- Copy `.env.example` to `.env`
- Start with `npm run dev:server`
