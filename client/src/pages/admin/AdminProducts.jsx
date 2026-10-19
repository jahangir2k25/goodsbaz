import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import api, { errMsg } from '../../api/axios';
import Loader from '../../components/Loader';
import Pagination from '../../components/Pagination';
import ProductImage from '../../components/ProductImage';
import { money } from '../../utils/format';

export default function AdminProducts() {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [keyword, setKeyword] = useState('');

  const load = useCallback(() => {
    api
      .get('/products', { params: { page, limit: 10, keyword } })
      .then((r) => setData(r.data))
      .catch((e) => toast.error(errMsg(e)));
  }, [page, keyword]);

  useEffect(load, [load]);

  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.name}"?`)) return;
    try {
      await api.delete(`/products/${p._id}`);
      toast.success('Product deleted');
      load();
    } catch (e) {
      toast.error(errMsg(e));
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Products {data && <span className="text-sm font-normal text-gray-500">({data.total})</span>}</h1>
        <Link to="/admin/products/new" className="btn-primary !py-2"><FiPlus /> Add product</Link>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); setPage(1); setKeyword(q); }} className="mb-4 flex gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" className="input max-w-sm" />
        <button className="btn-outline !py-2">Search</button>
      </form>

      {!data ? <Loader /> : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr><th className="p-3">Product</th><th className="p-3">Category</th><th className="p-3">Price</th><th className="p-3">Stock</th><th className="p-3 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y">
              {data.products.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-md"><ProductImage src={p.images?.[0]} name={p.name} brand={p.brand?.name} /></div>
                      <div className="min-w-0"><p className="line-clamp-1 font-medium">{p.name}</p><p className="text-xs text-gray-500">{p.brand?.name}</p></div>
                    </div>
                  </td>
                  <td className="p-3 text-gray-600">{p.category?.name}<br /><span className="text-xs text-gray-400">{p.subCategory}</span></td>
                  <td className="p-3">
                    <span className="font-semibold">{money(p.finalPrice)}</span>
                    {p.discountPercent > 0 && <span className="ml-1 text-xs text-gray-400 line-through">{money(p.price)}</span>}
                  </td>
                  <td className="p-3"><span className={`rounded-full px-2 py-0.5 text-xs font-bold ${p.stock === 0 ? 'bg-red-100 text-red-700' : p.stock <= 5 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>{p.stock}</span></td>
                  <td className="p-3 text-right">
                    <Link to={`/admin/products/${p._id}`} className="mr-1 inline-flex rounded p-2 text-blue-600 hover:bg-blue-50" aria-label="Edit"><FiEdit2 /></Link>
                    <button onClick={() => remove(p)} className="rounded p-2 text-red-600 hover:bg-red-50" aria-label="Delete"><FiTrash2 /></button>
                  </td>
                </tr>
              ))}
              {data.products.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-gray-500">No products found.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
      {data && <Pagination page={data.page} pages={data.pages} onChange={setPage} />}
    </div>
  );
}
