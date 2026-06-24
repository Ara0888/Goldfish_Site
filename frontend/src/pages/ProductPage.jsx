import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { allProducts } from '../data/catalogData';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import './ProductPage.css';

export default function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { favorites, toggleFavorite } = useFavorites();
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [imgError, setImgError] = useState(false);
  const [reviews, setReviews] = useState([
    { author: 'Анна М.', rating: 5, text: 'Отличный корм, питомец в восторге!', date: '10.01.2026' },
    { author: 'Иван К.', rating: 4, text: 'Хорошее качество, но дороговато.', date: '05.04.2026' }
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
    <div className="product-detail-page">
      {/* Хлебные крошки */}
      <div className="product-breadcrumb">
        <Link to="/">Главная</Link> <span>/</span> <Link to="/catalog">Каталог</Link> <span>/</span> {product.name}
      </div>

      <div className="product-detail-grid">
        {/* Галерея */}
        <div className="product-gallery">
          <div className="product-main-image">
            {!imgError ? (
              <img src={product.image} alt={product.name} onError={() => setImgError(true)} />
            ) : (
              <span style={{ fontSize: '100px' }}>{product.icon}</span>
            )}
          </div>
          <div className="product-thumbnails">
            <div className="thumbnail active">
              {!imgError ? (
                <img src={product.image} alt={product.name} onError={() => setImgError(true)} />
              ) : (
                <span style={{ fontSize: '40px' }}>{product.icon}</span>
              )}
            </div>
          </div>
        </div>

        {/* Информация о товаре */}
        <div className="product-info-section">
          <h1 className="product-title">{product.name}</h1>
          
          <div className="product-rating">
            <div className="stars-rating">★★★★★</div>
            <span className="reviews-count">({reviews.length} отзывов)</span>
          </div>

          <div className="product-sku">Артикул: {product.id}</div>

          <div className="product-price-block">
            <div className="product-current-price">{product.price} ₽</div>
            {product.oldPrice && <div className="product-old-price">{product.oldPrice} ₽</div>}
            {product.discount && <div className="product-discount">-{product.discount}%</div>}
          </div>

          <p className="product-description">{product.desc}</p>

          <div className="product-specs">
            <h3>Характеристики</h3>
            {specs.map((s, i) => (
              <div key={i} className="spec-item">
                <span className="spec-label">{s.label}</span>
                <span className="spec-value">{s.value}</span>
              </div>
            ))}
          </div>

          <div className="product-actions">
            <button className="btn btn-primary" onClick={() => addToCart(product)}>🛒 В корзину</button>
            <button 
              className="btn btn-outline btn-favorite" 
              onClick={() => toggleFavorite(product)}
              style={{ 
                background: favorites.some(f => f.id === product.id) ? '#FF6B6B' : 'transparent', 
                color: favorites.some(f => f.id === product.id) ? 'white' : 'var(--navy-dark)', 
                borderColor: favorites.some(f => f.id === product.id) ? '#FF6B6B' : 'var(--blue-medium)' 
              }}
            >
              {favorites.some(f => f.id === product.id) ? 'В избранном ❤️' : 'В избранное ❤️'}
            </button>
          </div>
        </div>
      </div>

      {/* Табы с отзывами */}
      <div className="product-tabs">
        <div className="tabs-nav">
          <button className="tab-button active">Отзывы покупателей</button>
          <button className="tab-button">Описание</button>
        </div>
        <div className="tab-content">
          <form onSubmit={handleSubmitReview} className="review-form">
            <h3 style={{ marginBottom: '16px', color: 'var(--navy-dark)' }}>Оставить отзыв</h3>
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
                <div className="stars" style={{ color: 'var(--green-bright)', marginBottom: '10px' }}>{'⭐'.repeat(r.rating)}</div>
                <p className="review-text">"{r.text}"</p>
                <div className="review-author">
                  <span>{r.author}</span>
                  <span>{r.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}