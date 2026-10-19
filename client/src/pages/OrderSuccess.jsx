import { Link, useLocation } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import { money } from '../utils/format';

export default function OrderSuccess() {
  const order = useLocation().state?.order;

  return (
    <div className="container-x max-w-xl py-16 text-center">
      <FiCheckCircle className="mx-auto text-green-500" size={64} />
      <h1 className="mt-4 text-2xl font-bold">Thank you for your order!</h1>
      {order ? (
        <>
          <p className="mt-2 text-gray-600">
            Your order number is <b className="text-brand">{order.orderNumber}</b>
          </p>
          <div className="card mt-6 space-y-2 p-5 text-left text-sm">
            <div className="flex justify-between"><span>Items</span><span>{order.items.reduce((a, i) => a + i.qty, 0)}</span></div>
            <div className="flex justify-between"><span>Subtotal</span><span>{money(order.subtotal)}</span></div>
            {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{money(order.discount)}</span></div>}
            <div className="flex justify-between"><span>Delivery</span><span>{order.shippingFee === 0 ? 'FREE' : money(order.shippingFee)}</span></div>
            <div className="flex justify-between border-t pt-2 text-base font-bold"><span>Total</span><span className="text-brand">{money(order.total)}</span></div>
            <div className="flex justify-between text-gray-500"><span>Payment</span><span className="uppercase">{order.paymentMethod}</span></div>
            <div className="text-gray-500">Deliver to: {order.shipping.name}, {order.shipping.phone}, {order.shipping.address}</div>
          </div>
          <p className="mt-4 text-xs text-gray-500">Keep your order number and phone number to track your order any time.</p>
        </>
      ) : (
        <p className="mt-2 text-gray-600">Your order has been received. We will contact you shortly.</p>
      )}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link to="/track-order" className="btn-outline">Track order</Link>
        <Link to="/shop" className="btn-primary">Continue shopping</Link>
      </div>
    </div>
  );
}
