import React from 'react';
import { Card } from 'react-bootstrap';

const OrderList = ({ orders }) => {
  return (
    <Card className="mb-4 shadow-sm border-0 rounded-4">
      <Card.Body>
        <h4 className="mb-4">📦 Мои заказы</h4>
        {orders.length === 0 ? (
          <p className="text-muted">Нет заказов</p>
        ) : (
          orders.map(order => (
            <div key={order._id} className="mb-3 p-3 rounded bg-light">
              <div className="d-flex justify-content-between">
                <div>
                  <strong>{order.title}</strong>
                  <p className="mb-1"><small>{order.status}</small></p>
                </div>
                <div className="text-end">
                  <small className="text-muted">{new Date(order.createdAt).toLocaleDateString()}</small>
                </div>
              </div>
            </div>
          ))
        )}
      </Card.Body>
    </Card>
  );
};

export default OrderList; 