import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useState } from 'react';
import axios from 'axios';

const serviceLabels = {
  insurance: 'Страховка (+1%)',
  personalDelivery: 'Вручение лично (+50%)',
  redirection: 'Переадресация (+750 тг)',
  fragile: 'Хрупкий/Стекло (+50%)',
  industrialArea: 'Промзона/пригород (+50%)',
  bubbleWrap: 'Пузырчатая пленка (600 тг/м²)',
  stretchWrap: 'Стрейч пленка (250 тг/м²)',
  plywoodBox: 'Фанерный ящик (30 000 тг)',
  woodenFrame: 'Деревянная обрешетка (18 000 тг/м³)',
  specialPackaging: 'Спец. упаковка',
  addressChange: 'Перенаправление (750 тг)',
  deliveryNoticeOriginal: 'Оригинал уведомления (600 тг)',
  deliveryNoticeScan: 'Скан уведомления (200 тг)',
  extraDeliveryAttempt: 'Доп. попытка доставки (750 тг)',
  courierWaitTruck: 'Ожидание грузовика (5500 тг)',
  courierWaitCar: 'Ожидание легкового (2000 тг)',
};

const initialForm = {
  receiverCompany: '',
  receiverContact: '',
  receiverCountry: '',
  receiverCity: '',
  receiverAddress: '',
  receiverPhone: '',
  senderCompany: '',
  senderContact: '',
  senderCountry: '',
  senderCity: '',
  senderAddress: '',
  senderPhone: '',
  paymentCondition: '',
  paymentForm: '',
  cargoDescription: '',
  places: '',
  weight: '',
  dimensions: { length: '', width: '', height: '' },
  declaredValue: '',
  deliveryPoint: '',
  tariffType: 'EXPRESS',
  deliveryRange: '',
  deliveryMethod: '',
  extraServices: {},
};

