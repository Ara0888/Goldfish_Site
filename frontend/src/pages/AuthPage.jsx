import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showRecovery, setShowRecovery] = useState(false);
  const [clientType, setClientType] = useState('individual');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', orgName: '' });
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      id: Date.now(),
      name: formData.name || formData.email.split('@')[0],
      email: formData.email,
      role: 'client',
      clientType: clientType,
      orgName: formData.orgName,
      bonusPoints: 0,
      pets: []
    };
    login(userData);
    navigate('/account');
  };

  const handleRecovery = (e) => {
    e.preventDefault();
    setRecoverySent(true);
  };

  if (showRecovery) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>
            Восстановление пароля
          </h2>

          {recoverySent ? (
            <div style={{ textAlign: 'center' }}>
              <p style={{ marginBottom: '20px' }}>
                ✅ Ссылка для восстановления отправлена на{' '}
                <strong>{recoveryEmail}</strong>
              </p>
              <button
                className="btn btn-primary"
                onClick={() => { setShowRecovery(false); setRecoverySent(false); }}
                style={{ width: '100%' }}
              >
                Вернуться ко входу
              </button>
            </div>
          ) : (
            <form onSubmit={handleRecovery} className="auth-form">
              <div className="form-group">
                <label>
                  Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Отправить ссылку
              </button>
              <button
                type="button"
                className="btn btn-outline"
                style={{ width: '100%' }}
                onClick={() => setShowRecovery(false)}
              >
                Назад
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">

        {/* Вкладки */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Вход
          </button>
          <button
            className={`auth-tab ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Регистрация
          </button>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit} className="auth-form">

          {!isLogin && (
            <div className="form-group">
              <label>Тип клиента</label>
              <select
                value={clientType}
                onChange={(e) => setClientType(e.target.value)}
              >
                <option value="individual">Физическое лицо</option>
                <option value="organization">Организация (Приют)</option>
              </select>
            </div>
          )}

          <div className="form-group">
            <label>
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>
                {clientType === 'organization' ? 'Название организации' : 'Имя'}
              </label>
              <input
                type="text"
                value={clientType === 'organization' ? formData.orgName : formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [clientType === 'organization' ? 'orgName' : 'name']: e.target.value
                  })
                }
              />
            </div>
          )}

          <div className="form-group">
            <label>
              Пароль <span className="required">*</span>
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            {isLogin ? 'Войти' : 'Зарегистрироваться'}
          </button>

          {isLogin && (
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setShowRecovery(true)}
            >
              Забыли пароль?
            </button>
          )}
        </form>
      </div>
    </div>
  );
}