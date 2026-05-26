import { User } from '../models/User.js';

const DEV_SUPER_ADMIN_EMAIL = process.env.DEV_SUPER_ADMIN_EMAIL || 'super@graven.local';
const DEV_SUPER_ADMIN_PASSWORD = process.env.DEV_SUPER_ADMIN_PASSWORD || 'Password123';
const DEV_ADMIN_EMAIL = process.env.DEV_ADMIN_EMAIL || 'admin@graven.local';
const DEV_ADMIN_PASSWORD = process.env.DEV_ADMIN_PASSWORD || 'Password123';

export const ensureDevUsers = async () => {
  if (process.env.NODE_ENV === 'production') return;
  if (process.env.DEV_BOOTSTRAP_USERS === 'false') return;

  const superExists = await User.findOne({ email: DEV_SUPER_ADMIN_EMAIL });
  if (!superExists) {
    await User.create({
      name: 'Local Super Admin',
      email: DEV_SUPER_ADMIN_EMAIL,
      password: DEV_SUPER_ADMIN_PASSWORD,
      role: 'super_admin',
    });
    console.log(`Created local super admin: ${DEV_SUPER_ADMIN_EMAIL}`);
  }

  const adminExists = await User.findOne({ email: DEV_ADMIN_EMAIL });
  if (!adminExists) {
    await User.create({
      name: 'Local Admin',
      email: DEV_ADMIN_EMAIL,
      password: DEV_ADMIN_PASSWORD,
      role: 'admin',
    });
    console.log(`Created local admin: ${DEV_ADMIN_EMAIL}`);
  }
};
