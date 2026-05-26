import mongoose from 'mongoose';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createApp } from '../src/app.js';
import { User } from '../src/models/User.js';

const app = createApp();

const assertStatus = (res, status, label) => {
  if (res.status !== status) {
    throw new Error(`${label} failed. Expected ${status}, got ${res.status}. Body: ${JSON.stringify(res.body)}`);
  }
};

const assertTruthy = (value, label) => {
  if (!value) throw new Error(`${label} failed`);
};

const run = async () => {
  process.env.JWT_SECRET = 'smoke-test-secret';
  process.env.JWT_EXPIRES_IN = '7d';
  process.env.NODE_ENV = 'test';

  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  try {
    await mongoose.connect(uri);

    await User.create({
      name: 'Super Admin',
      email: 'super@graven.test',
      password: 'Password123',
      role: 'super_admin',
    });

    await User.create({
      name: 'Admin User',
      email: 'admin@graven.test',
      password: 'Password123',
      role: 'admin',
    });

    const superLogin = await request(app)
      .post('/api/auth/login/super-admin')
      .send({ email: 'super@graven.test', password: 'Password123' });
    assertStatus(superLogin, 200, 'super-admin login');
    const superToken = superLogin.body?.token;
    assertTruthy(superToken, 'super-admin token');

    const adminLogin = await request(app)
      .post('/api/auth/login/admin')
      .send({ email: 'admin@graven.test', password: 'Password123' });
    assertStatus(adminLogin, 200, 'admin login');
    const adminToken = adminLogin.body?.token;
    assertTruthy(adminToken, 'admin token');

    const categoryCreate = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Gold', slug: 'gold', description: 'Gold category' });
    assertStatus(categoryCreate, 201, 'category create');
    const categoryId = categoryCreate.body?._id;
    assertTruthy(categoryId, 'category id');

    const productCreate = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Gold Bar',
        slug: 'gold-bar',
        description: '24K gold bar',
        category: categoryId,
        price: 6054,
        stockQty: 25,
      });
    assertStatus(productCreate, 201, 'product create');
    const productId = productCreate.body?._id;
    assertTruthy(productId, 'product id');

    const blogCreate = await request(app)
      .post('/api/blogs')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Gold Markets Update',
        slug: 'gold-markets-update',
        excerpt: 'Gold has shown strong movement.',
        content: 'Detailed content for market update.',
      });
    assertStatus(blogCreate, 201, 'blog create');
    const blogId = blogCreate.body?._id;
    assertTruthy(blogId, 'blog id');

    const productsList = await request(app).get('/api/products');
    assertStatus(productsList, 200, 'products list');
    assertTruthy(Array.isArray(productsList.body) && productsList.body.length >= 1, 'products list data');

    const categoriesList = await request(app).get('/api/categories');
    assertStatus(categoriesList, 200, 'categories list');

    const blogsList = await request(app).get('/api/blogs');
    assertStatus(blogsList, 200, 'blogs list');

    const quoteCreate = await request(app)
      .post('/api/quotes')
      .field('fullName', 'Client A')
      .field('email', 'clienta@test.com')
      .field('phone', '+1234567890')
      .field('metal', 'Gold')
      .field('quantity', '10 Kg')
      .field('requirement', 'Need immediate supply');
    assertStatus(quoteCreate, 201, 'quote create');
    const quoteId = quoteCreate.body?.data?._id;
    assertTruthy(quoteId, 'quote id');

    const contactCreate = await request(app)
      .post('/api/contacts')
      .send({
        fullName: 'Client B',
        email: 'clientb@test.com',
        phone: '+1234567891',
        subject: 'Bulk order',
        message: 'Please contact for bulk order.',
      });
    assertStatus(contactCreate, 201, 'contact create');
    const contactId = contactCreate.body?.data?._id;
    assertTruthy(contactId, 'contact id');

    const quotesList = await request(app)
      .get('/api/quotes')
      .set('Authorization', `Bearer ${adminToken}`);
    assertStatus(quotesList, 200, 'quotes list');

    const contactsList = await request(app)
      .get('/api/contacts')
      .set('Authorization', `Bearer ${adminToken}`);
    assertStatus(contactsList, 200, 'contacts list');

    const quoteStatus = await request(app)
      .patch(`/api/quotes/${quoteId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'in_review', note: 'Checked' });
    assertStatus(quoteStatus, 200, 'quote status update');

    const contactStatus = await request(app)
      .put(`/api/contacts/${contactId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'read' });
    assertStatus(contactStatus, 200, 'contact status update');

    const createAdmin = await request(app)
      .post('/api/super-admin/admins')
      .set('Authorization', `Bearer ${superToken}`)
      .send({
        name: 'Editor One',
        email: 'editor1@graven.test',
        password: 'Password123',
        role: 'editor',
      });
    assertStatus(createAdmin, 201, 'super admin create admin');
    const createdAdminId = createAdmin.body?.id;
    assertTruthy(createdAdminId, 'created admin id');

    const assignPermissions = await request(app)
      .patch(`/api/super-admin/admins/${createdAdminId}/permissions`)
      .set('Authorization', `Bearer ${superToken}`)
      .send({ permissions: ['manage_products', 'manage_blogs'], role: 'editor' });
    assertStatus(assignPermissions, 200, 'assign permissions');

    const analytics = await request(app)
      .get('/api/super-admin/analytics')
      .set('Authorization', `Bearer ${superToken}`);
    assertStatus(analytics, 200, 'analytics fetch');

    const settingsUpdate = await request(app)
      .patch('/api/super-admin/settings')
      .set('Authorization', `Bearer ${superToken}`)
      .send({ siteName: 'GRAVEN METAL', supportEmail: 'support@graven.test', maintenanceMode: false });
    assertStatus(settingsUpdate, 200, 'settings update');

    const seoUpdate = await request(app)
      .patch('/api/super-admin/seo')
      .set('Authorization', `Bearer ${superToken}`)
      .send({
        metaTitle: 'GRAVEN METAL',
        metaDescription: 'Premium metal trading',
        keywords: ['metal', 'gold'],
      });
    assertStatus(seoUpdate, 200, 'seo update');

    const backup = await request(app)
      .post('/api/super-admin/backup')
      .set('Authorization', `Bearer ${superToken}`);
    assertStatus(backup, 200, 'database backup');

    const productDelete = await request(app)
      .delete(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    assertStatus(productDelete, 200, 'product delete');

    const categoryDelete = await request(app)
      .delete(`/api/categories/${categoryId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    assertStatus(categoryDelete, 200, 'category delete');

    const blogDelete = await request(app)
      .delete(`/api/blogs/${blogId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    assertStatus(blogDelete, 200, 'blog delete');

    const deleteAdmin = await request(app)
      .delete(`/api/super-admin/admins/${createdAdminId}`)
      .set('Authorization', `Bearer ${superToken}`);
    assertStatus(deleteAdmin, 200, 'delete created admin');

    console.log('SMOKE TEST PASSED: auth, CRUD, quote/contact, admin/super-admin flows are working.');
  } finally {
    await mongoose.disconnect();
    await mongod.stop();
  }
};

run().catch((error) => {
  console.error('SMOKE TEST FAILED:', error.message);
  if (error?.stack) {
    console.error(error.stack);
  }
  process.exit(1);
});
