import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';

const UserInfo = ({ user }) => {
  return (
    <Card className="mb-4 shadow-sm border-0 rounded-4">
      <Card.Body>
        <h4 className="mb-4">👤 Личная информация</h4>
        <Row>
          <Col md={6}>
            <p><strong>Имя пользователя:</strong><br />{user.username}</p>
            <p><strong>Email:</strong><br />{user.email}</p>
            <p><strong>Телефон:</strong><br />{user.phone}</p>
          </Col>
          <Col md={6}>
            <p><strong>Адрес:</strong><br />{user.address || '—'}</p>
            <p><strong>Верификация:</strong><br />{user.isVerified ? '✅ Подтвержден' : '❌ Не подтвержден'}</p>
            <p><strong>Дата регистрации:</strong><br />{new Date(user.createdAt).toLocaleDateString()}</p>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default UserInfo; 