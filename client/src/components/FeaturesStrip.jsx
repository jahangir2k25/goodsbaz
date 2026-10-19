import { FiShield, FiTruck, FiCreditCard, FiHeadphones } from 'react-icons/fi';
import { site } from '../config/site';

const items = [
  { icon: FiShield, title: '100% Authentic', text: 'Original products from trusted brands' },
  { icon: FiTruck, title: 'Fast Delivery', text: `Free shipping over ৳${site.freeShippingMin}` },
  { icon: FiCreditCard, title: 'Easy Payment', text: 'Cash on delivery, bKash & Nagad' },
  { icon: FiHeadphones, title: 'Friendly Support', text: 'We are here to help you every day' },
];

export default function FeaturesStrip() {
  return (
    <section className="border-y bg-white py-6">
      <div className="container-x grid grid-cols-2 gap-4 md:grid-cols-4">
        {items.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand">
              <Icon size={20} />
            </span>
            <div>
              <p className="text-sm font-semibold">{title}</p>
              <p className="text-[11px] leading-snug text-gray-500">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
