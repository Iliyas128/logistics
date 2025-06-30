import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table, Button, Modal, Form, Alert, Card } from "react-bootstrap";

const statusOptions = [
  'новый',
  'получен складом',
  'планируется отправка',
  'отправлено со склада',
  'Забран у перевозчика',
  'Доставлен'
];

const AdminOrderPanel = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get("http://localhost:5000/api/admin/orders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      setError("Ошибка загрузки заказов");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openModal = (order) => {
    setSelectedOrder(order);
    setStatus(order.status);
    setLocation("");
    setCity("");
    setComment("");
    setShowModal(true);
    setError("");
    setSuccess("");
  };

  const handleStatusChange = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");
      await axios.patch(
        `http://localhost:5000/api/admin/orders/${selectedOrder._id}`,
        { status, location, city, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Статус успешно обновлён!");
      setShowModal(false);
      fetchOrders();
    } catch (err) {
      setError( err.response?.data?.message ||"Ошибка обновления статуса");
      console.log(err.response?.data?.message)
    }
  };

  return (
    <Container style={{ marginTop: 40 }}>
      <h2 className="mb-4">Админ-панель заказов</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>№</th>
            <th>Номер заказа</th>
            <th>Статус</th>
            <th>Описание</th>
            <th>Дата</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, idx) => (
            <tr key={order._id}>
              <td>{idx + 1}</td>
              <td>{order.orderNumber}</td>
              <td>{order.status}</td>
              <td>{order.cargoDescription}</td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>
                <Button size="sm" onClick={() => openModal(order)}>
                  Изменить статус
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Модальное окно для смены статуса */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Изменить статус заказа</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleStatusChange}>
            <Form.Group>
              <Form.Label>Статус</Form.Label>
              <Form.Select value={status} onChange={e => setStatus(e.target.value)} required>
                {statusOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Локация</Form.Label>
              <Form.Control value={location} onChange={e => setLocation(e.target.value)} placeholder="Офис, склад и т.д." />
            </Form.Group>
            <Form.Group>
              <Form.Label>Город</Form.Label>
              <Form.Control value={city} onChange={e => setCity(e.target.value)} placeholder="Город" />
            </Form.Group>
            <Form.Group>
              <Form.Label>Комментарий</Form.Label>
              <Form.Control value={comment} onChange={e => setComment(e.target.value)} placeholder="Комментарий (опционально)" />
            </Form.Group>
            <Button type="submit" className="mt-3" variant="primary">
              Сохранить
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* История статусов выбранного заказа */}
      {selectedOrder && selectedOrder.statusHistory && (
        <Card className="mt-4">
          <Card.Body>
            <h5>История статусов заказа №{selectedOrder.orderNumber}</h5>
            {selectedOrder.statusHistory.length === 0 && <div>Нет истории</div>}
            {selectedOrder.statusHistory.map((event, idx) => (
              <div key={idx} style={{ borderBottom: "1px solid #eee", padding: "10px 0" }}>
                <div className="d-flex justify-content-between">
                  <div>
                    <strong>
                      {new Date(event.date).toLocaleDateString()}{" "}
                      {new Date(event.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </strong>
                    <div>
                      {event.location} {event.city && `(${event.city})`}
                    </div>
                    {event.comment && <div style={{ color: "#888" }}>{event.comment}</div>}
                  </div>
                  <div style={{ minWidth: 120, textAlign: "right", color: "#6c757d" }}>
                    {event.status}
                  </div>
                </div>
              </div>
            ))}
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default AdminOrderPanel; 