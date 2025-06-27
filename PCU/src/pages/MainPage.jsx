import React from 'react';
import { Link } from 'react-router-dom';
import { FaTruck, FaMapMarkedAlt, FaClock, FaShieldAlt, FaCalculator, FaUsers, FaEnvelope, FaPhone } from 'react-icons/fa';
import NavbarComp from '../Components/Navbar';
import './MainPage.scss';

const MainPage = () => {
  return (
    <div className="main-page">
      <NavbarComp />
      
      {/* Hero Section */}A
      <section className="hero">
        <div className="hero-bg-video">
          <video
            src="/video/LogisticsStockVideo.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="full-hero-video"
          >
            Ваш браузер не поддерживает видео.
          </video>
        </div>
        <div className="hero-content">
          <h1>Надежная доставка по всему миру</h1>
          <p>
            Мы предлагаем быструю и безопасную доставку ваших посылок в любую точку мира.
            Отслеживайте статус доставки в реальном времени и будьте уверены в сохранности вашего груза.
          </p>
          <div className="hero-buttons">
            <Link to="/track" className="primary-button">
              Отследить посылку
            </Link>
            <Link to="/order" className="secondary-button">
              Создать заказ
            </Link>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section id="calculator" className="calculator-section">
        <div className="calculator-container">
          <div className="calculator-header">
            <FaCalculator className="calculator-icon" />
            <h2>Рассчитать стоимость доставки</h2>
            <p>Узнайте стоимость доставки вашего груза</p>
          </div>
          <div className="calculator-form">
            <div className="form-group">
              <label>Вес (кг)</label>
              <input type="number" placeholder="Введите вес" />
            </div>
            <div className="dimensions-group">
              <div className="form-group">
                <label>Длина (см)</label>
                <input type="number" placeholder="Длина" />
              </div>
              <div className="form-group">
                <label>Ширина (см)</label>
                <input type="number" placeholder="Ширина" />
              </div>
              <div className="form-group">
                <label>Высота (см)</label>
                <input type="number" placeholder="Высота" />
              </div>
            </div>
            <div className="locations-group">
              <div className="form-group">
                <label>Откуда</label>
                <input type="text" placeholder="Город отправления" />
              </div>
              <div className="form-group">
                <label>Куда</label>
                <input type="text" placeholder="Город получения" />
              </div>
            </div>
            <button className="calculate-button">Рассчитать стоимость</button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Наши преимущества</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <FaTruck />
            </div>
            <h3>Быстрая доставка</h3>
            <p>Доставляем ваши посылки в кратчайшие сроки по всему миру</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FaMapMarkedAlt />
            </div>
            <h3>Глобальное покрытие</h3>
            <p>Работаем с более чем 200 странами по всему миру</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FaClock />
            </div>
            <h3>Отслеживание в реальном времени</h3>
            <p>Следите за статусом вашей посылки 24/7</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FaShieldAlt />
            </div>
            <h3>Безопасность</h3>
            <p>Гарантируем сохранность и целостность вашего груза</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="about-hero">
          <h2>О нашей компании</h2>
          <p>Мы - команда профессионалов, которая делает доставку простой и надежной</p>
        </div>
        <div className="about-content">
          <div className="mission">
            <h3>Наша миссия</h3>
            <p>Мы стремимся сделать международную доставку доступной, надежной и прозрачной для каждого клиента.</p>
          </div>
          <div className="stats">
            <div className="stat-card">
              <FaTruck />
              <h4>1000+</h4>
              <p>Доставок в день</p>
            </div>
            <div className="stat-card">
              <FaUsers />
              <h4>50,000+</h4>
              <p>Довольных клиентов</p>
            </div>
            <div className="stat-card">
              <FaMapMarkedAlt />
              <h4>200+</h4>
              <p>Стран</p>
            </div>
            <div className="stat-card">
              <FaClock />
              <h4>10+</h4>
              <p>Лет опыта</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="contact-hero">
          <h2>Связаться с нами</h2>
          <p>Мы всегда готовы ответить на ваши вопросы</p>
        </div>
        <div className="contact-content">
          <div className="contact-info">
            <div className="info-card">
              <FaPhone />
              <h3>Телефон</h3>
              <p>+7 (999) 123-45-67</p>
              <p>+7 (999) 765-43-21</p>
            </div>
            <div className="info-card">
              <FaEnvelope />
              <h3>Email</h3>
              <p>info@logistics.ru</p>
              <p>support@logistics.ru</p>
            </div>
            <div className="info-card">
              <FaMapMarkedAlt />
              <h3>Адрес</h3>
              <p>г. Москва, ул. Примерная, д. 123</p>
            </div>
            <div className="info-card">
              <FaClock />
              <h3>Режим работы</h3>
              <p>Пн-Пт: 9:00 - 18:00</p>
              <p>Сб-Вс: Выходной</p>
            </div>
          </div>
          <div className="contact-form">
            <h3>Напишите нам</h3>
            <form>
              <div className="form-group">
                <label>Ваше имя</label>
                <input type="text" placeholder="Введите ваше имя" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="Введите ваш email" />
              </div>
              <div className="form-group">
                <label>Тема</label>
                <input type="text" placeholder="Введите тему сообщения" />
              </div>
              <div className="form-group">
                <label>Сообщение</label>
                <textarea placeholder="Введите ваше сообщение"></textarea>
              </div>
              <button type="submit" className="submit-button">Отправить сообщение</button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-content">
          <h2>Готовы отправить посылку?</h2>
          <p>Создайте заказ прямо сейчас и получите скидку 10% на первую доставку</p>
          <Link to="/order" className="cta-button">
            Создать заказ
          </Link>
        </div>
      </section>
    </div>
  );
};

export default MainPage;