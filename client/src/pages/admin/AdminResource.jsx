import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import api, { errMsg } from '../../api/axios';
import Loader from '../../components/Loader';

// Field types: text | number | textarea | checkbox | select | csv | date
const CONFIG = {
  banners: {
    title: 'Banners',
    singular: 'banner',
    endpoint: '/banners',
    hint: 'Hero = top slider · Deal = small cards on the purple "Hot Deals" strip · Brand = the 3 brand cards. Add an Image URL to use your own artwork; otherwise a gradient design is generated from the text.',
    columns: [
      ['type', 'Type'], ['title', 'Title'], ['highlight', 'Highlight'], ['link', 'Link'], ['order', 'Order'],
      ['active', 'Active', (v) => (v ? '✅' : '—')],
    ],
    fields: [
      { key: 'type', label: 'Type', type: 'select', options: ['hero', 'deal', 'brand'], required: true, default: 'hero' },
      { key: 'tag', label: 'Tag (small text)', type: 'text' },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'highlight', label: 'Highlight (big text on deal cards)', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'text' },
      { key: 'image', label: 'Image URL (optional)', type: 'text' },
      { key: 'gradient', label: 'CSS gradient (optional)', type: 'text', placeholder: 'linear-gradient(100deg,#fff1f5,#f9cadb)' },
      { key: 'textColor', label: 'Text color', type: 'text', default: '#ffffff' },
      { key: 'link', label: 'Link', type: 'text', default: '/shop' },
      { key: 'order', label: 'Order', type: 'number', default: 0 },
      { key: 'active', label: 'Active', type: 'checkbox', default: true },
    ],
  },
  categories: {
    title: 'Categories',
    singular: 'category',
    endpoint: '/categories',
    hint: 'Categories appear in the pink navigation bar. Sub-categories show in the hover dropdown.',
    columns: [['order', 'Order'], ['name', 'Name'], ['slug', 'Slug'], ['subCategories', 'Sub-categories', (v) => (v || []).join(', ')]],
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'subCategories', label: 'Sub-categories (comma separated)', type: 'csv' },
      { key: 'image', label: 'Image URL (optional)', type: 'text' },
      { key: 'order', label: 'Order', type: 'number', default: 0 },
    ],
  },
  brands: {
    title: 'Brands',
    singular: 'brand',
    endpoint: '/brands',
    columns: [['name', 'Name'], ['slug', 'Slug'], ['featured', 'Featured', (v) => (v ? '⭐' : '—')]],
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'logo', label: 'Logo URL (optional)', type: 'text' },
      { key: 'featured', label: 'Show in "Top Brands" on home page', type: 'checkbox' },
    ],
  },
  coupons: {
    title: 'Coupons',
    singular: 'coupon',
    endpoint: '/coupons',
    columns: [
      ['code', 'Code'], ['type', 'Type'],
      ['value', 'Value', (v, r) => (r.type === 'percent' ? `${v}%` : `৳${v}`)],
      ['minOrder', 'Min order'], ['used', 'Used'],
      ['active', 'Active', (v) => (v ? '✅' : '—')],
    ],
    fields: [
      { key: 'code', label: 'Code', type: 'text', required: true },
      { key: 'type', label: 'Type', type: 'select', options: ['percent', 'fixed'], default: 'percent' },
      { key: 'value', label: 'Value (% or ৳)', type: 'number', required: true },
      { key: 'minOrder', label: 'Minimum order (৳)', type: 'number', default: 0 },
      { key: 'maxDiscount', label: 'Max discount for % coupons (0 = no cap)', type: 'number', default: 0 },
      { key: 'usageLimit', label: 'Usage limit (0 = unlimited)', type: 'number', default: 0 },
      { key: 'expiresAt', label: 'Expires on', type: 'date' },
      { key: 'active', label: 'Active', type: 'checkbox', default: true },
    ],
  },
};

const toForm = (fields, item) =>
  Object.fromEntries(
    fields.map((f) => {
      let v = item ? item[f.key] : f.default;
      if (f.type === 'csv') v = (v || []).join(', ');
      if (f.type === 'date') v = v ? String(v).slice(0, 10) : '';
      if (f.type === 'checkbox') v = !!v;
      return [f.key, v ?? (f.type === 'number' ? '' : '')];
    })
  );

