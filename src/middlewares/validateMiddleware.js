import { matchedData, validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }

  const data = matchedData(req, { locations: ['body'], includeOptionals: true });
  if (Object.keys(data).length > 0) {
    req.body = data;
  }

  next();
};
