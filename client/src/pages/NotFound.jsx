import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container-x py-24 text-center">
      <p className="text-7xl font-extrabold text-brand">404</p>
      <p className="mt-2 font-semibold">Oops! This page does not exist.</p>
      <Link to="/" className="btn-primary mt-6">Back to home</Link>
    </div>
  );
}
