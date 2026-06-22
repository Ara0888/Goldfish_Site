import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { allProducts, catalogData } from '../data/catalogData';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';

export default function CatalogPage() {
  const { addToCart } = useCart();
  const { favorites, toggleFavorite } = useFavorites();
  
  const [selectedCat, setSelectedCat] = useState('all');
  const [maxPrice, setMaxPrice] = useState(30000);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'Все категории' },
    { id: 'cats', name: ' Кошки' }, { id: 'dogs', name: '🐶 Собаки' },
    { id: 'fish', name: '🐠 Рыбы' }, { id: 'birds', name: '🦜 Птицы' }, { id: 'reptiles', name: '🦎 Рептилии' }
  ];

  const allBrands = useMemo(() => {
    const brands = new Set();
    Object.values(catalogData).forEach(cat => cat.brands.forEach(b => brands.add(b.trim())));
    return Array.from(brands);
  }, []);

  const filteredProducts = useMemo(() => {
    return allProducts.filter(p => {
      if (selectedCat !== 'all' && p.cat !== selectedCat) return false;
      if (p.price > maxPrice) return false;
      const brand = p.name.split('—')[0].trim();
      if (selectedBrands.length > 0 && !selectedBrands.includes(brand)) return false;
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [selectedCat, maxPrice, selectedBrands, searchQuery]);

  const handleBrandChange = (brand) => {
    setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
  };

  return (
    <div className="catalog-layout">
      <aside className="filter-sidebar">
        <h3>Фильтры</h3>
        
        <div className="form-group">
          <label>🔍 Поиск</label>
          <input 
            type="text" 
            placeholder="Название или бренд..." 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
          />
        </div>

        <div className="form-group">
          <label>Категория</label>
          <select value={selectedCat} onChange={e => setSelectedCat(e.target.value)}>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Макс. цена: {maxPrice} ₽</label>
          <input type="range" min="0" max="30000" step="100" value={maxPrice} onChange={e => setMaxPrice(parseInt(e.target.value))} />
        </div>

        <div className="form-group">
          <label>Бренд</label>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {allBrands.map(brand => (
              <div key={brand} className="form-checkbox">
                <input type="checkbox" id={`brand-${brand}`} checked={selectedBrands.includes(brand)} onChange={() => handleBrandChange(brand)} />
                <label htmlFor={`brand-${brand}`}>{brand}</label>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <div>
        <div className="section-header" style={{ textAlign: 'left', marginBottom: '20px' }}>
          <h2>Каталог <span>товаров</span></h2>
          <p>Найдено: {filteredProducts.length} товаров</p>
        </div>
        <div className="products-grid">
          {filteredProducts.slice(0, 12).map(p => (
            <Link to={`/product/${p.id}`} key={p.id} className="product-card">
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
                  <div>
                    <span className="price">{p.price} ₽</span>
                    {p.oldPrice && <span style={{ textDecoration: 'line-through', color: 'var(--gray-text)', fontSize: '0.9rem', marginLeft: '8px' }}>{p.oldPrice} ₽</span>}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn-cart" style={{ background: favorites.some(f => f.id === p.id) ? '#FF6B6B' : 'var(--green-bright)' }} onClick={(e) => { e.preventDefault(); toggleFavorite(p); }} title="В избранное">
                      {favorites.some(f => f.id === p.id) ? '❤️' : ''}
                    </button>
                    <button className="btn-cart" onClick={(e) => { e.preventDefault(); addToCart(p); }} title="В корзину">🛒</button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}