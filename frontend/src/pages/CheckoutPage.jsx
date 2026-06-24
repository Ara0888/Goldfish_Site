import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [delivery, setDelivery] = useState({ address: '', method: 'courier' });
  const [payment, setPayment] = useState('card');
  const [paymentMode, setPaymentMode] = useState('full');
  const [useBonuses, setUseBonuses] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deliveryPrice = delivery.method === 'courier' ? 300 : 0;
  const bonusDiscount = useBonuses ? Math.min(user?.bonusPoints || 0, total * 0.2) : 0;
  const finalTotal = Math.max(0, total + deliveryPrice - bonusDiscount - promoDiscount);

  const applyPromo = () => {
    const promos = { 'WELCOME10': 0.1, 'FISH2026': 500, 'PREMIUM': 0.15 };
    const code = promoCode.trim().toUpperCase();
    if (promos[code]) {
      const discount = typeof promos[code] === 'number' && promos[code] < 1 ? total * promos[code] : promos[code];
      setPromoDiscount(discount);
      alert(`Промокод применён! Скидка: ${discount} ₽`);
    } else {
      alert('Неверный промокод');
    }
  };

  const submitOrder = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    clearCart();
    navigate('/tracking/10423');
  };

  if (cart.length === 0) return <div style={{padding: '40px', textAlign: 'center'}}>Корзина пуста</div>;

  return (
    <div className="checkout-page">
      <h1 className="checkout-title">Оформление заказа</h1>

      <div className="checkout-steps-progress">
        <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-label">Доставка</div>
        </div>
        <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-label">Оплата</div>
        </div>
      </div>

      <div className="checkout-content">
        <div className="checkout-main">
          {step === 1 && (
            <div className="checkout-form-section">
              <h3>📦 Адрес и способ доставки</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Адрес доставки <span className="required">*</span></label>
                  <input
                    type="text"
                    placeholder=""
                    value={delivery.address}
                    onChange={(e) => setDelivery({...delivery, address: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Способ доставки</label>
                  <select
                    value={delivery.method}
                    onChange={(e) => setDelivery({...delivery, method: e.target.value})}
                  >
                    <option value="courier">Курьером (300 ₽)</option>
                    <option value="pickup">Самовывоз (Бесплатно)</option>
                  </select>
                </div>
              </div>
              <div className="checkout-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => setStep(2)}
                  disabled={!delivery.address}
                >
                  Далее: Оплата
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="checkout-form-section">
              <h3>💳 Способ оплаты</h3>

              <div className="payment-methods">
                <label className={`payment-method ${payment === 'card' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="pay"
                    value="card"
                    checked={payment === 'card'}
                    onChange={(e) => setPayment(e.target.value)}
                  />
                  💳 Банковской картой (онлайн)
                </label>

                <label className={`payment-method ${payment === 'cash' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="pay"
                    value="cash"
                    checked={payment === 'cash'}
                    onChange={(e) => setPayment(e.target.value)}
                    disabled={delivery.method !== 'pickup'}
                  />
                  💵 При получении {delivery.method === 'pickup' ? '(самовывоз)' : '(недоступно для курьера)'}
                </label>
              </div>

              {payment === 'card' && (
                <div className="payment-methods">
                  <label className={`payment-method ${paymentMode === 'full' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="payMode"
                      value="full"
                      checked={paymentMode === 'full'}
                      onChange={(e) => setPaymentMode(e.target.value)}
                    />
                    Полностью
                  </label>
                  <label className={`payment-method ${paymentMode === 'partial' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="payMode"
                      value="partial"
                      checked={paymentMode === 'partial'}
                      onChange={(e) => setPaymentMode(e.target.value)}
                    />
                    Частями (рассрочка)
                  </label>
                </div>
              )}

              <div className="form-group" style={{ marginTop: '20px' }}>
                <label>Промокод</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Введите промокод"
                  />
                  <button className="btn btn-outline" onClick={applyPromo}>
                    Применить
                  </button>
                </div>
                {promoDiscount > 0 && (
                  <p style={{ color: 'var(--green-bright)', marginTop: '8px' }}>
                    ✓ Скидка по промокоду: {promoDiscount} ₽
                  </p>
                )}
              </div>

              {user?.bonusPoints > 0 && (
                <div className="form-checkbox" style={{ marginTop: '16px' }}>
                  <input
                    type="checkbox"
                    id="bonuses"
                    checked={useBonuses}
                    onChange={(e) => setUseBonuses(e.target.checked)}
                  />
                  <label htmlFor="bonuses">
                    Списать бонусы (Доступно: {user.bonusPoints} ₽, скидка {bonusDiscount} ₽)
                  </label>
                </div>
              )}

              <div className="checkout-actions">
                <button className="btn btn-back" onClick={() => setStep(1)}>
                  Назад
                </button>
                <button
                  className="btn btn-primary btn-large"
                  onClick={submitOrder}
                  style={{ flex: 2 }}
                >
                  Подтвердить заказ ({finalTotal} ₽)
                </button>
              </div>
            </div>
          )}
        </div>

        <aside className="checkout-order-summary">
          <h3>Ваш заказ</h3>
          {cart.map((item) => (
            <div key={item.id} className="checkout-item">
              <div className="checkout-item-thumb">📦</div>
              <div className="checkout-item-info">
                <h4>{item.name}</h4>
                <p>× {item.qty}</p>
              </div>
              <div className="checkout-item-price">{item.price * item.qty} ₽</div>
            </div>
          ))}

          <div className="checkout-total">
            <div className="checkout-total-row">
              <span>Товары</span>
              <span>{total} ₽</span>
            </div>
            <div className="checkout-total-row">
              <span>Доставка</span>
              <span>{deliveryPrice} ₽</span>
            </div>
            {promoDiscount > 0 && (
              <div className="checkout-total-row" style={{ color: 'var(--green-bright)' }}>
                <span>Промокод</span>
                <span>-{promoDiscount} ₽</span>
              </div>
            )}
            {bonusDiscount > 0 && (
              <div className="checkout-total-row" style={{ color: 'var(--green-bright)' }}>
                <span>Бонусы</span>
                <span>-{bonusDiscount} ₽</span>
              </div>
            )}
            <div className="checkout-total-row final">
              <span>Итого</span>
              <span>{finalTotal} ₽</span>
            </div>
          </div>
        </aside>
      </div>
      {showAuthModal && (
        <div className="modal-overlay active" onClick={() => setShowAuthModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Необходима авторизация</h2>
              <button className="modal-close" onClick={() => setShowAuthModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <p style={{ marginBottom: '20px' }}>
                Для оформления заказа необходимо войти в систему или зарегистрироваться.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Link to="/login" className="btn btn-primary" onClick={() => setShowAuthModal(false)}>
                  Войти
                </Link>
                <button className="btn btn-outline" onClick={() => setShowAuthModal(false)}>
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}