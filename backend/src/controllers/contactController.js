import { Contact } from '../models/Contact.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const ok = (res, message, data, status = 200) =>
  res.status(status).json({ success: true, message, data });

export const createContact = asyncHandler(async (req, res) => {
  const { fullName, email, phone, subject = '', message } = req.body;
  const contact = await Contact.create({
    fullName,
    email,
    phone,
    subject,
    message,
    status: 'unread',
  });

  return ok(res, 'Contact form submitted successfully', contact, 201);
});

export const getContacts = asyncHandler(async (req, res) => {
  const { status, q, page = 1, limit = 25 } = req.query;
  const filter = {};

  if (status) filter.status = status;
  if (q) {
    filter.$or = [
      { fullName: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } },
      { phone: { $regex: q, $options: 'i' } },
      { subject: { $regex: q, $options: 'i' } },
      { message: { $regex: q, $options: 'i' } },
    ];
  }

  const pageNumber = Math.max(Number(page) || 1, 1);
  const pageSize = Math.min(Math.max(Number(limit) || 25, 1), 100);
  const skip = (pageNumber - 1) * pageSize;

  const [contacts, total] = await Promise.all([
    Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(pageSize),
    Contact.countDocuments(filter),
  ]);

  return ok(res, 'Contacts fetched', {
    items: contacts,
    pagination: {
      page: pageNumber,
      limit: pageSize,
      total,
      pages: Math.ceil(total / pageSize) || 1,
    },
  });
});

export const getContactById = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
  return ok(res, 'Contact fetched', contact);
});

export const updateContact = asyncHandler(async (req, res) => {
  const { status, adminNotes } = req.body;
  const updates = {};

  if (status) {
    updates.status = status;
    if (status === 'replied') updates.repliedAt = new Date();
  }
  if (typeof adminNotes === 'string') updates.adminNotes = adminNotes;

  const contact = await Contact.findByIdAndUpdate(req.params.id, updates, {
    returnDocument: 'after',
    runValidators: true,
  });
  if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
  return ok(res, 'Contact updated', contact);
});

export const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);
  if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
  return ok(res, 'Contact deleted', null);
});
