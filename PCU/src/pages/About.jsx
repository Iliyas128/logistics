import React from 'react';
import { FaTruck, FaUsers, FaGlobe, FaAward } from 'react-icons/fa';
import './About.scss';

const About = () => {
  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="about-hero-content">
          <h1>О нашей компании</h1>
          <p>Мы - надежный партнер в сфере логистики с более чем 10-летним опытом</p>
        </div>
      </div>

      <div className="about-content">
        <section className="about-section">
          <h2>Наша миссия</h2>
          <p>
            Мы стремимся сделать доставку простой, быстрой и надежной для каждого клиента.
            Наша цель - обеспечить безупречный сервис и максимальное удовлетворение потребностей
            наших клиентов в сфере логистики.
          </p>
        </section>

        <section className="stats-section">
          <div className="stat-card">
            <FaTruck className="stat-icon" />
            <h3>1000+</h3>
            <p>Ежедневных доставок</p>
          </div>
          <div className="stat-card">
            <FaUsers className="stat-icon" />
            <h3>50,000+</h3>
            <p>Довольных клиентов</p>
          </div>
          <div className="stat-card">
            <FaGlobe className="stat-icon" />
            <h3>200+</h3>
            <p>Стран доставки</p>
          </div>
          <div className="stat-card">
            <FaAward className="stat-icon" />
            <h3>15+</h3>
            <p>Лет опыта</p>
          </div>
        </section>

        <section className="values-section">
          <h2>Наши ценности</h2>
          <div className="values-grid">
            <div className="value-card">
              <h3>Надежность</h3>
              <p>Мы гарантируем безопасную и своевременную доставку ваших посылок</p>
            </div>
            <div className="value-card">
              <h3>Качество</h3>
              <p>Высокие стандарты обслуживания и постоянное совершенствование</p>
            </div>
            <div className="value-card">
              <h3>Инновации</h3>
              <p>Использование современных технологий для улучшения сервиса</p>
            </div>
            <div className="value-card">
              <h3>Клиентоориентированность</h3>
              <p>Индивидуальный подход к каждому клиенту</p>
            </div>
          </div>
        </section>

        <section className="team-section">
          <h2>Наша команда</h2>
          <p>
            За нашими успехами стоит команда профессионалов, которые ежедневно работают над тем,
            чтобы сделать доставку максимально эффективной и удобной для вас.
          </p>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-photo">
                <img src="/images/team/member1.jpg" alt="Team Member" />
              </div>
              <h3>Александр Петров</h3>
              <p>Генеральный директор</p>
            </div>
            <div className="team-member">
              <div className="member-photo">
                <img src="/images/team/member2.jpg" alt="Team Member" />
              </div>
              <h3>Мария Иванова</h3>
              <p>Операционный директор</p>
            </div>
            <div className="team-member">
              <div className="member-photo">
                <img src="/images/team/member3.jpg" alt="Team Member" />
              </div>
              <h3>Дмитрий Сидоров</h3>
              <p>Технический директор</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About; 