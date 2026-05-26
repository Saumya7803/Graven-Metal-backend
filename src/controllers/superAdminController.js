import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { Quote } from '../models/Quote.js';
import { Contact } from '../models/Contact.js';
import { Blog } from '../models/Blog.js';
import { SiteSettings } from '../models/SiteSettings.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ROLE_DEFAULT_PERMISSIONS } from '../constants/permissions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BACKUP_DIR = path.resolve(__dirname, '../../backups');

export const createAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, role = 'admin', permissions } = req.body;
  if (!['admin', 'editor'].includes(role)) {
    return res.status(400).json({ message: 'Role must be admin or editor' });
  }

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already exists' });

  const user = await User.create({
    name,
    email,
    password,
    role,
    permissions: permissions?.length ? permissions : ROLE_DEFAULT_PERMISSIONS[role],
  });

  res.status(201).json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    permissions: user.permissions,
  });
});

export const deleteAdmin = asyncHandler(async (req, res) => {
  const admin = await User.findById(req.params.id);
  if (!admin) return res.status(404).json({ message: 'Admin not found' });
  if (admin.role === 'super_admin') return res.status(400).json({ message: 'Cannot delete super admin' });
  if (!['admin', 'editor'].includes(admin.role)) return res.status(400).json({ message: 'Target user is not admin/editor' });

  await admin.deleteOne();
  res.json({ message: 'Admin deleted' });
});

export const assignPermissions = asyncHandler(async (req, res) => {
  const { permissions = [], role } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.role === 'super_admin') return res.status(400).json({ message: 'Super admin permissions are fixed' });

  if (role && ['admin', 'editor', 'user'].includes(role)) user.role = role;
  user.permissions = permissions;
  await user.save();

  res.json({ id: user._id, role: user.role, permissions: user.permissions });
});

export const listAdmins = asyncHandler(async (req, res) => {
  const admins = await User.find({ role: { $in: ['admin', 'editor'] } }).select('-password').sort({ createdAt: -1 });
  res.json(admins);
});

export const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.role === 'super_admin' && req.user._id.toString() !== user._id.toString()) {
    return res.status(403).json({ message: 'Cannot modify another super admin' });
  }

  const { name, role, permissions } = req.body;
  if (name) user.name = name;
  if (role && ['admin', 'editor', 'user'].includes(role)) user.role = role;
  if (permissions) user.permissions = permissions;

  await user.save();
  res.json({ id: user._id, name: user.name, role: user.role, permissions: user.permissions });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.role === 'super_admin') return res.status(400).json({ message: 'Cannot delete super admin' });
  await user.deleteOne();
  res.json({ message: 'User deleted' });
});

export const getSettings = asyncHandler(async (req, res) => {
  let settings = await SiteSettings.findOne();
  if (!settings) settings = await SiteSettings.create({});
  res.json(settings);
});

export const updateSettings = asyncHandler(async (req, res) => {
  let settings = await SiteSettings.findOne();
  if (!settings) settings = await SiteSettings.create({});

  Object.assign(settings, req.body);
  await settings.save();
  res.json(settings);
});

export const getSEO = asyncHandler(async (req, res) => {
  let settings = await SiteSettings.findOne();
  if (!settings) settings = await SiteSettings.create({});
  res.json(settings.seo);
});

export const updateSEO = asyncHandler(async (req, res) => {
  let settings = await SiteSettings.findOne();
  if (!settings) settings = await SiteSettings.create({});
  settings.seo = { ...settings.seo?.toObject?.(), ...req.body };
  await settings.save();
  res.json(settings.seo);
});

export const getAnalytics = asyncHandler(async (req, res) => {
  const [users, products, categories, blogs, quotes, contacts] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Category.countDocuments(),
    Blog.countDocuments(),
    Quote.countDocuments(),
    Contact.countDocuments(),
  ]);

  const quoteByStatus = await Quote.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);

  res.json({
    totals: { users, products, categories, blogs, quotes, contacts },
    quoteByStatus,
  });
});

export const backupDatabase = asyncHandler(async (req, res) => {
  const [users, products, categories, blogs, quotes, contacts, settings] = await Promise.all([
    User.find().select('-password'),
    Product.find(),
    Category.find(),
    Blog.find(),
    Quote.find(),
    Contact.find(),
    SiteSettings.find(),
  ]);

  const snapshot = {
    generatedAt: new Date().toISOString(),
    collections: { users, products, categories, blogs, quotes, contacts, settings },
  };

  await fs.mkdir(BACKUP_DIR, { recursive: true });
  const fileName = `backup-${Date.now()}.json`;
  const filePath = path.join(BACKUP_DIR, fileName);
  await fs.writeFile(filePath, JSON.stringify(snapshot, null, 2));

  res.json({ message: 'Backup created', fileName, filePath });
});
