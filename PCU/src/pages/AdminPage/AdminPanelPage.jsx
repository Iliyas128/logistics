import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Form, Button, Row, Col, Alert } from 'react-bootstrap';

const serviceLabels = {
  insurance: 'Страховка (+1%)',
  personalDelivery: 'Вручение лично (+50%)',
  redirection: 'Переадресация (+750 тг)',
  fragile: 'Хрупкий/Стекло (+50%)',
  industrialArea: 'Промзона/пригород (+50%)',
  bubbleWrap: 'Пузырчатая пленка (600 тг/м²)',
  stretchWrap: 'Стрейч пленка (250 тг/m²)',
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

export default function AdminPanelPage() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState({ senderCity: '', receiverCity: '' });
  const [editOrder, setEditOrder] = useState(null);
  const [editServices, setEditServices] = useState({});
  const [statusEdit, setStatusEdit] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    orderNumber: '',
    receiverCompany: '', receiverContact: '', receiverCountry: '', receiverCity: '', receiverAddress: '', receiverPhone: '',
    senderCompany: '', senderContact: '', senderCountry: '', senderCity: '', senderAddress: '', senderPhone: '',
    paymentCondition: '', paymentForm: '', cargoDescription: '', places: '', weight: '',
    dimensions: { length: '', width: '', height: '' }, declaredValue: '', deliveryPoint: '',
    tariffType: 'EXPRESS', deliveryRange: '', deliveryMethod: '', extraServices: {},
  });
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState('');
  const [creating, setCreating] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [detailsOrder, setDetailsOrder] = useState(null);

  // Получить токен админа
  const token = localStorage.getItem('token');

  // Загрузка заказов с фильтрацией
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter.senderCity) params.senderCity = filter.senderCity;
      if (filter.receiverCity) params.receiverCity = filter.receiverCity;
      const res = await axios.get('http://localhost:5000/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setOrders(res.data);
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [filter]);

  // Открыть форму редактирования услуг
  const openEdit = (order) => {
    setEditOrder(order);
    setEditServices(
      Object.fromEntries(
        Object.entries(order.extraServices || {}).map(([k, v]) => [k, v.selected])
      )
    );
  };

  // Сохранить изменения услуг
  const saveEdit = async () => {
    try {
      setLoading(true);
      const res = await axios.patch(
        `http://localhost:5000/api/admin/orders/${editOrder._id}/services`,
        { extraServices: editServices },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditOrder(null);
      fetchOrders();
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  // Изменить статус заказа
  const changeStatus = async (order, newStatus) => {
    try {
      setLoading(true);
      await axios.patch(
        `http://localhost:5000/api/admin/orders/${order._id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  // Открыть детали заказа
  const openDetails = (order) => {
    setDetailsOrder(order);
    setShowDetails(true);
  };

  // Уникальные города для фильтра
  const senderCities = Array.from(new Set(orders.map(o => o.senderCity))).filter(Boolean);
  const receiverCities = Array.from(new Set(orders.map(o => o.receiverCity))).filter(Boolean);

  const handleCreateChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('dimensions.')) {
      const dim = name.split('.')[1];
      setCreateForm((prev) => ({ ...prev, dimensions: { ...prev.dimensions, [dim]: value.replace(/[^0-9.]/g, '') } }));
      return;
    }
    if (name === 'weight') {
      setCreateForm((prev) => ({ ...prev, weight: value.replace(/[^0-9.]/g, '') }));
      return;
    }
    if (name.startsWith('extraServices.')) {
      const key = name.split('.')[1];
      setCreateForm((prev) => ({ ...prev, extraServices: { ...prev.extraServices, [key]: checked } }));
      return;
    }
    setCreateForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setCreateError(''); setCreateSuccess(''); setCreating(true);
    try {
      const token = localStorage.getItem('token');
      const orderData = {
        ...createForm,
        weight: parseFloat(createForm.weight),
        dimensions: {
          length: parseFloat(createForm.dimensions.length),
          width: parseFloat(createForm.dimensions.width),
          height: parseFloat(createForm.dimensions.height),
        },
        extraServices: createForm.extraServices,
      };
      await axios.post('http://localhost:5000/api/admin/orders', orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCreateSuccess('Заказ создан!');
      setShowCreate(false);
      setCreateForm({
        orderNumber: '', receiverCompany: '', receiverContact: '', receiverCountry: '', receiverCity: '', receiverAddress: '', receiverPhone: '',
        senderCompany: '', senderContact: '', senderCountry: '', senderCity: '', senderAddress: '', senderPhone: '',
        paymentCondition: '', paymentForm: '', cargoDescription: '', places: '', weight: '',
        dimensions: { length: '', width: '', height: '' }, declaredValue: '', deliveryPoint: '',
        tariffType: 'EXPRESS', deliveryRange: '', deliveryMethod: '', extraServices: {},
      });
      fetchOrders();
    } catch (err) {
      setCreateError(err.response?.data?.message || 'Ошибка при создании заказа');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Админ-панель заказов</h1>
      <Button variant="success" style={{ marginBottom: 16 }} onClick={() => setShowCreate(true)}>Создать заказ</Button>
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      <div style={{ marginBottom: 16 }}>
        <label>Город отправителя: </label>
        <select value={filter.senderCity} onChange={e => setFilter(f => ({ ...f, senderCity: e.target.value }))}>
          <option value=''>Все</option>
          {senderCities.map(city => <option key={city} value={city}>{city}</option>)}
        </select>
        <label style={{ marginLeft: 16 }}>Город получателя: </label>
        <select value={filter.receiverCity} onChange={e => setFilter(f => ({ ...f, receiverCity: e.target.value }))}>
          <option value=''>Все</option>
          {receiverCities.map(city => <option key={city} value={city}>{city}</option>)}
        </select>
      </div>
      {loading ? <div>Загрузка...</div> : (
        <table border={1} cellPadding={6} style={{ width: '100%', background: '#fff' }}>
          <thead>
            <tr>
              <th>№</th>
              <th>Отправитель</th>
              <th>Получатель</th>
              <th>Города</th>
              <th>Услуги</th>
              <th>Цена</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={order._id} style={{ cursor: 'pointer' }} onClick={() => openDetails(order)}>
                <td>{order.orderNumber}</td>
                <td>{order.senderCompany}<br/>{order.senderContact}</td>
                <td>{order.receiverCompany}<br/>{order.receiverContact}</td>
                <td>{order.senderCity} → {order.receiverCity}</td>
                <td>
                  <ul style={{ margin: 0, paddingLeft: 16 }}>
                    {Object.entries(order.extraServices || {}).filter(([k, v]) => v.selected).map(([k, v]) => (
                      <li key={k}>{serviceLabels[k] || k} {v.price ? `(+${v.price} тг)` : ''}</li>
                    ))}
                  </ul>
                </td>
                <td><b>{order.price} тг</b></td>
                <td>
                  <select value={order.status} onChange={e => changeStatus(order, e.target.value)} onClick={e => e.stopPropagation()}>
                    {['новый','получен складом','планируется отправка','отправлено со склада','Забран у перевозчика','Доставлен'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <button onClick={e => { e.stopPropagation(); openEdit(order); }}>Редактировать услуги</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Modal show={showCreate} onHide={() => setShowCreate(false)} size="lg" backdrop="static">
        <Modal.Header closeButton><Modal.Title>Создать заказ (админ)</Modal.Title></Modal.Header>
        <Modal.Body>
          {createError && <Alert variant="danger">{createError}</Alert>}
          {createSuccess && <Alert variant="success">{createSuccess}</Alert>}
          <Form onSubmit={handleCreateOrder}>
            <Form.Group><Form.Label>Номер заказа (6 цифр)</Form.Label>
              <Form.Control name="orderNumber" value={createForm.orderNumber} onChange={handleCreateChange} maxLength={6} required pattern="[0-9]{6}" /></Form.Group>
            <Row>
              <Col>
                <h5>Отправитель</h5>
                <Form.Group><Form.Label>Компания</Form.Label><Form.Control name="senderCompany" value={createForm.senderCompany} onChange={handleCreateChange} /></Form.Group>
                <Form.Group><Form.Label>Контакт</Form.Label><Form.Control name="senderContact" value={createForm.senderContact} onChange={handleCreateChange} /></Form.Group>
                <Form.Group><Form.Label>Страна</Form.Label><Form.Control name="senderCountry" value={createForm.senderCountry} onChange={handleCreateChange} /></Form.Group>
                <Form.Group><Form.Label>Город</Form.Label><Form.Control name="senderCity" value={createForm.senderCity} onChange={handleCreateChange} /></Form.Group>
                <Form.Group><Form.Label>Адрес</Form.Label><Form.Control name="senderAddress" value={createForm.senderAddress} onChange={handleCreateChange} /></Form.Group>
                <Form.Group><Form.Label>Телефон</Form.Label><Form.Control name="senderPhone" value={createForm.senderPhone} onChange={handleCreateChange} /></Form.Group>
              </Col>
              <Col>
                <h5>Получатель</h5>
                <Form.Group><Form.Label>Компания</Form.Label><Form.Control name="receiverCompany" value={createForm.receiverCompany} onChange={handleCreateChange} /></Form.Group>
                <Form.Group><Form.Label>Контакт</Form.Label><Form.Control name="receiverContact" value={createForm.receiverContact} onChange={handleCreateChange} /></Form.Group>
                <Form.Group><Form.Label>Страна</Form.Label><Form.Control name="receiverCountry" value={createForm.receiverCountry} onChange={handleCreateChange} /></Form.Group>
                <Form.Group><Form.Label>Город</Form.Label><Form.Control name="receiverCity" value={createForm.receiverCity} onChange={handleCreateChange} /></Form.Group>
                <Form.Group><Form.Label>Адрес</Form.Label><Form.Control name="receiverAddress" value={createForm.receiverAddress} onChange={handleCreateChange} /></Form.Group>
                <Form.Group><Form.Label>Телефон</Form.Label><Form.Control name="receiverPhone" value={createForm.receiverPhone} onChange={handleCreateChange} /></Form.Group>
              </Col>
            </Row>
            <h5>Параметры груза</h5>
            <Form.Group><Form.Label>Вес (кг)</Form.Label><Form.Control name="weight" value={createForm.weight} onChange={handleCreateChange} /></Form.Group>
            <Form.Group><Form.Label>Габариты (см)</Form.Label>
              <Row>
                <Col><Form.Control name="dimensions.length" value={createForm.dimensions.length} onChange={handleCreateChange} placeholder="Длина" /></Col>
                <Col><Form.Control name="dimensions.width" value={createForm.dimensions.width} onChange={handleCreateChange} placeholder="Ширина" /></Col>
                <Col><Form.Control name="dimensions.height" value={createForm.dimensions.height} onChange={handleCreateChange} placeholder="Высота" /></Col>
              </Row>
            </Form.Group>
            <Form.Group><Form.Label>Объявленная стоимость</Form.Label><Form.Control name="declaredValue" value={createForm.declaredValue} onChange={handleCreateChange} /></Form.Group>
            <Form.Group><Form.Label>Описание груза</Form.Label><Form.Control as="textarea" name="cargoDescription" value={createForm.cargoDescription} onChange={handleCreateChange} /></Form.Group>
            <Form.Group><Form.Label>Тариф</Form.Label>
              <Form.Control as="select" name="tariffType" value={createForm.tariffType} onChange={handleCreateChange}>
                <option value="EXPRESS">EXPRESS</option>
                <option value="PRIME">PRIME</option>
                <option value="LOCAL">LOCAL</option>
              </Form.Control>
            </Form.Group>
            {createForm.tariffType === 'LOCAL' && (
              <Form.Group><Form.Label>Зона доставки</Form.Label>
                <Form.Control as="select" name="deliveryRange" value={createForm.deliveryRange} onChange={handleCreateChange}>
                  <option value="">Выберите зону</option>
                  <option value="in_city">В пределах города</option>
                  <option value="outside_city">До 50 км от города</option>
                </Form.Control>
              </Form.Group>
            )}
            {createForm.deliveryRange === 'in_city' && (
              <Form.Group><Form.Label>Способ доставки</Form.Label>
                <Form.Control as="select" name="deliveryMethod" value={createForm.deliveryMethod} onChange={handleCreateChange}>
                  <option value="">Выберите способ</option>
                  <option value="door_to_door">Дверь — Дверь</option>
                  <option value="door_to_postamat">Дверь — Постамат</option>
                </Form.Control>
              </Form.Group>
            )}
            <h5>Дополнительные услуги</h5>
            {Object.keys(serviceLabels).map(key => (
              <Form.Check
                key={key}
                type="checkbox"
                label={serviceLabels[key]}
                name={`extraServices.${key}`}
                checked={!!createForm.extraServices[key]}
                onChange={handleCreateChange}
              />
            ))}
            <div style={{ marginTop: 16 }}>
              <Button type="submit" variant="primary" disabled={creating}>Создать</Button>
              <Button type="button" variant="secondary" onClick={() => setShowCreate(false)} style={{ marginLeft: 8 }}>Отмена</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      {/* Модалка/форма редактирования услуг */}
      {editOrder && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 320 }}>
            <h3>Редактировать услуги заказа №{editOrder.orderNumber}</h3>
            <form onSubmit={e => { e.preventDefault(); saveEdit(); }}>
              {Object.keys(serviceLabels).map(key => (
                <div key={key}>
                  <label>
                    <input
                      type='checkbox'
                      checked={!!editServices[key]}
                      onChange={e => setEditServices(s => ({ ...s, [key]: e.target.checked }))}
                    />
                    {serviceLabels[key]}
                  </label>
                </div>
              ))}
              <div style={{ marginTop: 16 }}>
                <button type='submit'>Сохранить</button>
                <button type='button' onClick={() => setEditOrder(null)} style={{ marginLeft: 8 }}>Отмена</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Модалка деталей заказа */}
      <Modal show={showDetails} onHide={() => setShowDetails(false)} size="lg" backdrop="static">
        <Modal.Header closeButton><Modal.Title>Детали заказа</Modal.Title></Modal.Header>
        <Modal.Body>
          {detailsOrder && (
            <div>
              <h5>Основная информация</h5>
              <div><b>Номер заказа:</b> {detailsOrder.orderNumber}</div>
              <div><b>Отправитель:</b> {detailsOrder.senderCompany} ({detailsOrder.senderContact})</div>
              <div><b>Получатель:</b> {detailsOrder.receiverCompany} ({detailsOrder.receiverContact})</div>
              <div><b>Города:</b> {detailsOrder.senderCity} → {detailsOrder.receiverCity}</div>
              <div><b>Адрес отправителя:</b> {detailsOrder.senderAddress}</div>
              <div><b>Адрес получателя:</b> {detailsOrder.receiverAddress}</div>
              <div><b>Телефон отправителя:</b> {detailsOrder.senderPhone}</div>
              <div><b>Телефон получателя:</b> {detailsOrder.receiverPhone}</div>
              <div><b>Вес:</b> {detailsOrder.weight} кг</div>
              <div><b>Габариты:</b> {detailsOrder.dimensions?.length} x {detailsOrder.dimensions?.width} x {detailsOrder.dimensions?.height} см</div>
              <div><b>Объявленная стоимость:</b> {detailsOrder.declaredValue}</div>
              <div><b>Тариф:</b> {detailsOrder.tariffType}</div>
              <div><b>Цена:</b> {detailsOrder.price} тг</div>
              <div><b>Услуги:</b>
                <ul>
                  {Object.entries(detailsOrder.extraServices || {}).filter(([k, v]) => v.selected).map(([k, v]) => (
                    <li key={k}>{serviceLabels[k] || k} {v.price ? `(+${v.price} тг)` : ''}</li>
                  ))}
                </ul>
              </div>
              <h5>История статусов</h5>
              <ul>
                {(detailsOrder.statusHistory || []).map((s, idx) => (
                  <li key={idx}>
                    <b>{s.status}</b> — {s.city || ''} {s.location ? `(${s.location})` : ''} {s.comment && `— ${s.comment}`} <i>{new Date(s.date).toLocaleString()}</i>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetails(false)}>Закрыть</Button>
          {detailsOrder && (
            <>
              <Button variant="outline-primary" style={{marginLeft:8}} onClick={() => downloadOrderPDF(detailsOrder)}>
                Скачать PDF
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
  // --- PDF download function ---
  async function downloadOrderPDF(order) {
    const jsPDF = (await import('jspdf')).default;
    await import('../../shared/fonts/FreeSans-normal.js');

    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [210, 148] });
    doc.setFont('FreeSans', 'normal');
    doc.setFontSize(10);

    const today = new Date().toLocaleDateString('ru-RU');

    // ===== Header =====
    doc.setFontSize(20);
    doc.text('SHM EXPRESS', 10, 12);
    doc.setFontSize(12);
    doc.rect(90, 5, 60, 10);
    doc.text('Call-center 8(700)799-78-59', 92, 12);
    doc.rect(155, 5, 35, 10);
    doc.text(order?.orderNumber?.toString().padStart(6, "0") || '', 172.5, 12, { align: 'center' });

    // ===== Отправитель =====
    doc.setFont('FreeSans', 'normal');
    doc.setFontSize(10);
    doc.text('Жөнелтуші / Отправитель', 10, 20);
    doc.setFont('FreeSans', 'normal');
    doc.rect(10, 22, 90, 35);
    const senderFields = [
      ['Компания / Компания БИН', order.senderCompany],
      ['Байланысатын тұлғаның аты-жөні / Ф.И.О контактного лица ИИН', order.senderContact],
      ['Ел / Страна  Қаласы / Город  Индекс / Индекс', `${order.senderCountry || ''} / ${order.senderCity || ''} / ${order.senderZip || ''}`],
      ['Көшесі, Үй, Пәтері / Улица, Дом, Квартира', order.senderAddress],
      ['Телефон', order.senderPhone],
    ];
    let y = 26;
    senderFields.forEach(([label, value]) => {
      doc.setFontSize(6.5);
      doc.text(label, 12, y);
      doc.setFontSize(8);
      doc.text(String(value || ''), 12, y + 3);
      y += 6;
    });

    // ===== Получатель =====
    doc.setFont('FreeSans', 'normal');
    doc.setFontSize(10);
    doc.text('Алушы / Получатель', 10, 60);
    doc.setFont('FreeSans', 'normal');
    doc.rect(10, 62, 90, 35);
    const receiverFields = [
      ['Компания / Компания БИН', order.receiverCompany],
      ['Байланысатын тұлғаның аты-жөні / Ф.И.О контактного лица ИИН', order.receiverContact],
      ['Ел / Страна  Қаласы / Город  Индекс / Индекс', `${order.receiverCountry || ''} / ${order.receiverCity || ''} / ${order.receiverZip || ''}`],
      ['Көшесі, Үй, Пәтері / Улица, Дом, Квартира', order.receiverAddress],
      ['Телефон', order.receiverPhone],
    ];
    y = 66;
    receiverFields.forEach(([label, value]) => {
      doc.setFontSize(6.5);
      doc.text(label, 12, y);
      doc.setFontSize(8);
      doc.text(String(value || ''), 12, y + 3);
      y += 6;
    });

    // ===== Услуги =====
    doc.setFont('FreeSans', 'normal');
    doc.setFontSize(8);
    doc.text('Қызмет / Услуги', 105, 20);
    doc.setFont('FreeSans', 'normal');
    doc.rect(105, 22, 95, 40);
    // Сопоставление ключей услуг с их позициями на шаблоне
    const serviceCheckboxes = [
      { key: 'express', label: 'Экспресс Жедел / Срочно', x: 107, y: 26 },
      { key: 'other', label: 'Басқа / Другое', x: 152, y: 26 },
      { key: 'personalDelivery', label: 'Жеке қолына / Лично в руки', x: 107, y: 30 },
      { key: 'city', label: 'Қала / Город', x: 152, y: 30 },
      { key: 'deliveryNotice', label: 'Хабарлама / Уведомление', x: 107, y: 34 },
    ];
    serviceCheckboxes.forEach(({ key, label, x, y }) => {
      doc.rect(x, y - 2, 3, 3);
      doc.setFontSize(7);
      doc.text(label, x + 5, y);
      // Если услуга выбрана — рисуем галочку
      if (order.extraServices && (order.extraServices[key] || (order.extraServices[key] && order.extraServices[key].selected))) {
        doc.setLineWidth(0.7);
        doc.line(x + 0.5, y - 0.5, x + 1.5, y + 1.5);
        doc.line(x + 1.5, y + 1.5, x + 2.5, y - 1.5);
        doc.setLineWidth(0.2);
      }
    });

    doc.setFontSize(7);
    doc.text('Төлем шарттары / Условия оплаты', 107, 39);
    const paymentConditions = ['Жөнелтуші / Отправитель', 'АлушыПолучатель', '3-ші тарап / 3-я сторона'];
    const paymentForms = ['Қолма-қол ақша / Наличные', 'Шот бойынша / По счету'];
    paymentConditions.forEach((cond, i) => {
      const yOffset = 44 + i * 4;
      doc.rect(107, yOffset - 4, 3, 3);
      doc.text(cond, 112, yOffset-2);
    });

    doc.text('Төлем нысаны / Форма оплаты', 155, 39);
    paymentForms.forEach((form, i) => {
      const yOffset = 44 + i * 4;
      doc.rect(155, yOffset - 4, 3, 3);
      doc.text(form, 160, yOffset-2);
    });

    doc.setFontSize(7);
    doc.text('Жүктің суреттемесі–описание груза', 107, 54);

    // ===== Дополнительная информация =====
    doc.setFont('FreeSans', 'normal');
    doc.text('Қосымша ақпарат / Дополнительная информация', 105, 65);
    doc.setFont('FreeSans', 'normal');
    doc.rect(105, 67, 95, 30);
    const info = [
      ['Орындар / Места', order.places],
      ['Нақты Салмағы / Фактический Вес', order.weight],
      ['Көлемдік Салмағы / Объёмный Вес', order.volumeWeight],
      ['Мөлшері / Габариты', order.dimensions && (order.dimensions.length || order.dimensions.width || order.dimensions.height)
        ? `${order.dimensions.length || ''} x ${order.dimensions.width || ''} x ${order.dimensions.height || ''} см`
        : ''],
      ['Қосымша Қызмет / Дополнительные Услуги', order.additionalService],
      ['Қосымша Қаптама / Дополнительная Упаковка', order.additionalPacking],
      ['Жарияланған құны / Объявленная стоимость',   order.declaredValue],
      ['Шалғай мекен / Отдаленный пункт', order.remoteArea],
    ];
    y = 71;
    info.forEach(([label, value]) => {
      doc.setFontSize(6.5);
      doc.text(label, 107, y);
      doc.setFontSize(8);
      doc.text(String(value || ''), 150, y);
      y += 3.5;
    });

    // ===== Agreement =====
    doc.setFontSize(6.5);
    const agreement = 'Өз қолтаңбамен курьерлік компаниясының жүк тасымалдау шарттарымен келісемін және өзім берген алушы жөнелтiлiм туралы ақпарат үшін жауапкершілікті көтеремін, сондай-ақ осы жөнелтiлiмнiң құрамында қолма-қол ақша, оның эквиваленті мен жіберуге тыйым салынған заттардың жоқтығын растаймын. Егер қабылдаған алушы тасымал үшін төлем ақшадан бас тартса, оның құны жөнелтушiмен төленеді.\nСвоей подписью я соглашаюсь с условиями курьерской компании и несу ответственность за предоставленную мною информацию о получателе и об отправителе, а также подтверждаю, что настоящее отправление не содержит наличных денег, их эквивалент и предметов запрещённых к пересылке. В случае отказа получателем от оплаты перевозки, ее стоимость оплачивается отправителем.';
    doc.text(doc.splitTextToSize(agreement, 190), 10, 100);

    doc.setFontSize(7);
    doc.text('Жіберілген күні / дата отправления', 10, 120);
    doc.text(today, 70, 120);
    doc.text('қолтаңба / подпись', 150, 120);

    // ===== Детали доставки =====
    doc.setFont('FreeSans', 'normal');
    doc.setFontSize(9);
    doc.text('Жеткізу мәліметтері / Детали доставки', 10, 126);
    doc.setFont('FreeSans', 'normal');
    doc.setFontSize(7);
    doc.rect(10, 128, 190, 19);
    doc.text('Жеткызу туралы акпарат / Информация о доставке', 12, 132);
    doc.text('Қабылдаушының аты-жөні / Ф.И.О Получателя', 12, 140);
    doc.text('Барлығы / Итого', 80, 132);
    doc.text('Қолтаңба / Подпись', 120, 132);
    doc.text('уақыты / время', 150, 132);
    doc.text('күні / дата', 180, 132);

    doc.setFontSize(6);
    doc.text('Мен жөнелтiлiмнiң қаптамасы зақым келтiрiлмей жеткізiлгенін растаймын.', 100, 143);
    doc.text('Я подтверждаю, что отправление доставлено без повреждения упаковки.', 100, 146);
    doc.text('қолтаңба / подпись', 180, 146);

    doc.save(`order_${order.orderNumber}_nakladnaya.pdf`);
  }
} 