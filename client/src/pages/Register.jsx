import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { errMsg } from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const redirect = sp.get('redirect') || '/';
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created!');
      navigate(redirect, { replace: true });
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-x flex justify-center py-12">
      <form onSubmit={submit} className="card w-full max-w-md space-y-4 p-6 shadow-lg">
        <h1 className="text-2xl font-bold">Create account</h1>
        <div><label className="label">Full name</label><input required value={form.name} onChange={set('name')} className="input" /></div>
        <div><label className="label">Email</label><input type="email" required value={form.email} onChange={set('email')} className="input" /></div>
        <div><label className="label">Mobile (optional)</label><input value={form.phone} onChange={set('phone')} className="input" placeholder="01XXXXXXXXX" /></div>
        <div><label className="label">Password (min 6 characters)</label><input type="password" required minLength={6} value={form.password} onChange={set('password')} className="input" /></div>
        <button disabled={loading} className="btn-primary w-full">{loading ? 'Creating…' : 'Register'}</button>
        <p className="text-center text-sm text-gray-500">
          Already have an account? <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className="font-semibold text-brand">Login</Link>
        </p>
      </form>
    </div>
  );
}