const toPayload = (fields, form) =>
  Object.fromEntries(
    fields.map((f) => {
      let v = form[f.key];
      if (f.type === 'number') v = Number(v) || 0;
      if (f.type === 'csv') v = String(v).split(',').map((s) => s.trim()).filter(Boolean);
      if (f.type === 'date') v = v || null;
      return [f.key, v];
    })
  );

export default function AdminResource({ resource }) {
  const cfg = CONFIG[resource];
  const [items, setItems] = useState(null);
  const [editing, setEditing] = useState(null); // null | 'new' | item
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [typeFilter, setTypeFilter] = useState('');

  const load = useCallback(() => {
    setItems(null);
    api
      .get(cfg.endpoint)
      .then((r) => setItems(r.data))
      .catch((e) => {
        toast.error(errMsg(e));
        setItems([]);
      });
  }, [cfg.endpoint]);

  useEffect(() => {
    setEditing(null);
    setTypeFilter('');
    load();
  }, [load]);

  const openForm = (item) => {
    setEditing(item || 'new');
    setForm(toForm(cfg.fields, item));
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = toPayload(cfg.fields, form);
    try {
      if (editing === 'new') await api.post(cfg.endpoint, payload);
      else await api.put(`${cfg.endpoint}/${editing._id}`, payload);
      toast.success('Saved');
      setEditing(null);
      load();
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item) => {
    if (!window.confirm(`Delete this ${cfg.singular}?`)) return;
    try {
      await api.delete(`${cfg.endpoint}/${item._id}`);
      toast.success('Deleted');
      load();
    } catch (err) {
      toast.error(errMsg(err));
    }
  };

  const visible = items && (typeFilter ? items.filter((i) => i.type === typeFilter) : items);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{cfg.title}</h1>
        <div className="flex gap-2">
          {resource === 'banners' && (
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="input !w-auto !py-2 capitalize">
              <option value="">All types</option><option value="hero">hero</option><option value="deal">deal</option><option value="brand">brand</option>
            </select>
          )}
          <button onClick={() => openForm()} className="btn-primary !py-2"><FiPlus /> Add {cfg.singular}</button>
        </div>
      </div>
      {cfg.hint && <p className="mb-4 rounded-lg bg-blue-50 p-3 text-xs text-blue-800">{cfg.hint}</p>}

      {!visible ? <Loader /> : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>{cfg.columns.map(([, l]) => <th key={l} className="p-3">{l}</th>)}<th className="p-3 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y">
              {visible.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  {cfg.columns.map(([k, l, fmt]) => (
                    <td key={l} className="max-w-[240px] truncate p-3">{fmt ? fmt(item[k], item) : String(item[k] ?? '')}</td>
                  ))}
                  <td className="p-3 text-right">
                    <button onClick={() => openForm(item)} className="mr-1 rounded p-2 text-blue-600 hover:bg-blue-50" aria-label="Edit"><FiEdit2 /></button>
                    <button onClick={() => remove(item)} className="rounded p-2 text-red-600 hover:bg-red-50" aria-label="Delete"><FiTrash2 /></button>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && <tr><td colSpan={cfg.columns.length + 1} className="p-8 text-center text-gray-500">Nothing here yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-black/50 p-4">
          <form onSubmit={save} className="card my-8 w-full max-w-lg space-y-4 p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">{editing === 'new' ? 'Add' : 'Edit'} {cfg.singular}</h2>
              <button type="button" onClick={() => setEditing(null)} aria-label="Close"><FiX size={20} /></button>
            </div>

            {cfg.fields.map((f) =>
              f.type === 'checkbox' ? (
                <label key={f.key} className="flex cursor-pointer items-center gap-2 text-sm">
                  <input type="checkbox" checked={!!form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.checked })} className="accent-brand" /> {f.label}
                </label>
              ) : (
                <div key={f.key}>
                  <label className="label">{f.label}{f.required && ' *'}</label>
                  {f.type === 'select' ? (
                    <select value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className="input">
                      {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : f.type === 'textarea' ? (
                    <textarea rows="3" value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className="input" />
                  ) : (
                    <input
                      type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'}
                      required={f.required}
                      placeholder={f.placeholder}
                      value={form[f.key]}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      className="input"
                    />
                  )}
                </div>
              )
            )}

            <div className="flex gap-3 pt-2">
              <button disabled={saving} className="btn-primary">{saving ? 'Saving…' : 'Save'}</button>
              <button type="button" onClick={() => setEditing(null)} className="btn-outline">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
