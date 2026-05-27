import { Quote } from '../models/Quote.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { removeFromCloudinary, uploadBufferToCloudinary } from '../utils/cloudinaryUpload.js';

const ok = (res, message, data, status = 200) => res.status(status).json({ success: true, message, data });

const attachmentMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jpg',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
];

export const createQuote = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (req.user?.role === 'user') {
    payload.customer = req.user._id;
    payload.fullName = payload.fullName || req.user.name;
    payload.email = payload.email || req.user.email;
    payload.phone = payload.phone || req.user.phone;
  }

  const uploadedFile = await uploadBufferToCloudinary(req.file, {
    folder: 'graven-metal/quotes',
    resourceType: 'auto',
    allowedMime: attachmentMimeTypes,
  });

  if (uploadedFile) payload.file = uploadedFile;

  const quote = await Quote.create(payload);
  return ok(res, 'Quote request submitted successfully', quote, 201);
});

export const getQuotes = asyncHandler(async (req, res) => {
  const { status, q } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (q) {
    filter.$or = [
      { fullName: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } },
      { metal: { $regex: q, $options: 'i' } },
    ];
  }

  const quotes = await Quote.find(filter).sort({ createdAt: -1 });
  return ok(res, 'Quotes fetched', quotes);
});

export const getMyQuotes = asyncHandler(async (req, res) => {
  const quotes = await Quote.find({
    $or: [{ customer: req.user._id }, { email: req.user.email }],
  }).sort({ createdAt: -1 });

  return ok(res, 'Customer quotes fetched', quotes);
});

export const getQuoteById = asyncHandler(async (req, res) => {
  const quote = await Quote.findById(req.params.id);
  if (!quote) return res.status(404).json({ success: false, message: 'Quote not found' });
  return ok(res, 'Quote fetched', quote);
});

export const updateQuote = asyncHandler(async (req, res) => {
  const quote = await Quote.findById(req.params.id);
  if (!quote) return res.status(404).json({ success: false, message: 'Quote not found' });

  const payload = { ...req.body };
  const uploadedFile = await uploadBufferToCloudinary(req.file, {
    folder: 'graven-metal/quotes',
    resourceType: 'auto',
    allowedMime: attachmentMimeTypes,
  });

  if (uploadedFile) {
    if (quote.file?.publicId) {
      await removeFromCloudinary(quote.file.publicId, 'auto');
    }
    payload.file = uploadedFile;
  }

  Object.assign(quote, payload);
  await quote.save();

  return ok(res, 'Quote updated', quote);
});

export const updateQuoteStatus = asyncHandler(async (req, res) => {
  const { status, note = '' } = req.body;
  const quote = await Quote.findById(req.params.id);

  if (!quote) return res.status(404).json({ success: false, message: 'Quote not found' });

  quote.status = status;
  quote.statusHistory.push({
    status,
    note,
    changedBy: req.user?._id,
    changedAt: new Date(),
  });

  await quote.save();
  return ok(res, 'Quote status updated', quote);
});

export const deleteQuote = asyncHandler(async (req, res) => {
  const quote = await Quote.findById(req.params.id);
  if (!quote) return res.status(404).json({ success: false, message: 'Quote not found' });

  if (quote.file?.publicId) {
    await removeFromCloudinary(quote.file.publicId, 'auto');
  }

  await quote.deleteOne();
  return ok(res, 'Quote deleted', null);
});
