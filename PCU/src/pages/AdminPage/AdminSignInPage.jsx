import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import FullScreenSpinner from '../../shared/FullScreenSpinner';
import { useAuth } from '../../hooks/useAuth';

export default function AdminSignInPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();

  async function handleAdminLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/admin/login', {
        username,
        password
      });
      // Сохраняем токен и пользователя с ролью ADMIN
      const adminUser = { ...response.data.admin, role: 'ADMIN' };
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(adminUser));
      if (auth && auth.login) {
        auth.login(adminUser);
      }
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка входа администратора');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container style={{ maxWidth: 400, marginTop: 80 }}>
      <h2>Вход для администратора</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleAdminLogin}>
        <Form.Group className="mb-3">
          <Form.Label>Логин администратора</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Пароль</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Button type="submit" variant="primary" disabled={loading}>
          Войти
        </Button>
      </Form>
      {loading && <FullScreenSpinner />}
    </Container>
  );
} 