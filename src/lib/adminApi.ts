import { axiosClient } from './axiosClient';
import type { ApiBlog, ApiCategory, ApiProduct } from './publicApi';

type Wrapped<T> = { success: boolean; message: string; data: T };

export type ApiQuote = {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  metal: string;
  quantity: string;
  status: 'new' | 'in_review' | 'quoted' | 'closed';
};

export type ApiContact = {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
};

type ProductPayload = {
  name: string;
  slug: string;
  description?: string;
  category: string;
  price: number;
  currency?: string;
  unit?: string;
  stockQty?: number;
  file?: File | null;
};

type CategoryPayload = { name: string; slug: string; description?: string };
type BlogPayload = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  file?: File | null;
};

export const adminApi = {
  async getProducts() {
    const res = await axiosClient.get<ApiProduct[]>('/products');
    return res.data;
  },
  async createProduct(payload: ProductPayload) {
    const fd = new FormData();
    fd.append('name', payload.name);
    fd.append('slug', payload.slug);
    fd.append('description', payload.description || '');
    fd.append('category', payload.category);
    fd.append('price', String(payload.price));
    fd.append('currency', payload.currency || 'USD');
    fd.append('unit', payload.unit || 'kg');
    fd.append('stockQty', String(payload.stockQty ?? 0));
    if (payload.file) fd.append('image', payload.file);
    const res = await axiosClient.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data;
  },
  async deleteProduct(id: string) {
    const res = await axiosClient.delete(`/products/${id}`);
    return res.data;
  },

  async getCategories() {
    const res = await axiosClient.get<ApiCategory[]>('/categories');
    return res.data;
  },
  async createCategory(payload: CategoryPayload) {
    const res = await axiosClient.post('/categories', payload);
    return res.data;
  },
  async deleteCategory(id: string) {
    const res = await axiosClient.delete(`/categories/${id}`);
    return res.data;
  },

  async getBlogs() {
    const res = await axiosClient.get<ApiBlog[]>('/blogs?published=all');
    return res.data;
  },
  async createBlog(payload: BlogPayload) {
    const fd = new FormData();
    fd.append('title', payload.title);
    fd.append('slug', payload.slug);
    fd.append('excerpt', payload.excerpt);
    fd.append('content', payload.content);
    if (payload.coverImage) fd.append('coverImage', payload.coverImage);
    if (payload.file) fd.append('thumbnail', payload.file);
    const res = await axiosClient.post('/blogs', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data;
  },
  async deleteBlog(id: string) {
    const res = await axiosClient.delete(`/blogs/${id}`);
    return res.data;
  },

  async getQuotes() {
    const res = await axiosClient.get<Wrapped<ApiQuote[]>>('/quotes');
    return res.data.data;
  },
  async updateQuoteStatus(id: string, status: string) {
    const res = await axiosClient.patch<Wrapped<ApiQuote>>(`/quotes/${id}/status`, { status });
    return res.data.data;
  },

  async getContacts() {
    const res = await axiosClient.get<Wrapped<{ items: ApiContact[] }>>('/contacts');
    return res.data.data.items;
  },
  async updateContactStatus(id: string, status: ApiContact['status']) {
    const res = await axiosClient.put<Wrapped<ApiContact>>(`/contacts/${id}`, { status });
    return res.data.data;
  },
};
