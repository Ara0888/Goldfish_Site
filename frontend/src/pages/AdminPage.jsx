import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { allProducts } from '../data/catalogData';
import './AdminPage.css';

export default function AdminPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState(allProducts.slice(0, 10)); 
  const [showForm, setShowForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', cat: 'cats' });

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  const handleDelete = (id) => {
    if (window.confirm('Удалить этот товар?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const product = {
      id: Date.now(),
      name: newProduct.name,
      price: parseInt(newProduct.price),
      cat: newProduct.cat,
      icon: '📦',
      desc: 'Новый товар'
    };
    setProducts([product, ...products]);
    setShowForm(false);
    setNewProduct({ name: '', price: '', cat: 'cats' });
  };

  return (
    <div className="admin-layout">
      <div className="admin-header">
        <h2>⚙️ Панель администратора</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Отмена' : '+ Добавить товар'}
        </button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={handleAdd}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Название</label>
            <input required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Цена (₽)</label>
            <input type="number" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Категория</label>
            <select value={newProduct.cat} onChange={e => setNewProduct({...newProduct, cat: e.target.value})}>
              <option value="cats">Кошки</option>
              <option value="dogs">Собаки</option>
              <option value="fish">Рыбы</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{height: '46px'}}>Сохранить</button>
        </form>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Категория</th>
            <th>Цена</th>
            <th style={{ textAlign: 'right' }}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.icon} {p.name}</td>
              <td style={{ textTransform: 'capitalize' }}>{p.cat}</td>
              <td style={{ fontWeight: 600 }}>{p.price} ₽</td>
              <td style={{ textAlign: 'right' }}>
                <button className="btn btn-sm btn-outline" style={{ marginRight: '8px' }}>Ред.</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}