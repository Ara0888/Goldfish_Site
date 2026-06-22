import { useState } from 'react';
import { allProducts } from '../data/catalogData';
import { useCart } from '../context/CartContext';

export default function PromosPage() {
  const { addToCart } = useCart();
  const [copiedCode, setCopiedCode] = useState('');

  const promoCodes = [
    { code: 'WELCOME10', desc: 'Скидка 10% на первый заказ' },
    { code: 'FISH2026', desc: 'Скидка 500₽ на товары для рыб' },
    { code: 'PREMIUM', desc: 'Доставка в подарок от 5000₽' }
  ];

  const saleProducts = allProducts.filter(p => p.oldPrice !== null).slice(0, 8);

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '40px auto', padding: '0 5%' }}>
      <div className="section-header">
        <h2>Акции и <span>скидки</span></h2>
      </div>

      {/* Сетка промокодов */}
      <div className="promo-grid">
        {promoCodes.map((promo, idx) => (
          <div key={idx} className="promo-card">
            <div className="promo-code">{promo.code}</div>
            <p style={{ opacity: 0.9, marginBottom: '20px' }}>{promo.desc}</p>
            <button 
              className="btn btn-secondary" 
              onClick={() => copyCode(promo.code)}
              style={{ 
                background: copiedCode === promo.code ? 'var(--green-bright)' : 'transparent', 
                color: copiedCode === promo.code ? 'var(--navy-dark)' : 'var(--green-bright)', 
                borderColor: 'var(--green-bright)' 
              }}
            >
              {copiedCode === promo.code ? '✓ Скопировано' : 'Копировать'}
            </button>
          </div>
        ))}
      </div>

      <div className="section-header"><h2>Товары со <span>скидкой</span></h2></div>
      <div className="products-grid">
        {saleProducts.map(p => (
          <div key={p.id} className="product-card">
            <div className="product-image">
              {p.icon}
              <span className="badge sale">Скидка</span>
            </div>
            <div className="product-info">
              <h3>{p.name}</h3>
              <div className="product-footer">
                <div>
                  <span className="price">{p.price} ₽</span>
                  <span style={{ textDecoration: 'line-through', color: 'var(--gray-text)', fontSize: '0.9rem', marginLeft: '8px' }}>{p.oldPrice} ₽</span>
                </div>
                <button className="btn-cart" onClick={() => addToCart(p)}>🛒</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}