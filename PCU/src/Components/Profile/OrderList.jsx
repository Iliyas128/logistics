import {useEffect, useState} from "react";
import axios from "axios";
import { Card, Alert, Modal, Button } from "react-bootstrap";

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

const OrderList = () =>{
const [ordersList, setOrdersList] = useState([])
const [loading,setLoading] = useState(true)
const [error,setError] = useState('')
const [showDetails, setShowDetails] = useState(false);
const [detailsOrder, setDetailsOrder] = useState(null);

const getOrders = async()=>{
    try{setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/users/orders',{
            headers: {Authorization: `Bearer ${token}`}
        });
        setOrdersList(response.data);
    } catch (err){
        setError(err.response?.data?.message || 'Ошибка при загрузке заказов!')
    } finally{
        setLoading(false);
    }
};
useEffect(()=>{
    getOrders()
},[])

const openDetails = (order) => {
  setDetailsOrder(order);
  setShowDetails(true);
};

if (loading) return<div>Загрузка заказов...</div>;
if (error) return <Alert variant="danger">{error}</Alert>;
return (
    <Card className="mb-4 shadow-sm border-0 rounded-4">
      <Card.Body>
        <h4 className="mb-4">📦 Мои заказы</h4>
        {ordersList.length === 0 ? (
          <p className="text-muted">Нет заказов</p>
        ) : (
          ordersList.map(order => (
            <div key={order._id} className="mb-3 p-3 rounded bg-light" style={{cursor:'pointer'}} onClick={() => openDetails(order)}>
              <div className="d-flex justify-content-between">
                <div>
                  <strong>Заказ №{order.orderNumber}</strong>
                  <p className="mb-1"><small>{order.cargoDescription || 'Описание груза'}</small></p>
                  <p className="mb-1"><small>Статус: {order.status}</small></p>
                </div>
                <div className="text-end">
                  <small className="text-muted">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </small>
                </div>
              </div>
            </div>
          ))
        )}
      </Card.Body>
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
        </Modal.Footer>
      </Modal>
    </Card>
  );
}

export default OrderList