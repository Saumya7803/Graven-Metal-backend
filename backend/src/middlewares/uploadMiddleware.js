import multer from 'multer';

const storage = multer.memoryStorage();

const imageMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
const attachmentMimeTypes = [
  ...imageMimeTypes,
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
];

const makeUploader = ({ maxMB, allowed }) =>
  multer({
    storage,
    limits: { fileSize: maxMB * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (!allowed.includes(file.mimetype)) {
        return cb(new Error(`Unsupported file type: ${file.mimetype}`));
      }
      return cb(null, true);
    },
  });

const hasSignature = (buffer, signature) => signature.every((byte, index) => buffer[index] === byte);

const IMAGE_SIGNATURES = [
  [0xff, 0xd8, 0xff],
  [0x89, 0x50, 0x4e, 0x47],
  [0x52, 0x49, 0x46, 0x46],
];

const PDF_SIGNATURE = [0x25, 0x50, 0x44, 0x46];

export const uploadImage = makeUploader({ maxMB: 5, allowed: imageMimeTypes });
export const uploadAttachment = makeUploader({ maxMB: 10, allowed: attachmentMimeTypes });

export const validateUploadedFile = (type = 'image') => (req, res, next) => {
  if (!req.file) return next();

  const buffer = req.file.buffer;
  if (!buffer || buffer.length < 4) {
    return res.status(400).json({ message: 'Uploaded file is invalid or corrupted' });
  }

  if (type === 'image') {
    const isImage = IMAGE_SIGNATURES.some((sig) => hasSignature(buffer, sig));
    if (!isImage) return res.status(400).json({ message: 'Invalid image file content' });
  }

  if (type === 'attachment' && req.file.mimetype === 'application/pdf') {
    if (!hasSignature(buffer, PDF_SIGNATURE)) {
      return res.status(400).json({ message: 'Invalid PDF file content' });
    }
  }

  next();
};
