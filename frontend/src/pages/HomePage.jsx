import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

export default function HomePage() {
  const bubbles = [
    { size: '12px', left: '8%', delay: '0s', duration: '14s' },
    { size: '24px', left: '18%', delay: '2s', duration: '18s' },
    { size: '16px', left: '32%', delay: '4s', duration: '12s' },
    { size: '32px', left: '45%', delay: '1s', duration: '22s' },
    { size: '20px', left: '60%', delay: '7s', duration: '15s' },
    { size: '28px', left: '75%', delay: '3s', duration: '19s' },
    { size: '16px', left: '88%', delay: '5s', duration: '13s' },
  ];

  return (
    <div className="homepage-container">
      <section className="hero-section">
        <div className="bubbles-container">
          {bubbles.map((b, i) => (
            <div
              key={i}
              className="bubble"
              style={{
                width: b.size,
                height: b.size,
                left: b.left,
                animationDelay: b.delay,
                animationDuration: b.duration,
              }}
            />
          ))}
        </div>

        <div className="hero-grid">

          <div className="hero-left">
            <h1 className="hero-title">
              Всё для ваших <br />
              любимых <br />
              <span>питомцев</span>
            </h1>
            
            <div className="hero-buttons">
              <Link to="/catalog" className="btn-green">
                Перейти в каталог
              </Link>
              <Link to="/promos" className="btn-blue">
                Узнать больше
              </Link>
            </div>
          </div>

          <div className="hero-right">
            АИС дистанционной торговли зоотоварами. 
            Персонализация, бонусы и быстрая доставка кормов и аксессуаров.
          </div>

        </div>

        <div className="waves-container">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path 
              d="M0,60 C150,100 350,20 500,60 C650,100 850,20 1000,60 C1150,100 1350,20 1500,60 C1650,100 1850,20 2000,60 C2150,100 2350,20 2400,60 L2400,120 L0,120 Z" 
              fill="#ffffff" 
              className="wave-single"
            />
          </svg>
        </div>
      </section>

      <section className="advantages-section">
        <div className="adv-container">
          
          <div className="adv-header">
            <h2>Почему выбирают <span>«Золотую рыбку»</span>?</h2>
            <p>Специализированная система учета потребностей питомцев.</p>
            <p>Мы не просто продаем корма — мы подбираем рацион под породу и возраст.</p>
          </div>

          <div className="adv-grid">
            

            <div className="card card-darkblue">
              <div>
                <div className="card-icon">🏆</div>
                <h3>Множество брендов</h3>
                <p>
                  Farmina, Orijen, Acana, Hill's, Royal Canin — только оригинальная сертифицированная продукция с ветеринарным контролем.
                </p>
              </div>
            </div>

            <div className="card card-green">
              <div>
                <div className="card-icon">🔬</div>
                <h3>Подбор по питомцу</h3>
                <p>
                  Индивидуальный подбор рациона под здоровье вашего любимца: система анализирует породу, возраст и особенности здоровья.
                </p>
              </div>
            </div>

            <div className="card card-blue">
              <div>
                <div className="card-icon">⚡</div>
                <h3>Экспресс-доставка</h3>
                <p>
                  Доставка зоотоваров в день заказа. Мы ценим ваше время и гарантируем свежесть кормов.
                </p>
              </div>
            </div>


            <div className="card card-navy">
              <div>
                <div className="card-icon">🎁</div>
                <h3>Бонусная программа</h3>
                <p>
                  Накапливайте баллы с каждой покупки и оплачивайте ими до 30% заказа. Забота о питомце становится еще выгоднее.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}