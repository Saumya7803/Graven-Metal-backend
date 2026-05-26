import { useEffect, useMemo, useState } from 'react';
import { Menu, Plus, ShieldCheck, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { adminApi, type ApiContact, type ApiQuote } from '../lib/adminApi';
import { clearAuth, getAuthUser } from '../lib/auth';
import { LoadingOverlay } from '../components/ui/LoadingOverlay';
import { SEO } from '../components/seo/SEO';
import type { ApiBlog, ApiCategory, ApiProduct } from '../lib/publicApi';

type Section = 'dashboard' | 'products' | 'categories' | 'blogs' | 'quotes' | 'contacts';
type AdminModal = 'product' | 'category' | 'blog' | null;

function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-2xl border border-gold/20 bg-[#0a0f14] p-5 shadow-glow">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-2xl text-white">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-md border border-gold/20 bg-[#0d1218] p-2 text-zinc-300 transition hover:border-gold/50 hover:text-gold"
          >
            <X size={16} />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

export function AdminPage() {
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modal, setModal] = useState<AdminModal>(null);

  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [blogs, setBlogs] = useState<ApiBlog[]>([]);
  const [quotes, setQuotes] = useState<ApiQuote[]>([]);
  const [contacts, setContacts] = useState<ApiContact[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [pForm, setPForm] = useState<any>({
    name: '',
    slug: '',
    description: '',
    category: '',
    price: 0,
    currency: 'USD',
    unit: 'kg',
    stockQty: 0,
    file: null as File | null,
  });
  const [cForm, setCForm] = useState<any>({ name: '', slug: '', description: '' });
  const [bForm, setBForm] = useState<any>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    file: null as File | null,
  });

  const loadAll = async () => {
    setLoading(true);
    setError('');
    try {
      const [ps, cs, bs, qs, ct] = await Promise.all([
        adminApi.getProducts(),
        adminApi.getCategories(),
        adminApi.getBlogs(),
        adminApi.getQuotes(),
        adminApi.getContacts(),
      ]);
      setProducts(ps);
      setCategories(cs);
      setBlogs(bs);
      setQuotes(qs);
      setContacts(ct);
    } catch (e) {
      const message = (e as Error).message;
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const stats = useMemo(
    () => [
      ['Products', products.length],
      ['Categories', categories.length],
      ['Blogs', blogs.length],
      ['Open Quotes', quotes.filter((q) => q.status !== 'closed').length],
    ],
    [products, categories, blogs, quotes]
  );

  const panel = 'rounded-2xl border border-gold/20 bg-[#0a0f14] p-4 shadow-glow';
  const input =
    'w-full rounded-md border border-gold/20 bg-[#0d1218] px-3 py-2 text-sm text-zinc-100 outline-none focus:border-gold/50';
  const tableWrap = 'overflow-x-auto rounded-xl border border-gold/15 bg-[#0b0f13]';
  const tableHead = 'text-left text-xs uppercase tracking-[0.14em] text-zinc-500';

  const submitProduct: React.FormEventHandler = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminApi.createProduct(pForm);
      toast.success('Product added');
      setPForm({
        name: '',
        slug: '',
        description: '',
        category: '',
        price: 0,
        currency: 'USD',
        unit: 'kg',
        stockQty: 0,
        file: null,
      });
      setModal(null);
      await loadAll();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const submitCategory: React.FormEventHandler = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminApi.createCategory(cForm);
      toast.success('Category added');
      setCForm({ name: '', slug: '', description: '' });
      setModal(null);
      await loadAll();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const submitBlog: React.FormEventHandler = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminApi.createBlog(bForm);
      toast.success('Blog added');
      setBForm({ title: '', slug: '', excerpt: '', content: '', coverImage: '', file: null });
      setModal(null);
      await loadAll();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const user = getAuthUser();

  const sections: Section[] = ['dashboard', 'products', 'categories', 'blogs', 'quotes', 'contacts'];

  return (
    <div className="relative min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(214,182,118,0.08),transparent_40%)] px-4 py-4 md:px-6 md:py-6">
      <SEO title="Admin Dashboard" description="Admin panel" path="/admin" noIndex />
      {loading ? <LoadingOverlay /> : null}

      <div className="mx-auto flex max-w-[1450px] items-center justify-between rounded-xl border border-gold/15 bg-[#0a0f14] px-4 py-3 shadow-glow md:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-md border border-gold/20 bg-[#0d1218] p-2 text-gold"
        >
          <Menu size={18} />
        </button>
        <p className="font-display text-lg text-white">Admin Dashboard</p>
        <ShieldCheck size={18} className="text-gold" />
      </div>

      <div className="mx-auto mt-4 grid max-w-[1450px] gap-5 md:mt-0 md:grid-cols-[240px_1fr]">
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          } fixed inset-y-0 left-0 z-40 w-[260px] border-r border-gold/15 bg-[#070b10] p-4 shadow-glow transition-transform md:static md:w-auto md:rounded-2xl md:border md:border-gold/20 md:bg-[#0a0f14]`}
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl text-white">GRAVEN Admin</h2>
              <p className="mt-1 text-xs text-zinc-500">{user?.email}</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-md border border-gold/20 bg-[#0d1218] p-2 text-zinc-300 md:hidden"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-2">
            {sections.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setSection(s);
                  setSidebarOpen(false);
                }}
                className={`w-full rounded-md px-3 py-2 text-left text-sm capitalize ${
                  section === s
                    ? 'bg-gradient-to-r from-brass to-gold font-semibold text-black'
                    : 'border border-gold/10 bg-[#0d1218] text-zinc-300 hover:border-gold/30'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <button
            className="mt-4 w-full rounded-md border border-gold/20 bg-[#0d1218] px-3 py-2 text-sm text-zinc-200 hover:border-gold/40"
            onClick={() => {
              clearAuth();
              navigate('/auth', { replace: true });
            }}
          >
            Logout
          </button>
        </aside>

        {sidebarOpen ? (
          <button
            aria-label="Close menu"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/60 md:hidden"
          />
        ) : null}

        <main className="space-y-4">
          <section className={`${panel} flex flex-wrap items-center justify-between gap-3`}>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Control Center</p>
              <h1 className="font-display text-3xl text-white capitalize">{section}</h1>
            </div>
            <div className="flex flex-wrap gap-2">
              {section === 'products' ? (
                <button
                  onClick={() => setModal('product')}
                  className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-brass to-gold px-4 py-2 text-sm font-semibold text-black"
                >
                  <Plus size={15} />
                  Add Product
                </button>
              ) : null}
              {section === 'categories' ? (
                <button
                  onClick={() => setModal('category')}
                  className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-brass to-gold px-4 py-2 text-sm font-semibold text-black"
                >
                  <Plus size={15} />
                  Add Category
                </button>
              ) : null}
              {section === 'blogs' ? (
                <button
                  onClick={() => setModal('blog')}
                  className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-brass to-gold px-4 py-2 text-sm font-semibold text-black"
                >
                  <Plus size={15} />
                  Add Blog
                </button>
              ) : null}
            </div>
          </section>

          {error ? (
            <p className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          ) : null}

          {section === 'dashboard' ? (
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map(([k, v]) => (
                <article key={String(k)} className={panel}>
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{k}</p>
                  <p className="mt-2 text-4xl font-bold text-gold">{v}</p>
                  <div className="mt-3 h-1 rounded-full bg-zinc-800">
                    <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-brass to-gold" />
                  </div>
                </article>
              ))}
            </section>
          ) : null}

          {section === 'products' ? (
            <section className={panel}>
              <h3 className="font-display text-2xl text-white">Product Data Table</h3>
              <div className={`mt-4 ${tableWrap}`}>
                <table className="w-full min-w-[620px] text-sm">
                  <thead className="border-b border-gold/10">
                    <tr className={tableHead}>
                      <th className="px-3 py-3">Name</th>
                      <th className="px-3 py-3">Category</th>
                      <th className="px-3 py-3">Price</th>
                      <th className="px-3 py-3">Stock</th>
                      <th className="px-3 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p._id} className="border-t border-gold/10">
                        <td className="px-3 py-3 text-white">{p.name}</td>
                        <td className="px-3 py-3 text-zinc-300">
                          {typeof p.category === 'string' ? p.category : p.category?.name || '-'}
                        </td>
                        <td className="px-3 py-3 text-gold">${p.price}</td>
                        <td className="px-3 py-3 text-zinc-300">{p.stockQty ?? 0}</td>
                        <td className="px-3 py-3">
                          <button
                            className="rounded-md border border-red-500/30 bg-red-500/10 px-2 py-1 text-xs text-red-300"
                            onClick={async () => {
                              try {
                                await adminApi.deleteProduct(p._id);
                                toast.success('Product deleted');
                                await loadAll();
                              } catch (error) {
                                toast.error((error as Error).message);
                              }
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          {section === 'categories' ? (
            <section className={panel}>
              <h3 className="font-display text-2xl text-white">Category Data Table</h3>
              <div className={`mt-4 ${tableWrap}`}>
                <table className="w-full min-w-[520px] text-sm">
                  <thead className="border-b border-gold/10">
                    <tr className={tableHead}>
                      <th className="px-3 py-3">Name</th>
                      <th className="px-3 py-3">Slug</th>
                      <th className="px-3 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((c) => (
                      <tr key={c._id} className="border-t border-gold/10">
                        <td className="px-3 py-3 text-white">{c.name}</td>
                        <td className="px-3 py-3 text-zinc-300">{c.slug}</td>
                        <td className="px-3 py-3">
                          <button
                            className="rounded-md border border-red-500/30 bg-red-500/10 px-2 py-1 text-xs text-red-300"
                            onClick={async () => {
                              try {
                                await adminApi.deleteCategory(c._id);
                                toast.success('Category deleted');
                                await loadAll();
                              } catch (error) {
                                toast.error((error as Error).message);
                              }
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          {section === 'blogs' ? (
            <section className={panel}>
              <h3 className="font-display text-2xl text-white">Blog Data Table</h3>
              <div className={`mt-4 ${tableWrap}`}>
                <table className="w-full min-w-[520px] text-sm">
                  <thead className="border-b border-gold/10">
                    <tr className={tableHead}>
                      <th className="px-3 py-3">Title</th>
                      <th className="px-3 py-3">Slug</th>
                      <th className="px-3 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogs.map((b) => (
                      <tr key={b._id} className="border-t border-gold/10">
                        <td className="px-3 py-3 text-white">{b.title}</td>
                        <td className="px-3 py-3 text-zinc-300">{b.slug}</td>
                        <td className="px-3 py-3">
                          <button
                            className="rounded-md border border-red-500/30 bg-red-500/10 px-2 py-1 text-xs text-red-300"
                            onClick={async () => {
                              try {
                                await adminApi.deleteBlog(b._id);
                                toast.success('Blog deleted');
                                await loadAll();
                              } catch (error) {
                                toast.error((error as Error).message);
                              }
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          {section === 'quotes' ? (
            <section className={panel}>
              <h3 className="font-display text-2xl text-white">Quote Requests</h3>
              <div className={`mt-4 ${tableWrap}`}>
                <table className="w-full min-w-[760px] text-sm">
                  <thead className="border-b border-gold/10">
                    <tr className={tableHead}>
                      <th className="px-3 py-3">Client</th>
                      <th className="px-3 py-3">Metal</th>
                      <th className="px-3 py-3">Quantity</th>
                      <th className="px-3 py-3">Email</th>
                      <th className="px-3 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotes.map((q) => (
                      <tr key={q._id} className="border-t border-gold/10">
                        <td className="px-3 py-3 text-white">{q.fullName}</td>
                        <td className="px-3 py-3 text-zinc-300">{q.metal}</td>
                        <td className="px-3 py-3 text-zinc-300">{q.quantity}</td>
                        <td className="px-3 py-3 text-zinc-300">{q.email}</td>
                        <td className="px-3 py-3">
                          <select
                            className={input}
                            value={q.status}
                            onChange={async (e) => {
                              try {
                                await adminApi.updateQuoteStatus(q._id, e.target.value as ApiQuote['status']);
                                toast.success('Quote status updated');
                                await loadAll();
                              } catch (error) {
                                toast.error((error as Error).message);
                              }
                            }}
                          >
                            <option value="new">new</option>
                            <option value="in_review">in_review</option>
                            <option value="quoted">quoted</option>
                            <option value="closed">closed</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          {section === 'contacts' ? (
            <section className={panel}>
              <h3 className="font-display text-2xl text-white">Contact Forms</h3>
              <div className={`mt-4 ${tableWrap}`}>
                <table className="w-full min-w-[760px] text-sm">
                  <thead className="border-b border-gold/10">
                    <tr className={tableHead}>
                      <th className="px-3 py-3">Name</th>
                      <th className="px-3 py-3">Email</th>
                      <th className="px-3 py-3">Phone</th>
                      <th className="px-3 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((c) => (
                      <tr key={c._id} className="border-t border-gold/10">
                        <td className="px-3 py-3 text-white">{c.fullName}</td>
                        <td className="px-3 py-3 text-zinc-300">{c.email}</td>
                        <td className="px-3 py-3 text-zinc-300">{c.phone}</td>
                        <td className="px-3 py-3">
                          <select
                            className={input}
                            value={c.status}
                            onChange={async (e) => {
                              try {
                                await adminApi.updateContactStatus(c._id, e.target.value as ApiContact['status']);
                                toast.success('Contact status updated');
                                await loadAll();
                              } catch (error) {
                                toast.error((error as Error).message);
                              }
                            }}
                          >
                            <option value="unread">unread</option>
                            <option value="read">read</option>
                            <option value="replied">replied</option>
                            <option value="archived">archived</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}
        </main>
      </div>

      {modal === 'product' ? (
        <ModalShell title="Add New Product" onClose={() => setModal(null)}>
          <form className="grid gap-3 md:grid-cols-2" onSubmit={submitProduct}>
            <input
              className={input}
              placeholder="Name"
              value={pForm.name}
              onChange={(e) => setPForm((p: any) => ({ ...p, name: e.target.value }))}
            />
            <input
              className={input}
              placeholder="Slug"
              value={pForm.slug}
              onChange={(e) => setPForm((p: any) => ({ ...p, slug: e.target.value }))}
            />
            <select
              className={input}
              value={pForm.category}
              onChange={(e) => setPForm((p: any) => ({ ...p, category: e.target.value }))}
            >
              <option value="">Category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            <input
              className={input}
              placeholder="Price"
              type="number"
              value={pForm.price}
              onChange={(e) => setPForm((p: any) => ({ ...p, price: Number(e.target.value) }))}
            />
            <input
              className={input}
              placeholder="Stock Qty"
              type="number"
              value={pForm.stockQty}
              onChange={(e) => setPForm((p: any) => ({ ...p, stockQty: Number(e.target.value) }))}
            />
            <input
              type="file"
              className={`${input} file:mr-3 file:rounded file:border-0 file:bg-gold file:px-2 file:py-1 file:text-black`}
              onChange={(e) => setPForm((p: any) => ({ ...p, file: e.target.files?.[0] || null }))}
            />
            <button
              disabled={saving}
              className="md:col-span-2 rounded-md bg-gradient-to-r from-brass to-gold px-4 py-2 font-semibold text-black disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Add Product'}
            </button>
          </form>
        </ModalShell>
      ) : null}

      {modal === 'category' ? (
        <ModalShell title="Add New Category" onClose={() => setModal(null)}>
          <form className="grid gap-3 md:grid-cols-2" onSubmit={submitCategory}>
            <input
              className={input}
              placeholder="Name"
              value={cForm.name}
              onChange={(e) => setCForm((p: any) => ({ ...p, name: e.target.value }))}
            />
            <input
              className={input}
              placeholder="Slug"
              value={cForm.slug}
              onChange={(e) => setCForm((p: any) => ({ ...p, slug: e.target.value }))}
            />
            <textarea
              className={`${input} md:col-span-2`}
              rows={3}
              placeholder="Description"
              value={cForm.description}
              onChange={(e) => setCForm((p: any) => ({ ...p, description: e.target.value }))}
            />
            <button
              disabled={saving}
              className="md:col-span-2 rounded-md bg-gradient-to-r from-brass to-gold px-4 py-2 font-semibold text-black disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Add Category'}
            </button>
          </form>
        </ModalShell>
      ) : null}

      {modal === 'blog' ? (
        <ModalShell title="Add New Blog" onClose={() => setModal(null)}>
          <form className="grid gap-3 md:grid-cols-2" onSubmit={submitBlog}>
            <input
              className={input}
              placeholder="Title"
              value={bForm.title}
              onChange={(e) => setBForm((p: any) => ({ ...p, title: e.target.value }))}
            />
            <input
              className={input}
              placeholder="Slug"
              value={bForm.slug}
              onChange={(e) => setBForm((p: any) => ({ ...p, slug: e.target.value }))}
            />
            <input
              className={`${input} md:col-span-2`}
              placeholder="Excerpt"
              value={bForm.excerpt}
              onChange={(e) => setBForm((p: any) => ({ ...p, excerpt: e.target.value }))}
            />
            <textarea
              className={`${input} md:col-span-2`}
              rows={5}
              placeholder="Content"
              value={bForm.content}
              onChange={(e) => setBForm((p: any) => ({ ...p, content: e.target.value }))}
            />
            <input
              type="file"
              className={`${input} md:col-span-2 file:mr-3 file:rounded file:border-0 file:bg-gold file:px-2 file:py-1 file:text-black`}
              onChange={(e) => setBForm((p: any) => ({ ...p, file: e.target.files?.[0] || null }))}
            />
            <button
              disabled={saving}
              className="md:col-span-2 rounded-md bg-gradient-to-r from-brass to-gold px-4 py-2 font-semibold text-black disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Add Blog'}
            </button>
          </form>
        </ModalShell>
      ) : null}
    </div>
  );
}
