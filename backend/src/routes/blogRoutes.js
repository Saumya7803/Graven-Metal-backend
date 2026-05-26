import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  createBlog,
  deleteBlog,
  getBlogById,
  getBlogBySlug,
  getBlogs,
  getLatestBlogs,
  updateBlog,
} from '../controllers/blogController.js';
import { authorize, authorizePermission, protect } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { PERMISSIONS } from '../constants/permissions.js';
import { uploadImage, validateUploadedFile } from '../middlewares/uploadMiddleware.js';

const router = Router();

router.get('/', getBlogs);
router.get('/latest', getLatestBlogs);
router.get('/slug/:slug', [param('slug').isSlug()], validate, getBlogBySlug);
router.get('/:id', [param('id').isMongoId()], validate, getBlogById);

router.post(
  '/',
  protect,
  authorize('super_admin', 'admin', 'editor'),
  authorizePermission(PERMISSIONS.MANAGE_BLOGS),
  uploadImage.single('thumbnail'),
  validateUploadedFile('image'),
  [
    body('title').trim().notEmpty().isLength({ max: 200 }),
    body('slug').trim().notEmpty().isSlug(),
    body('excerpt').trim().notEmpty().isLength({ max: 500 }),
    body('content').trim().notEmpty().isLength({ max: 50000 }),
  ],
  validate,
  createBlog,
);

router.put(
  '/:id',
  protect,
  authorize('super_admin', 'admin', 'editor'),
  authorizePermission(PERMISSIONS.MANAGE_BLOGS),
  [param('id').isMongoId()],
  validate,
  uploadImage.single('thumbnail'),
  validateUploadedFile('image'),
  updateBlog,
);

router.delete(
  '/:id',
  protect,
  authorize('super_admin', 'admin'),
  authorizePermission(PERMISSIONS.MANAGE_BLOGS),
  [param('id').isMongoId()],
  validate,
  deleteBlog,
);

export default router;