const CreateOrder = () => {
  const [form, setForm] = useState(initialForm);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [calcResult, setCalcResult] = useState(null);
  const [orderResult, setOrderResult] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('dimensions.')) {
      const dim = name.split('.')[1];
      setForm((prev) => ({
        ...prev,
        dimensions: { ...prev.dimensions, [dim]: value.replace(/[^0-9.]/g, '') },
      }));
      return;
    }
    if (name === 'weight') {
      setForm((prev) => ({ ...prev, weight: value.replace(/[^0-9.]/g, '') }));
      return;
    }
    if (name.startsWith('extraServices.')) {
      const key = name.split('.')[1];
      setForm((prev) => ({
        ...prev,
        extraServices: { ...prev.extraServices, [key]: checked },
      }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Кнопка "Рассчитать стоимость"
  const handleCalculate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setCalcResult(null);
    setOrderResult(null);
    setCalculating(true);
    try {
      // Подготовим данные для калькулятора
      const calcData = {
        weight: parseFloat(form.weight),
        dimensions: {
          length: parseFloat(form.dimensions.length),
          width: parseFloat(form.dimensions.width),
          height: parseFloat(form.dimensions.height),
        },
        to: form.receiverCity,
        tariffType: form.tariffType,
        deliveryRange: form.deliveryRange,
        deliveryMethod: form.deliveryMethod,
        extraServices: form.extraServices,
      };
      const res = await axios.post('http://localhost:5000/api/calc/calculate', calcData);
      setCalcResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при расчёте');
    } finally {
      setCalculating(false);
    }
  };

  // Кнопка "Создать заказ"
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setOrderResult(null);
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      // Подготовим данные для заказа
      const orderData = {
        ...form,
        weight: parseFloat(form.weight),
        dimensions: {
          length: parseFloat(form.dimensions.length),
          width: parseFloat(form.dimensions.width),
          height: parseFloat(form.dimensions.height),
        },
        extraServices: form.extraServices,
      };
      const res = await axios.post('http://localhost:5000/api/orders/', orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Заказ успешно создан!');
      setOrderResult(res.data);
      setForm(initialForm);
      setCalcResult(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при создании заказа');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container>
      <h2>Создать заказ</h2>
      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleCalculate}>
        <Row>
          <Col>
            <h4>Отправитель</h4>
            <Form.Group><Form.Label>Компания</Form.Label><Form.Control name="senderCompany" value={form.senderCompany} onChange={handleChange} /></Form.Group>
            <Form.Group><Form.Label>Контакт</Form.Label><Form.Control name="senderContact" value={form.senderContact} onChange={handleChange} /></Form.Group>
            <Form.Group><Form.Label>Страна</Form.Label><Form.Control name="senderCountry" value={form.senderCountry} onChange={handleChange} /></Form.Group>
            <Form.Group><Form.Label>Город</Form.Label><Form.Control name="senderCity" value={form.senderCity} onChange={handleChange} /></Form.Group>
            <Form.Group><Form.Label>Адрес</Form.Label><Form.Control name="senderAddress" value={form.senderAddress} onChange={handleChange} /></Form.Group>
            <Form.Group><Form.Label>Телефон</Form.Label><Form.Control name="senderPhone" value={form.senderPhone} onChange={handleChange} /></Form.Group>
          </Col>
          <Col>
            <h4>Получатель</h4>
            <Form.Group><Form.Label>Компания</Form.Label><Form.Control name="receiverCompany" value={form.receiverCompany} onChange={handleChange} /></Form.Group>
            <Form.Group><Form.Label>Контакт</Form.Label><Form.Control name="receiverContact" value={form.receiverContact} onChange={handleChange} /></Form.Group>
            <Form.Group><Form.Label>Страна</Form.Label><Form.Control name="receiverCountry" value={form.receiverCountry} onChange={handleChange} /></Form.Group>
            <Form.Group><Form.Label>Город</Form.Label><Form.Control name="receiverCity" value={form.receiverCity} onChange={handleChange} /></Form.Group>
            <Form.Group><Form.Label>Адрес</Form.Label><Form.Control name="receiverAddress" value={form.receiverAddress} onChange={handleChange} /></Form.Group>
            <Form.Group><Form.Label>Телефон</Form.Label><Form.Control name="receiverPhone" value={form.receiverPhone} onChange={handleChange} /></Form.Group>
          </Col>
        </Row>
        <h4>Параметры груза</h4>
        <Form.Group><Form.Label>Вес (кг)</Form.Label><Form.Control name="weight" value={form.weight} onChange={handleChange} /></Form.Group>
        <Form.Group><Form.Label>Габариты (см)</Form.Label>
          <Row>
            <Col><Form.Control name="dimensions.length" value={form.dimensions.length} onChange={handleChange} placeholder="Длина" /></Col>
            <Col><Form.Control name="dimensions.width" value={form.dimensions.width} onChange={handleChange} placeholder="Ширина" /></Col>
            <Col><Form.Control name="dimensions.height" value={form.dimensions.height} onChange={handleChange} placeholder="Высота" /></Col>
          </Row>
        </Form.Group>
        <Form.Group><Form.Label>Объявленная стоимость</Form.Label><Form.Control name="declaredValue" value={form.declaredValue} onChange={handleChange} /></Form.Group>
        <Form.Group><Form.Label>Описание груза</Form.Label><Form.Control as="textarea" name="cargoDescription" value={form.cargoDescription} onChange={handleChange} /></Form.Group>
        <Form.Group><Form.Label>Тариф</Form.Label>
          <Form.Control as="select" name="tariffType" value={form.tariffType} onChange={handleChange}>
            <option value="EXPRESS">EXPRESS</option>
            <option value="PRIME">PRIME</option>
            <option value="LOCAL">LOCAL</option>
          </Form.Control>
        </Form.Group>
        {form.tariffType === 'LOCAL' && (
          <Form.Group><Form.Label>Зона доставки</Form.Label>
            <Form.Control as="select" name="deliveryRange" value={form.deliveryRange} onChange={handleChange}>
              <option value="">Выберите зону</option>
              <option value="in_city">В пределах города</option>
              <option value="outside_city">До 50 км от города</option>
            </Form.Control>
          </Form.Group>
        )}
        {form.deliveryRange === 'in_city' && (
          <Form.Group><Form.Label>Способ доставки</Form.Label>
            <Form.Control as="select" name="deliveryMethod" value={form.deliveryMethod} onChange={handleChange}>
              <option value="">Выберите способ</option>
              <option value="door_to_door">Дверь — Дверь</option>
              <option value="door_to_postamat">Дверь — Постамат</option>
            </Form.Control>
          </Form.Group>
        )}
        <h4>Дополнительные услуги</h4>
        {Object.keys(serviceLabels).map(key => (
          <Form.Check
            key={key}
            type="checkbox"
            label={serviceLabels[key]}
            name={`extraServices.${key}`}
            checked={!!form.extraServices[key]}
            onChange={handleChange}
          />
        ))}
        <Button type="submit" className="mt-3" disabled={calculating}>Рассчитать стоимость</Button>
      </Form>
      {calcResult && (
        <div style={{ marginTop: 24 }}>
          <h4>Итоговая стоимость: <b>{calcResult.price} тг</b></h4>
          <div>Выбранные услуги:</div>
          <ul>
            {Object.entries(calcResult.extraServices || {}).filter(([k, v]) => v.selected).map(([k, v]) => (
              <li key={k}>{serviceLabels[k] || k} {v.price ? `(+${v.price} тг)` : ''}</li>
            ))}
          </ul>
          <Button className="mt-2" onClick={handleSubmit} disabled={submitting}>Подтвердить и создать заказ</Button>
        </div>
      )}
      {orderResult && (
        <div style={{ marginTop: 24 }}>
          <h4>Заказ создан! Итоговая стоимость: <b>{orderResult.price} тг</b></h4>
          <div>Выбранные услуги:</div>
          <ul>
            {Object.entries(orderResult.extraServices || {}).filter(([k, v]) => v.selected).map(([k, v]) => (
              <li key={k}>{serviceLabels[k] || k} {v.price ? `(+${v.price} тг)` : ''}</li>
            ))}
          </ul>
        </div>
      )}
    </Container>
  );
};

export default CreateOrder;