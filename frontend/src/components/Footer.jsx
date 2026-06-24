import { Link } from 'react-router-dom';
import GoldfishIcon from './GoldfishIcon';
import './Footer.css';

export default function Footer() {
  return (
    <footer role="contentinfo">
      <div className="footer-grid">
        <div className="footer-brand">
          <Link to="/" className="logo" aria-label="Золотая рыбка — на главную">
            <GoldfishIcon size={40} className="logo-icon" />
            <div className="logo-text">Золотая <span>рыбка</span></div>
          </Link>
          <p>АИС дистанционной торговли зоотоварами.</p>
          <p>Персонализация, бонусы и быстрая доставка.</p>
        </div>
        <div className="footer-col">
          <h4>Навигация</h4>
          <ul>
            <li><Link to="/">Главная</Link></li>
            <li><Link to="/catalog">Каталог</Link></li>
            <li><Link to="/promos">Акции</Link></li>
            <li><Link to="/account">Личный кабинет</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Категории</h4>
          <ul>
            <li><Link to="/catalog?cat=cats">Для кошек</Link></li>
            <li><Link to="/catalog?cat=dogs">Для собак</Link></li>
            <li><Link to="/catalog?cat=fish">Для рыб</Link></li>
            <li><Link to="/catalog?cat=birds">Для птиц</Link></li>
            <li><Link to="/catalog?cat=reptiles">Для рептилий</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Контакты</h4>
          <ul>
            <li><a href="tel:+78001234567">8 (800) 123-45-67</a></li>
            <li><a href="mailto:info@goldfish.ru">info@goldfish.ru</a></li>
            <li><Link to="/returns">Возврат товара</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>©АИС-ЗР-2026. Все права защищены.</p>
        <div className="social-links">
          <a href="#" aria-label="ВКонтакте">VK</a>
          <a href="#" aria-label="Telegram">TG</a>
        </div>
      </div>
    </footer>
  );
}