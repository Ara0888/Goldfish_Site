import { useState } from 'react';
import { Link } from 'react-router-dom';
import { allProducts, catalogData } from '../data/catalogData';
import { useCart } from '../context/CartContext';

export default function HomePage() {
  const [activeCat, setActiveCat] = useState('cats');
  const { addToCart } = useCart();
  const filteredProducts = allProducts.filter(p => p.cat === activeCat).slice(0, 8);

  const advantages = [
    { icon: '🏆', title: '500+ элитных брендов', desc: 'Farmina, Orijen, Acana, JBL, Exo Terra — только оригинальная продукция' },
    { icon: '🔬', title: 'Подбор по питомцу', desc: 'Система анализирует породу, возраст и особенности здоровья' },
    { icon: '', title: 'Экспресс-доставка', desc: 'Доставка элитных товаров в день заказа по всей России' },
    { icon: '🛡️', title: 'Защита данных (ФЗ-152)', desc: 'Серверы в РФ, шифрование, полная защита персональных данных' },
    { icon: '', title: 'Бонусная программа', desc: 'Накапливайте баллы с каждой покупки и оплачивайте ими до 20% заказа' },
    { icon: '♿', title: 'Доступность для всех', desc: 'Совместимость со скринридерами, масштабирование, высокая контрастность' }
  ];

  return (
    <>
      {/* HERO С АНИМАЦИЕЙ ВОДЫ */}
      <section className="hero">
        <div className="hero-neutral-decor">
          <div className="decor-circle c1"></div>
          <div className="decor-circle c2"></div>
          <div className="decor-circle c3"></div>
          <div className="decor-wave w1"></div>
          <div className="decor-wave w2"></div>
          <div className="decor-dot d1"></div>
          <div className="decor-dot d2"></div>
          <div className="decor-dot d3"></div>
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <h1>Всё для ваших любимых <span>питомцев</span></h1>
            <p>АИС дистанционной торговли элитными зоотоварами. Персонализация, бонусы и быстрая доставка премиальных кормов и аксессуаров.</p>
            <div className="hero-buttons">
              <Link to="/catalog" className="btn btn-primary btn-large">Перейти в каталог</Link>
              <a href="#advantages" className="btn btn-secondary btn-large">Узнать больше</a>
            </div>
          </div>
        </div>
      </section>

      {/* ПРЕИМУЩЕСТВА */}
      <section id="advantages" className="about">
        <div className="section-header">
          <h2>Почему выбирают <span>«Золотую рыбку»</span>?</h2>
          <p>Специализированная система учёта потребностей питомцев. Мы не просто продаём корм — мы подбираем рацион под породу и возраст.</p>
        </div>
        <div className="reviews-grid">
          {advantages.map((adv, idx) => (
            <div key={idx} className="review-card">
              <div className="stars" style={{ fontSize: '48px', marginBottom: '16px' }}>{adv.icon}</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '12px', color: 'var(--navy-dark)' }}>{adv.title}</h3>
              <p className="review-text" style={{ fontStyle: 'normal', lineHeight: 1.6 }}>{adv.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* КАТАЛОГ НА ГЛАВНОЙ */}
      <section id="catalog-preview">
        <div className="section-header">
          <h2>Премиальный <span>каталог</span></h2>
          <p>Только проверенные элитные бренды.</p>
        </div>
        <div className="products-filter">
          {Object.keys(catalogData).map(cat => (
            <button key={cat} className={`filter-btn ${activeCat === cat ? 'active' : ''}`} onClick={() => setActiveCat(cat)}>
              {cat === 'cats' ? '🐱 Кошки' : cat === 'dogs' ? '🐶 Собаки' : cat === 'fish' ? '🐠 Рыбы' : cat === 'birds' ? ' Птицы' : '🦎 Рептилии'}
            </button>
          ))}
        </div>
        <div className="products-grid">
          {filteredProducts.map(p => (
            <Link to={`/product/${p.id}`} key={p.id} className="product-card">
              <div className="product-image">
                <img src={p.image} alt={p.name} loading="lazy" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML += `<span style="font-size: 64px;">${p.icon}</span>`; }} />
              </div>
              <div className="product-info">
                <h3>{p.name}</h3>
                <div className="product-footer">
                  <span className="price">{p.price} ₽</span>
                  <button className="btn-cart" onClick={(e) => { e.preventDefault(); addToCart(p); }} aria-label={`Добавить ${p.name} в корзину`}>🛒</button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}