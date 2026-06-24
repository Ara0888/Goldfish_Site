import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import './ReturnsPage.css';

export default function ReturnsPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ orderId: '', reason: 'defect', comment: '' });
  const [submitted, setSubmitted] = useState(false);

  if (!user) return <Navigate to="/login" />;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ maxWidth: '600px', margin: '60px auto', padding: '40px', textAlign: 'center', background: 'white', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
        <h2>Заявка принята</h2>
        <p style={{ color: 'var(--gray-text)', margin: '20px 0' }}>Мы рассмотрим ваш запрос и свяжемся с вами в течение 24 часов.</p>
        <button className="btn btn-primary" onClick={() => setSubmitted(false)}>Создать новую заявку</button>
      </div>
    );
  }

  return (
    <div className="returns-layout">
      {/* Форма заявки - слева */}
      <div className="cart-list">
        <h2 style={{ marginBottom: '24px' }}>Оформление возврата</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Номер заказа <span className="required">*</span></label>
            <input type="text" required placeholder="Например, 10423" value={formData.orderId} onChange={e => setFormData({...formData, orderId: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Причина возврата <span className="required">*</span></label>
            <select required value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})}>
              <option value="defect">Брак / Повреждение</option>
              <option value="wrong">Не подошел / Ошибка в заказе</option>
              <option value="quality">Низкое качество</option>
              <option value="other">Другое</option>
            </select>
          </div>
          <div className="form-group">
            <label>Комментарий</label>
            <textarea rows="4" placeholder="Опишите ситуацию подробнее..." value={formData.comment} onChange={e => setFormData({...formData, comment: e.target.value})}></textarea>
          </div>
          <button type="submit" className="btn btn-primary btn-large" style={{ width: '100%' }}>Отправить заявку</button>
        </form>
      </div>

      {/* Политика возврата - справа */}
      <div className="returns-info">
        <h3 style={{ marginBottom: '16px' }}>Политика возврата</h3>
        <p style={{ marginBottom: '16px', lineHeight: 1.7 }}>
          Мы заботимся о качестве. Если товар не соответствует ожиданиям, вы можете оформить возврат в течение <strong>14 дней</strong>.
        </p>
        <ul>
          <li>Упаковка кормов не должна быть вскрыта.</li>
          <li>Сохранены все бирки и заводская упаковка.</li>
          <li>Возврат брака — за счет магазина.</li>
          <li>Возврат средств на карту: 3-5 рабочих дней.</li>
        </ul>
      </div>
    </div>
  );
}