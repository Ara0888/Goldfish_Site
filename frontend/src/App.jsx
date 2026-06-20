import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <header>
        <h1>🐾 Goldfish Site — Всё для твоих питомцев!</h1>
        <nav>
          <a href="#" style={{ marginRight: '15px' }}>Главная</a>
          <a href="#" style={{ marginRight: '15px' }}>Каталог</a>
          <a href="#">Корзина</a>
        </nav>
      </header>

      <main>
        <section>
          <h2>Хиты продаж</h2>
          <p>Лучшие товары по выгодным ценам.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            {/* Карточка товара 1 */}
            <div style={{ border: '1px solid #ddd', padding: '15px', textAlign: 'center' }}>
              <img src="https://placehold.co/200x200/f0f4f8/000?text=Корм" alt="Корм" style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
              <h3>Сухой корм премиум</h3>
              <p style={{ color: '#d9534f', fontWeight: 'bold' }}>1500 ₽</p>
              <button style={{ padding: '8px 16px', backgroundColor: '#5cb85c', color: 'white', border: 'none', cursor: 'pointer' }}>В корзину</button>
            </div>

            {/* Карточка товара 2 */}
            <div style={{ border: '1px solid #ddd', padding: '15px', textAlign: 'center' }}>
               <img src="https://placehold.co/200x200/f0f4f8/000?text=Игрушка" alt="Игрушка" style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
               <h3>Мячик для собаки</h3>
               <p style={{ color: '#d9534f', fontWeight: 'bold' }}>300 ₽</p>
               <button style={{ padding: '8px 16px', backgroundColor: '#5cb85c', color: 'white', border: 'none', cursor: 'pointer' }}>В корзину</button>
            </div>
          </div>
        </section>

        <footer style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #ccc' }}>
          <p>Goldfish Site © 2024. Мы любим животных так же, как и вы!</p>
        </footer>
      </main>
    </div>
  );
}

export default App
