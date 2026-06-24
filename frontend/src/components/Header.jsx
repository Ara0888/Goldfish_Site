import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import GoldfishIcon from './GoldfishIcon';
import './Header.css';

export default function Header() {
  const { user } = useAuth();
  const { cart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <header role="banner">
      <div className="header-top">
        <Link to="/" className="logo" aria-label="Золотая рыбка - на главную">
          <GoldfishIcon size={40} className="logo-icon" />
          <div className="logo-text">Золотая <span>рыбка</span></div>
        </Link>

        <button 
          className={`burger ${menuOpen ? 'active' : ''}`} 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Меню"
          aria-expanded={menuOpen}
        >
          <span></span><span></span><span></span>
        </button>

        <nav id="main-nav" className={menuOpen ? 'active' : ''} role="navigation" aria-label="Главное меню">
          <Link to="/" onClick={() => setMenuOpen(false)}>Главная</Link>
          <Link to="/catalog" onClick={() => setMenuOpen(false)}>Каталог</Link>
          <Link to="/promos" onClick={() => setMenuOpen(false)}>Акции</Link>
          <Link to="/favorites" onClick={() => setMenuOpen(false)}>❤️ Избранное</Link>
          <Link to={user ? "/account" : "/login"} onClick={() => setMenuOpen(false)}>
            👤 {user ? user.name : 'Войти'}
          </Link>
          <Link to="/cart" className="cart-link" onClick={() => setMenuOpen(false)}>
            🛒 Корзина ({cartCount})
          </Link>
          {user?.role === 'admin' && (
            <Link to="/admin" onClick={() => setMenuOpen(false)}>️ Админ</Link>
          )}
        </nav>
      </div>
    </header>
  );
}