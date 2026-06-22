import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

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
    // ПРОВЕРКА: если гость — показываем модалку
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    clearCart();
    navigate('/tracking/10423');
  };

  if (cart.length === 0) return <div style={{padding: '40px', textAlign: 'center'}}>Корзина пуста</div>;

  return (
    <div className="cart-page">
      <div className="cart-list">
        <h2>Оформление заказа</h2>
        <div className="checkout-steps">
          <button className={`btn ${step===1 ? 'btn-primary' : 'btn-outline'}`} onClick={() => setStep(1)}>1. Доставка</button>
          <button className={`btn ${step===2 ? 'btn-primary' : 'btn-outline'}`} onClick={() => step===1 && delivery.address && setStep(2)}>2. Оплата</button>
        </div>

        {step === 1 && (
          <div className="checkout-form">
            <div className="form-group">
              <label>Адрес доставки <span className="required">*</span></label>
              <input type="text" placeholder="г. Луховицы, ул. Пушкина, д. 10" value={delivery.address} onChange={e => setDelivery({...delivery, address: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Способ доставки</label>
              <select value={delivery.method} onChange={e => setDelivery({...delivery, method: e.target.value})}>
                <option value="courier">Курьером (300 ₽)</option>
                <option value="pickup">Самовывоз (Бесплатно)</option>
              </select>
            </div>
            <button className="btn btn-primary" onClick={() => setStep(2)} disabled={!delivery.address}>Далее: Оплата</button>
          </div>
        )}

        {step === 2 && (
          <div className="checkout-form">
            <h3>Способ оплаты</h3>
            
            <div className="form-group">
              <label><input type="radio" name="pay" value="card" checked={payment==='card'} onChange={e=>setPayment(e.target.value)} /> 💳 Банковской картой (онлайн)</label>
            </div>
            
            {/* ИСПРАВЛЕНИЕ 3: условный текст */}
            <div className="form-group">
              <label>
                <input 
                  type="radio" 
                  name="pay" 
                  value="cash" 
                  checked={payment==='cash'} 
                  onChange={e=>setPayment(e.target.value)} 
                  disabled={delivery.method !== 'pickup'} 
                /> 
                💵 При получении {delivery.method === 'pickup' ? '(самовывоз)' : ''}
              </label>
            </div>

            {payment === 'card' && (
              <div className="form-group" style={{ marginLeft: '24px', marginTop: '12px' }}>
                <label><input type="radio" name="payMode" value="full" checked={paymentMode==='full'} onChange={e=>setPaymentMode(e.target.value)} /> Полностью</label>
                <label style={{ marginTop: '8px', display: 'block' }}><input type="radio" name="payMode" value="partial" checked={paymentMode==='partial'} onChange={e=>setPaymentMode(e.target.value)} /> Частями (рассрочка)</label>
              </div>
            )}

            <div className="form-group" style={{ marginTop: '20px' }}>
              <label>Промокод</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="text" value={promoCode} onChange={e => setPromoCode(e.target.value)} placeholder="Введите промокод" />
                <button className="btn btn-outline" onClick={applyPromo}>Применить</button>
              </div>
              {promoDiscount > 0 && <p style={{ color: 'var(--green-bright)', marginTop: '8px' }}>✓ Скидка по промокоду: {promoDiscount} ₽</p>}
            </div>

            {/* ИСПРАВЛЕНИЕ 4: бонусы */}
            {user?.bonusPoints > 0 && (
              <div className="form-checkbox">
                <input type="checkbox" id="bonuses" checked={useBonuses} onChange={e => setUseBonuses(e.target.checked)} />
                <label htmlFor="bonuses">Списать бонусы (Доступно: {user.bonusPoints} ₽, скидка {bonusDiscount} ₽)</label>
              </div>
            )}

            <button className="btn btn-primary btn-large" onClick={submitOrder} style={{ width: '100%', marginTop: '20px' }}>
              Подтвердить заказ ({finalTotal} ₽)
            </button>
          </div>
        )}
      </div>
      
      <aside className="cart-sidebar">
        <h3>Ваш заказ</h3>
        {cart.map(item => (
          <div key={item.id} className="summary-row">
            <span>{item.name} × {item.qty}</span>
            <span>{item.price * item.qty} ₽</span>
          </div>
        ))}
        <hr style={{margin: '16px 0', border: '1px solid var(--gray-medium)'}} />
        <div className="summary-row"><span>Товары</span><span>{total} ₽</span></div>
        <div className="summary-row"><span>Доставка</span><span>{deliveryPrice} ₽</span></div>
        {promoDiscount > 0 && <div className="summary-row bonus-row"><span>Промокод</span><span>-{promoDiscount} ₽</span></div>}
        {bonusDiscount > 0 && <div className="summary-row bonus-row"><span>Бонусы</span><span>-{bonusDiscount} ₽</span></div>}
        <div className="summary-row total"><span>Итого</span><span>{finalTotal} ₽</span></div>
      </aside>

      {/* ИСПРАВЛЕНИЕ 5: модалка для гостя */}
      {showAuthModal && (
        <div className="modal-overlay active" onClick={() => setShowAuthModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Необходима авторизация</h2>
              <button className="modal-close" onClick={() => setShowAuthModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p style={{ marginBottom: '20px' }}>Для оформления заказа необходимо войти в систему или зарегистрироваться.</p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Link to="/login" className="btn btn-primary" onClick={() => setShowAuthModal(false)}>Войти</Link>
                <button className="btn btn-outline" onClick={() => setShowAuthModal(false)}>Отмена</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}