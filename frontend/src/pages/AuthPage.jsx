import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showRecovery, setShowRecovery] = useState(false);
  const [clientType, setClientType] = useState('individual');
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    orgName: '' 
  });
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); 
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const API_URL = 'http://127.0.0.1:8000/api';
      const endpoint = isLogin ? '/users/login/' : '/users/register/';
      

      const requestData = {
        email: formData.email,
        password: formData.password,
      };


      if (!isLogin) {
        requestData.username = formData.name || formData.email.split('@')[0];
        requestData.password_confirm = formData.password;
        if (clientType === 'organization') {
          requestData.first_name = formData.orgName;
        } else {
          requestData.first_name = formData.name;
        }
        requestData.phone = '';
      }


      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {

        const errorMessage = Object.values(data).flat().join('\n');
        throw new Error(errorMessage || 'Ошибка при авторизации');
      }


      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      

      login(data.user);
      
      navigate('/account');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
             <div style={{ textAlign: 'center' }} >
               <p style={{ marginBottom: '20px' }} >
                ✅ Ссылка для восстановления отправлена на{' '}
                 <strong >{recoveryEmail} </strong >
               </p >
               <button
                className="btn btn-primary"
                onClick={() => { setShowRecovery(false); setRecoverySent(false); }}
                style={{ width: '100%' }}
               >
                Вернуться ко входу
               </button >
             </div >
          ) : (
             <form onSubmit={handleRecovery} className="auth-form" >
               <div className="form-group" >
                 <label >
                  Email  <span className="required" >* </span >
                 </label >
                 <input
                  type="email"
                  required
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                />
               </div >
               <button type="submit" className="btn btn-primary" style={{ width: '100%' }} >
                Отправить ссылку
               </button >
               <button
                type="button"
                className="btn btn-outline"
                style={{ width: '100%' }}
                onClick={() => setShowRecovery(false)}
               >
                Назад
               </button >
             </form >
          )}
         </div >
       </div >
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">

         <div className="auth-tabs" >
           <button
            className={`auth-tab ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
           >
            Вход
           </button >
           <button
            className={`auth-tab ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
           >
            Регистрация
           </button >
         </div >


         <form onSubmit={handleSubmit} className="auth-form" >

          {!isLogin && (
             <div className="form-group" >
               <label >Тип клиента </label >
               <select
                value={clientType}
                onChange={(e) => setClientType(e.target.value)}
               >
                 <option value="individual" >Физическое лицо </option >
                 <option value="organization" >Организация (Приют) </option >
               </select >
             </div >
          )}

           <div className="form-group" >
             <label >
              Email  <span className="required" >* </span >
             </label >
             <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
           </div >

          {!isLogin && (
             <div className="form-group" >
               <label >
                {clientType === 'organization' ? 'Название организации' : 'Имя'}
               </label >
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
             </div >
          )}

           <div className="form-group" >
             <label >
              Пароль  <span className="required" >* </span >
             </label >
             <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
           </div >


          {error && (
            <div style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>
              {error}
            </div>
          )}

           <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
           >
            {loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
           </button >

          {isLogin && (
             <button
              type="button"
              className="btn btn-outline"
              onClick={() => setShowRecovery(true)}
             >
              Забыли пароль?
             </button >
          )}
         </form >
       </div >
     </div >
  );
}