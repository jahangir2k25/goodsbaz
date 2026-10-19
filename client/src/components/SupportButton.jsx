import { useState } from 'react';
import { FiHeadphones, FiX, FiPhone } from 'react-icons/fi';
import { FaWhatsapp, FaFacebookMessenger } from 'react-icons/fa';
import { site } from '../config/site';

export default function SupportButton() {
  const [open, setOpen] = useState(false);
  const row = 'flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold shadow-lg transition hover:scale-105';

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {open && (
        <div className="fade-up flex flex-col items-end gap-2">
          <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noreferrer" className={`${row} text-green-600`}>
            <FaWhatsapp size={16} /> WhatsApp
          </a>
          <a href={site.facebook} target="_blank" rel="noreferrer" className={`${row} text-blue-600`}>
            <FaFacebookMessenger size={16} /> Messenger
          </a>
          <a href={`tel:${site.phone}`} className={`${row} text-brand`}>
            <FiPhone size={15} /> Call us
          </a>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Customer support"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-brand-800 text-white shadow-xl transition hover:scale-110"
      >
        {open ? <FiX size={22} /> : <FiHeadphones size={22} />}
      </button>
    </div>
  );
}
