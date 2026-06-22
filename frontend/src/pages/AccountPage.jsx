import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { petTypes } from '../data/petData';

export default function AccountPage() {
  const { user, logout, addPet } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPetForm, setShowPetForm] = useState(false);
  const [petData, setPetData] = useState({ type: 'cat', breed: '', name: '', birthDate: '', specialNeeds: '' });

  if (!user) return <Navigate to="/login" />;

  const handleAddPet = (e) => {
    e.preventDefault();
    addPet(petData);
    setShowPetForm(false);
    setPetData({ type: 'cat', breed: '', name: '', birthDate: '', specialNeeds: '' });
  };

  const currentPetType = petTypes.find(t => t.id === petData.type);

  return (
    <div className="lk-layout">
      <aside className="lk-menu">
        <a href="#profile" className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>👤 Мой профиль</a>
        <a href="#pets" className={activeTab === 'pets' ? 'active' : ''} onClick={() => setActiveTab('pets')}>🐾 Мои питомцы</a>
        <a href="#orders" className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>📦 История заказов</a>
        <a href="#bonuses" className={activeTab === 'bonuses' ? 'active' : ''} onClick={() => setActiveTab('bonuses')}>🎁 Бонусы ({user.bonusPoints})</a>
        <button onClick={logout} className="btn btn-outline" style={{marginTop: '20px', width: '100%'}}>Выйти</button>
      </aside>
      
      <main className="lk-content">
        {activeTab === 'profile' && (
          <>
            <div className="account-header">
              <div className="account-avatar">{user.name[0].toUpperCase()}</div>
              <div>
                <div className="account-name">{user.name}</div>
                <div className="account-email">{user.email} • {user.clientType === 'organization' ? 'Организация' : 'Физ. лицо'}</div>
              </div>
            </div>
            <h3>Настройки профиля</h3>
            <p style={{ color: 'var(--gray-text)' }}>Здесь можно изменить личные данные.</p>
          </>
        )}

        {activeTab === 'pets' && (
          <>
            <h3>Профили питомцев</h3>
            <p style={{color: 'var(--gray-text)', marginBottom: '16px'}}>Система подберёт рацион на основе этих данных и отметит неподходящие товары.</p>
            
            {user.pets?.map(pet => (
              <div key={pet.id} className="pet-item">
                <div className="pet-item-info">
                  <strong>{pet.name}</strong>
                  <span>{pet.type} • {pet.breed} • {pet.birthDate || 'возраст не указан'}</span>
                  {pet.specialNeeds && <span style={{ display: 'block', color: '#FF6B6B', fontSize: '0.8rem', marginTop: '4px' }}>️ {pet.specialNeeds}</span>}
                </div>
              </div>
            ))}

            {showPetForm ? (
              <form onSubmit={handleAddPet} style={{marginTop: '16px', padding: '16px', background: 'var(--gray-light)', borderRadius: '8px'}}>
                <div className="form-group">
                  <label>Кличка <span className="required">*</span></label>
                  <input required value={petData.name} onChange={e => setPetData({...petData, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Тип животного <span className="required">*</span></label>
                  <select value={petData.type} onChange={e => setPetData({...petData, type: e.target.value, breed: ''})}>
                    {petTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Порода <span className="required">*</span></label>
                  <select required value={petData.breed} onChange={e => setPetData({...petData, breed: e.target.value})}>
                    <option value="">Выберите породу</option>
                    {currentPetType?.breeds.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Дата рождения</label>
                  <input type="date" value={petData.birthDate} onChange={e => setPetData({...petData, birthDate: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Особенности (аллергии, диеты, заболевания)</label>
                  <textarea rows="3" placeholder="Например: аллергия на курицу, диабет, проблемы с почками..." value={petData.specialNeeds} onChange={e => setPetData({...petData, specialNeeds: e.target.value})}></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Сохранить питомца</button>
              </form>
            ) : (
              <button className="btn btn-outline" onClick={() => setShowPetForm(true)}>+ Добавить питомца</button>
            )}
          </>
        )}

        {activeTab === 'orders' && (
          <>
            <h3>История заказов</h3>
            <p style={{ color: 'var(--gray-text)' }}>Здесь будут отображаться ваши заказы.</p>
            <div className="order-item">
              <div className="order-header">
                <span>Заказ №10423</span>
                <span className="order-status">Доставлен</span>
              </div>
              <div className="order-items">Farmina N&D, Acana</div>
              <button className="btn-repeat">Повторить заказ</button>
            </div>
          </>
        )}

        {activeTab === 'bonuses' && (
          <>
            <h3>Бонусная программа</h3>
            <div style={{ padding: '24px', background: 'linear-gradient(135deg, var(--navy-dark), var(--blue-medium))', color: 'white', borderRadius: 'var(--radius)', marginBottom: '20px' }}>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--green-bright)' }}>{user.bonusPoints}</div>
              <div>бонусных баллов</div>
            </div>
            <p style={{ color: 'var(--gray-text)' }}>Начисляется 5% от суммы каждого заказа. Можно оплатить до 20% покупки бонусами.</p>
          </>
        )}
      </main>
    </div>
  );
}