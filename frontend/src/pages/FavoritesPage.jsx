import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';

export default function FavoritesPage() {
  const { favorites, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();

  if (favorites.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <h2>В избранном пока пусто</h2>
        <p style={{ color: 'var(--gray-text)', margin: '20px 0' }}>Нажмите на сердечко 🤍 в каталоге, чтобы добавлять товары сюда.</p>
        <Link to="/catalog" className="btn btn-primary btn-large">Перейти в каталог</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '40px auto', padding: '0 5%' }}>
      <div className="section-header">
        <h2>Избранные <span>товары</span></h2>
      </div>
      <div className="products-grid">
        {favorites.map(p => (
          <div key={p.id} className="product-card">
            <div className="product-image">
  <img 
    src={p.image} 
    alt={p.name}
    loading="lazy"
    onError={(e) => {
      // Если фото не загрузилось, показываем эмодзи
      e.target.style.display = 'none';
      e.target.parentElement.innerHTML += `<span style="font-size: 64px;">${p.icon}</span>`;
    }}
  />
  {p.badge && <span className={`badge ${p.badge === 'Хит' ? '' : 'sale'}`}>{p.badge}</span>}
</div>
            <div className="product-info">
              <h3>{p.name}</h3>
              <div className="product-footer">
                <span className="price">{p.price} ₽</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn-cart" style={{ background: '#FF6B6B' }} onClick={() => toggleFavorite(p)} title="Убрать">❤️</button>
                  <button className="btn-cart" onClick={() => addToCart(p)} title="В корзину">🛒</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}