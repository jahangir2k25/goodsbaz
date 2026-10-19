import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api, { errMsg } from '../../api/axios';
import Loader from '../../components/Loader';
import ProductImage from '../../components/ProductImage';

const EMPTY = {
  name: '', brand: '', category: '', subCategory: '', price: '', salePrice: '', stock: '', size: '', sku: '',
  imagesText: '', tagsText: '', description: '', isFeatured: false, isBestSeller: false, isNewArrival: false,
};

export default function ProductForm() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY);
  const [cats, setCats] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/categories').then((r) => setCats(r.data));
    api.get('/brands').then((r) => setBrands(r.data));
  }, []);

  useEffect(() => {
    if (isNew) return;
    api
      .get(`/products/${id}`)
      .then(({ data }) => {
        const p = data.product;
        setForm({
          name: p.name, brand: p.brand?._id || '', category: p.category?._id || '', subCategory: p.subCategory || '',
          price: p.price, salePrice: p.salePrice || '', stock: p.stock, size: p.size || '', sku: p.sku || '',
          imagesText: (p.images || []).join('\n'), tagsText: (p.tags || []).join(', '), description: p.description || '',
          isFeatured: p.isFeatured, isBestSeller: p.isBestSeller, isNewArrival: p.isNewArrival,
        });
      })
      .catch((e) => toast.error(errMsg(e)))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const subs = cats.find((c) => c._id === form.category)?.subCategories || [];
  const images = form.imagesText.split('\n').map((s) => s.trim()).filter(Boolean);

  const submit = async (e) => {
    e.preventDefault();
    if (Number(form.salePrice) > 0 && Number(form.salePrice) >= Number(form.price)) return toast.error('Sale price must be lower than the regular price');
    setSaving(true);
    const payload = {
      name: form.name, brand: form.brand, category: form.category, subCategory: form.subCategory,
      price: Number(form.price), salePrice: Number(form.salePrice) || 0, stock: Number(form.stock) || 0,
      size: form.size, sku: form.sku, description: form.description,
      images,
      tags: form.tagsText.split(',').map((s) => s.trim()).filter(Boolean),
      isFeatured: form.isFeatured, isBestSeller: form.isBestSeller, isNewArrival: form.isNewArrival,
    };
    try {
      if (isNew) await api.post('/products', payload);
      else await api.put(`/products/${id}`, payload);
      toast.success(isNew ? 'Product created' : 'Product updated');
      navigate('/admin/products');
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <form onSubmit={submit} className="mx-auto max-w-4xl space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{isNew ? 'Add product' : 'Edit product'}</h1>
        <Link to="/admin/products" className="text-sm text-gray-500 hover:text-brand">← Back</Link>
      </div>

      <div className="card grid gap-4 p-5 sm:grid-cols-2">
        <div className="sm:col-span-2"><label className="label">Product name *</label><input required value={form.name} onChange={set('name')} className="input" /></div>
        <div>
          <label className="label">Brand *</label>
          <select required value={form.brand} onChange={set('brand')} className="input"><option value="">Select brand</option>{brands.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}</select>
        </div>
        <div>
          <label className="label">Category *</label>
          <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value, subCategory: '' })} className="input"><option value="">Select category</option>{cats.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}</select>
        </div>
        <div>
          <label className="label">Sub-category</label>
          <select value={form.subCategory} onChange={set('subCategory')} className="input"><option value="">None</option>{subs.map((s) => <option key={s} value={s}>{s}</option>)}</select>
        </div>
        <div><label className="label">Size / volume</label><input value={form.size} onChange={set('size')} className="input" placeholder="e.g. 100ml" /></div>
        <div><label className="label">Regular price (৳) *</label><input type="number" min="0" required value={form.price} onChange={set('price')} className="input" /></div>
        <div><label className="label">Sale price (৳) — leave empty for no discount</label><input type="number" min="0" value={form.salePrice} onChange={set('salePrice')} className="input" /></div>
        <div><label className="label">Stock *</label><input type="number" min="0" required value={form.stock} onChange={set('stock')} className="input" /></div>
        <div><label className="label">SKU</label><input value={form.sku} onChange={set('sku')} className="input" /></div>
      </div>

      <div className="card space-y-4 p-5">
        <div>
          <label className="label">Image URLs (one per line)</label>
          <textarea rows="3" value={form.imagesText} onChange={set('imagesText')} className="input font-mono text-xs" placeholder="https://…/photo1.jpg" />
        </div>
        {images.length > 0 && (
          <div className="flex flex-wrap gap-2">{images.map((src, i) => <div key={i} className="h-16 w-16 overflow-hidden rounded-lg border"><ProductImage src={src} name={form.name} /></div>)}</div>
        )}
        <div><label className="label">Tags (comma separated)</label><input value={form.tagsText} onChange={set('tagsText')} className="input" placeholder="sunscreen, spf50, korean" /></div>
        <div><label className="label">Description</label><textarea rows="5" value={form.description} onChange={set('description')} className="input" /></div>
        <div className="flex flex-wrap gap-5 text-sm">
          {[['isFeatured', 'Featured'], ['isBestSeller', 'Best seller'], ['isNewArrival', 'New arrival']].map(([k, l]) => (
            <label key={k} className="flex cursor-pointer items-center gap-2"><input type="checkbox" checked={form[k]} onChange={set(k)} className="accent-brand" /> {l}</label>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button disabled={saving} className="btn-primary">{saving ? 'Saving…' : isNew ? 'Create product' : 'Save changes'}</button>
        <Link to="/admin/products" className="btn-outline">Cancel</Link>
      </div>
    </form>
  );
}
