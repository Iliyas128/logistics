import React, { useState } from 'react';
import { FaWeight, FaRuler, FaMapMarkerAlt, FaCalculator } from 'react-icons/fa';
import './Calculator.scss';

const Calculator = () => {
  const [formData, setFormData] = useState({
    weight: '',
    dimensions: {
      length: '',
      width: '',
      height: ''
    },
    from: '',
    to: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('dimensions.')) {
      const dimension = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        dimensions: {
          ...prev.dimensions,
          [dimension]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Здесь будет ваша логика расчета стоимости
    console.log('Form submitted:', formData);
  };

  return (
    <div className="calculator-page">
      <div className="calculator-container">
        <div className="calculator-header">
          <FaCalculator className="calculator-icon" />
          <h1>Калькулятор стоимости доставки</h1>
          <p>Рассчитайте стоимость доставки вашей посылки</p>
        </div>

        <form onSubmit={handleSubmit} className="calculator-form">
          <div className="form-group">
            <label>
              <FaWeight className="input-icon" />
              Вес посылки (кг)
            </label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              placeholder="Введите вес"
              required
            />
          </div>

          <div className="dimensions-group">
            <h3>Габариты посылки (см)</h3>
            <div className="dimensions-inputs">
              <div className="form-group">
                <label>Длина</label>
                <input
                  type="number"
                  name="dimensions.length"
                  value={formData.dimensions.length}
                  onChange={handleInputChange}
                  placeholder="Длина"
                  required
                />
              </div>
              <div className="form-group">
                <label>Ширина</label>
                <input
                  type="number"
                  name="dimensions.width"
                  value={formData.dimensions.width}
                  onChange={handleInputChange}
                  placeholder="Ширина"
                  required
                />
              </div>
              <div className="form-group">
                <label>Высота</label>
                <input
                  type="number"
                  name="dimensions.height"
                  value={formData.dimensions.height}
                  onChange={handleInputChange}
                  placeholder="Высота"
                  required
                />
              </div>
            </div>
          </div>

          <div className="locations-group">
            <div className="form-group">
              <label>
                <FaMapMarkerAlt className="input-icon" />
                Откуда
              </label>
              <input
                type="text"
                name="from"
                value={formData.from}
                onChange={handleInputChange}
                placeholder="Город отправления"
                required
              />
            </div>
            <div className="form-group">
              <label>
                <FaMapMarkerAlt className="input-icon" />
                Куда
              </label>
              <input
                type="text"
                name="to"
                value={formData.to}
                onChange={handleInputChange}
                placeholder="Город получения"
                required
              />
            </div>
          </div>

          <button type="submit" className="calculate-button">
            Рассчитать стоимость
          </button>
        </form>

        <div className="calculator-info">
          <div className="info-card">
            <h3>Как рассчитывается стоимость?</h3>
            <p>Стоимость доставки зависит от веса, габаритов посылки и расстояния между пунктами отправления и получения.</p>
          </div>
          <div className="info-card">
            <h3>Дополнительные услуги</h3>
            <p>Вы можете выбрать дополнительные услуги, такие как страхование, срочная доставка или упаковка.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator; 