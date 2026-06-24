import { useState } from 'react';
import { allProducts } from '../data/catalogData';
import { useCart } from '../context/CartContext';
import './PromosPage.css';

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
      <div className="promo-cards-grid">
  {promoCodes.map((promo, idx) => (
    <div key={idx} className="promo-card-item">
      <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--green-bright)', marginBottom: '8px' }}>{promo.code}</div>
      <p style={{ opacity: 0.9, marginBottom: '20px' }}>{promo.desc}</p>
      <button 
        className="btn-copy-code"
        onClick={() => copyCode(promo.code)}
      >
        {copiedCode === promo.code ? '✓ Скопировано' : 'Копировать'}
      </button>
    </div>
  ))}
</div>

      <div className="section-header" style={{ marginTop: '60px' }}>
        <h2>Товары со <span>скидкой</span></h2>
      </div>
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
                <button className="btn-cart" style={{background: '#004200'}} onClick={() => addToCart(p)}>🛒</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}