import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { errMsg } from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const redirect = sp.get('redirect') || '/';
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const u = await login(form.email, form.password);
      toast.success(`Welcome back, ${u.name}!`);
      navigate(u.role === 'admin' && redirect === '/' ? '/admin' : redirect, { replace: true });
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-x flex justify-center py-12">
      <form onSubmit={submit} className="card w-full max-w-md space-y-4 p-6 shadow-lg">
        <h1 className="text-2xl font-bold">Login</h1>
        <div><label className="label">Email</label><input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" /></div>
        <div><label className="label">Password</label><input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input" /></div>
        <button disabled={loading} className="btn-primary w-full">{loading ? 'Logging in…' : 'Login'}</button>
        <p className="text-center text-sm text-gray-500">
          Don't have an account? <Link to={`/register?redirect=${encodeURIComponent(redirect)}`} className="font-semibold text-brand">Create an account</Link>
        </p>
        {/* login with google */}
        <p className="rounded-lg bg-gray-50 p-3 text-center text-[11px] text-gray-500">
          <a href="/api/auth/google" className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow transition hover:bg-gray-100">
            <img src="/google.svg" alt="Google" className="h-4 w-4" />
            Login with Google
          </a>
        </p>
      </form>
    </div>
  );
}
