export const money = (n) => `৳${Number(n || 0).toLocaleString('en-IN')}`;

export const dateTime = (d) =>
  new Date(d).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-indigo-100 text-indigo-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export const CATEGORY_ICONS = {
  'personal-care': '🧴',
  'skin-care': '✨',
  'hair-care': '💆‍♀️',
  makeup: '💄',
  'kids-and-mom': '👶',
  'k-beauty': '🌸',
  'j-beauty': '🎎',
  'b-glam': '🌿',
};
