import React from 'react';
import { Card, Form, Button } from 'react-bootstrap';

const OrderForm = () => {
  return (
    <Card className="shadow-sm border-0 rounded-4">
      <Card.Body>
        <h4 className="mb-4">📝 Подать заявку</h4>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Название</Form.Label>
            <Form.Control placeholder="Например: Доставка груза" disabled />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Описание</Form.Label>
            <Form.Control as="textarea" rows={4} placeholder="Опишите, что требуется..." disabled />
          </Form.Group>
          <Button variant="primary" disabled>Отправить (в разработке)</Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default OrderForm; 