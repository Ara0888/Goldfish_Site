import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { allProducts } from '../data/catalogData';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';

export default function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { favorites, toggleFavorite } = useFavorites();
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviews, setReviews] = useState([
    { author: 'Анна М.', rating: 5, text: 'Отличный корм, питомец в восторге!', date: '10.10.2026' },
    { author: 'Иван К.', rating: 4, text: 'Хорошее качество, но дороговато.', date: '05.10.2026' }
  ]);

  const product = allProducts.find(p => p.id === parseInt(id));

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <h2>Товар не найден</h2>
        <Link to="/catalog" className="btn btn-primary">Вернуться в каталог</Link>
      </div>
    );
  }

  const specs = [
    { label: 'Бренд', value: product.name.split('—')[0].trim() },
    { label: 'Категория', value: product.cat === 'cats' ? 'Кошки' : product.cat === 'dogs' ? 'Собаки' : product.cat === 'fish' ? 'Рыбы' : product.cat === 'birds' ? 'Птицы' : 'Рептилии' },
    { label: 'Тип', value: 'Премиум' },
    { label: 'Страна', value: 'Италия' },
    { label: 'Вес/Объём', value: product.variation || '1 кг' }
  ];

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    setReviews([{ author: 'Вы', rating: reviewRating, text: reviewText, date: new Date().toLocaleDateString('ru-RU') }, ...reviews]);
    setReviewText('');
  };

  return (
    <div>
      <div className="product-detail">
        <div className="pd-image">
  <img 
    src={product.image} 
    alt={product.name}
    onError={(e) => {
      e.target.style.display = 'none';
      e.target.parentElement.innerHTML += `<span style="font-size: 100px;">${product.icon}</span>`;
    }}
  />
</div>
        <div className="pd-info">
          <h1>{product.name}</h1>
          <p style={{ color: 'var(--gray-text)', marginBottom: '20px' }}>{product.desc}</p>
          <div className="pd-price">{product.price} ₽</div>
          
          <ul className="pd-specs">
            {specs.map((s, i) => (
              <li key={i}><span>{s.label}</span><strong>{s.value}</strong></li>
            ))}
          </ul>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-large" onClick={() => addToCart(product)}>
              🛒 В корзину
            </button>
            <button 
              className="btn btn-outline btn-large" 
              onClick={() => toggleFavorite(product)}
              style={{ background: favorites.some(f => f.id === product.id) ? '#FF6B6B' : 'transparent', color: favorites.some(f => f.id === product.id) ? 'white' : 'var(--navy-dark)', borderColor: favorites.some(f => f.id === product.id) ? '#FF6B6B' : 'var(--blue-medium)' }}
            >
              {favorites.some(f => f.id === product.id) ? '❤️ В избранном' : ' В избранное'}
            </button>
          </div>
        </div>
      </div>

      {/* ОТЗЫВЫ */}
      <section className="reviews-section">
        <div className="section-header">
          <h2>Отзывы <span>покупателей</span></h2>
        </div>
        
        <form onSubmit={handleSubmitReview} style={{ maxWidth: '600px', margin: '0 auto 40px', padding: '24px', background: 'white', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
          <h3 style={{ marginBottom: '16px' }}>Оставить отзыв</h3>
          <div className="form-group">
            <label>Оценка</label>
            <select value={reviewRating} onChange={e => setReviewRating(parseInt(e.target.value))}>
              <option value="5">⭐⭐⭐⭐⭐ (5)</option>
              <option value="4">⭐⭐⭐⭐ (4)</option>
              <option value="3">⭐⭐⭐ (3)</option>
              <option value="2">⭐⭐ (2)</option>
              <option value="1">⭐ (1)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Комментарий</label>
            <textarea rows="4" value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="Ваш отзыв..."></textarea>
          </div>
          <button type="submit" className="btn btn-primary">Отправить отзыв</button>
        </form>

        <div className="reviews-grid">
          {reviews.map((r, i) => (
            <div key={i} className="review-card">
              <div className="stars">{'⭐'.repeat(r.rating)}</div>
              <p className="review-text">"{r.text}"</p>
              <div className="review-author">
                <span>{r.author}</span>
                <span style={{ color: 'var(--gray-text)', fontWeight: 400, marginLeft: 'auto' }}>{r.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}