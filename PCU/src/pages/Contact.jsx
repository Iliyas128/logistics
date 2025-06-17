import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import './Contact.scss';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Здесь будет ваша логика отправки формы
    console.log('Form submitted:', formData);
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <div className="contact-hero-content">
          <h1>Связаться с нами</h1>
          <p>Мы всегда готовы помочь вам с любыми вопросами</p>
        </div>
      </div>

      <div className="contact-content">
        <div className="contact-info">
          <div className="info-card">
            <FaPhone className="info-icon" />
            <h3>Телефон</h3>
            <p>+7 (999) 123-45-67</p>
            <p>+7 (999) 765-43-21</p>
          </div>
          <div className="info-card">
            <FaEnvelope className="info-icon" />
            <h3>Email</h3>
            <p>info@logistics.com</p>
            <p>support@logistics.com</p>
          </div>
          <div className="info-card">
            <FaMapMarkerAlt className="info-icon" />
            <h3>Адрес</h3>
            <p>г. Москва, ул. Примерная, д. 123</p>
            <p>Бизнес-центр "Логистик"</p>
          </div>
          <div className="info-card">
            <FaClock className="info-icon" />
            <h3>Режим работы</h3>
            <p>Пн-Пт: 9:00 - 18:00</p>
            <p>Сб-Вс: Выходной</p>
          </div>
        </div>

        <div className="contact-form-container">
          <h2>Отправить сообщение</h2>
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label>Ваше имя</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Введите ваше имя"
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Введите ваш email"
                required
              />
            </div>
            <div className="form-group">
              <label>Тема</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Введите тему сообщения"
                required
              />
            </div>
            <div className="form-group">
              <label>Сообщение</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Введите ваше сообщение"
                required
                rows="5"
              />
            </div>
            <button type="submit" className="submit-button">
              Отправить сообщение
            </button>
          </form>
        </div>
      </div>

      <div className="map-container">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2244.7721980625!2d37.61842331590148!3d55.75621998055754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46b54a50b315e573%3A0xa886bf5a3d9b2e68!2z0JzQvtGB0LrQvtCy0YHQutC40Lkg0JrRgNC10LzQu9GM!5e0!3m2!1sru!2sru!4v1620000000000!5m2!1sru!2sru"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          title="Office Location"
        />
      </div>
    </div>
  );
};

export default Contact; 