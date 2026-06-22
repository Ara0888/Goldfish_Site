import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { cart, updateQty, removeFromCart } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <h2>Ваша корзина пуста</h2>
        <p style={{ color: 'var(--gray-text)', margin: '20px 0' }}>Добавьте товары из каталога, чтобы оформить заказ.</p>
        <Link to="/catalog" className="btn btn-primary btn-large">Перейти в каталог</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-list">
        <h2 style={{ marginBottom: '24px' }}>Корзина</h2>
        {cart.map((item, idx) => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-info">
              <div className="cart-item-name">{item.icon} {item.name}</div>
              <div className="cart-item-price">{item.price} ₽ / шт.</div>
            </div>
            <div className="cart-qty">
              <button onClick={() => updateQty(item.id, -1)} aria-label="Уменьшить">−</button>
              <span>{item.qty}</span>
              <button onClick={() => updateQty(item.id, 1)} aria-label="Увеличить">+</button>
            </div>
            <div style={{ fontWeight: 700, minWidth: '100px', textAlign: 'right' }}>
              {item.price * item.qty} ₽
            </div>
            <button 
              className="cart-remove" 
              onClick={() => removeFromCart(item.id)} 
              title="Удалить"
              aria-label={`Удалить ${item.name} из корзины`}
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
      
      <aside className="cart-sidebar">
        <h3>Итого</h3>
        <div className="summary-row"><span>Товары ({cart.reduce((s,i)=>s+i.qty,0)})</span><span>{total} ₽</span></div>
        <div className="summary-row"><span>Доставка</span><span>Рассчитается далее</span></div>
        <div className="summary-row total"><span>К оплате</span><span>{total} ₽</span></div>
        <Link to="/checkout" className="btn btn-primary btn-large" style={{ width: '100%', justifyContent: 'center', marginTop: '20px' }}>
          Перейти к оформлению
        </Link>
      </aside>
    </div>
  );
}