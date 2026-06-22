import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function TrackingPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Имитация API-запроса к Django
    setOrder({
      id: orderId,
      date: '15.10.2026',
      total: 4650,
      items: ['Farmina N&D', 'Acana', 'JBL ProScan'],
      timeline: [
        { status: 'Заказ создан', date: '12.10.2026 10:00', done: true },
        { status: 'Передан в доставку', date: '13.10.2026 14:30', done: true },
        { status: 'В пути', date: '14.10.2026 09:15', done: true, active: true },
        { status: 'Доставлен', date: 'Ожидается 15.10.2026', done: false }
      ]
    });
  }, [orderId]);

  if (!order) return <div style={{padding: '40px', textAlign: 'center'}}>Загрузка...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 5%' }}>
      <div className="cart-list">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2>Заказ №{order.id}</h2>
          <span className="order-status">В пути</span>
        </div>
        
        <div style={{ marginBottom: '24px' }}>
          <p><strong>Дата оформления:</strong> {order.date}</p>
          <p><strong>Сумма:</strong> {order.total} ₽</p>
          <p><strong>Товары:</strong> {order.items.join(', ')}</p>
        </div>

        <h3 style={{ marginBottom: '20px' }}>Статус доставки</h3>
        
        {/* Таймлайн с использованием новых CSS классов */}
        <div className="tracking-timeline">
          {order.timeline.map((step, idx) => (
            <div key={idx} className="timeline-step">
              <div className={`timeline-dot ${step.done ? 'done' : ''} ${step.active ? 'active' : ''}`}></div>
              <div className="timeline-title">{step.status}</div>
              <div className="timeline-date">{step.date}</div>
            </div>
          ))}
        </div>
        
        <Link to="/account" className="btn btn-outline" style={{ marginTop: '20px' }}>Вернуться в личный кабинет</Link>
      </div>
    </div>
  );
}