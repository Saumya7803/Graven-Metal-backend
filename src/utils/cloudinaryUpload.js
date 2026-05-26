import path from 'path';
import { cloudinary, ensureCloudinaryConfigured } from '../config/cloudinary.js';

const randomId = () => Math.random().toString(36).slice(2, 10);

const sanitizeBaseName = (name) =>
  (name || 'upload')
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);

export const uploadBufferToCloudinary = async (
  file,
  {
    folder,
    resourceType = 'auto',
    allowedMime = [],
  }
) => {
  if (!file) return null;
  ensureCloudinaryConfigured();

  if (allowedMime.length > 0 && !allowedMime.includes(file.mimetype)) {
    throw new Error(`Unsupported file type: ${file.mimetype}`);
  }

  const originalBase = sanitizeBaseName(path.parse(file.originalname).name);
  const publicId = `${Date.now()}-${randomId()}-${originalBase}`;

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: resourceType,
        overwrite: false,
        invalidate: true,
      },
      (err, uploaded) => {
        if (err) return reject(err);
        return resolve(uploaded);
      }
    );
    stream.end(file.buffer);
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    name: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
  };
};

export const removeFromCloudinary = async (publicId, resourceType = 'image') => {
  if (!publicId) return;
  ensureCloudinaryConfigured();
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType, invalidate: true }).catch(() => null);
};
