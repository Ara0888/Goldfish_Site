import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CartPage.css';

export default function CartPage() {
  const { cart, updateQty, removeFromCart } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

  if (cart.length === 0) {
    return (
      <div className="cart-page-wrapper">
        <div className="cart-empty">
          <div className="cart-empty-icon">🛒</div>
          <h2>Ваша корзина пуста</h2>
          <p>Добавьте товары из каталога, чтобы оформить заказ.</p>
          <Link to="/catalog" className="btn btn-primary btn-large">
            Перейти в каталог
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-wrapper">
      <h1 className="cart-page-title">Корзина</h1>

      <div className="cart-layout">
        {/* Список товаров */}
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item-card">
              {/* Изображение */}
              <div className="cart-item-image">
                {item.image ? (
                  <img src={item.image} alt={item.name} />
                ) : (
                  <span>{item.icon || '📦'}</span>
                )}
              </div>

              {/* Информация о товаре */}
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                {item.sku && (
                  <div className="cart-item-sku">Артикул: {item.sku}</div>
                )}
                <div className="cart-item-price">{item.price} ₽ / шт.</div>

                <div className="cart-quantity-control">
                  <button
                    className="qty-button"
                    onClick={() => updateQty(item.id, -1)}
                    aria-label="Уменьшить количество"
                  >
                    −
                  </button>
                  <span className="qty-value">{item.qty}</span>
                  <button
                    className="qty-button"
                    onClick={() => updateQty(item.id, 1)}
                    aria-label="Увеличить количество"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Цена + удаление (на десктопе — справа, на мобильном — снизу) */}
              <div className="cart-item-actions">
                <div className="cart-item-total-price">
                  {item.price * item.qty} ₽
                </div>
                <button
                  className="cart-item-remove"
                  onClick={() => removeFromCart(item.id)}
                  title="Удалить"
                  aria-label={`Удалить ${item.name} из корзины`}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Блок итогов */}
        <aside className="cart-summary">
          <h3>Итого</h3>
          <div className="summary-line">
            <span>Товары ({totalQty})</span>
            <span>{total} ₽</span>
          </div>
          <div className="summary-line">
            <span>Доставка</span>
            <span>Рассчитается далее</span>
          </div>
          <div className="summary-line total">
            <span>К оплате</span>
            <span>{total} ₽</span>
          </div>

          <div className="bonus-info">
            <p>💡 Начисление бонусов после покупки</p>
          </div>

          <Link to="/checkout" className="btn btn-primary btn-large">
            Перейти к оформлению
          </Link>
        </aside>
      </div>
    </div>
  );
}