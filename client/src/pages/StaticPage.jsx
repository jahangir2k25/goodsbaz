import { Link, useParams } from 'react-router-dom';
import { site } from '../config/site';

const PAGES = {
  'shipping-policy': {
    title: 'Shipping Policy',
    body: [
      `We deliver all over Bangladesh. Delivery charge is ৳${site.shippingInside} inside Dhaka and ৳${site.shippingOutside} outside Dhaka.`,
      `Orders above ৳${site.freeShippingMin} get free delivery.`,
      'Inside Dhaka orders usually arrive within 1–3 working days; outside Dhaka within 3–5 working days.',
    ],
  },
  'return-policy': {
    title: 'Return & Refund Policy',
    body: [
      'If you receive a damaged, expired or wrong product, contact us within 48 hours of delivery with photos and your order number.',
      'Opened or used products cannot be returned unless they are defective.',
      'Approved refunds are processed within 5–7 working days.',
    ],
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    body: [
      'We collect only the information needed to process and deliver your orders: name, phone, address and optional email.',
      'We never sell your personal data to third parties.',
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    body: [
      'By placing an order you agree to provide accurate delivery information.',
      'Prices and stock may change without notice. We reserve the right to cancel orders in case of pricing errors.',
    ],
  },
};

export default function StaticPage() {
  const { slug } = useParams();
  const page = PAGES[slug];
  if (!page)
    return (
      <div className="container-x py-24 text-center">
        <p className="font-semibold">Page not found</p>
        <Link to="/" className="btn-primary mt-4">Go home</Link>
      </div>
    );
  return (
    <div className="container-x max-w-3xl py-10">
      <h1 className="mb-4 text-2xl font-bold">{page.title}</h1>
      <div className="space-y-3 leading-7 text-gray-700">
        {page.body.map((t, i) => <p key={i}>{t}</p>)}
      </div>
      <p className="mt-6 text-sm text-gray-500">Questions? Email <a className="text-brand" href={`mailto:${site.email}`}>{site.email}</a>.</p>
    </div>
  );
}
