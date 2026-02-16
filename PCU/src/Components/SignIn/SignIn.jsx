import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import styles from './SignIn.module.scss';
import { api } from '../../config/axios';
import { useState } from 'react';
import FullScreenSpinner from '../../shared/FullScreenSpinner';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../hooks/useAuth';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();
  const login = auth?.login;

  async function SignInFunction(event) {
    event.preventDefault();
    if (!login) {
      setError('Ошибка авторизации: контекст не подключен.');
      return;
    }
    try {
      setLoading(true);
      const response = await api.post('/api/users/login', {
        email,
        password
      });
      // Сохраняем токен и пользователя
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      login(response.data.user);
      if (response.data.user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    } catch (error) {
      setError(`Error: ${error.response?.data?.message || error.message}`);
      console.log(error)
    }
    finally{
      setLoading(false);
    }
  }
  function closeToaster(){
    setError('');
  }
  return (
    <Container className={styles.signInContainer} fluid="lg">
    <div className>
    { loading ===true ?
      <FullScreenSpinner/>
      :
      (
      <Form onSubmit={SignInFunction}>
      <h1>Sign In</h1>
      
      <Form.Group className="mb-3" controlId="email">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email"
         placeholder="Enter email" 
         value={email}
         onChange={(e) => setEmail(e.target.value)}
         required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control 
        type="password" 
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check type="checkbox" label="Check me out" />
      </Form.Group>
      <div className={styles.buttonContainer}>
      <Button variant="primary" type="submit">
        Login
      </Button>
      <Button variant="secondary" onClick={() => navigate('/signUp')}>
        Sign Up
      </Button>
      </div>
    </Form>
    )
  }
    </div>
    <ToastContainer className = "p-3" style={{
      position: 'fixed',
      top: 20,
      right: 20,
      zIndex: 1055,
      width: 280,
    }}>
    <Toast show={Boolean(error)} onClose={closeToaster} autohide delay={3000}>
      <Toast.Body>
        <div className={styles.toasterContent}>
        <span>{error}</span>
        <Button onClick={closeToaster} variant='outline-dark' size='sm'>&times;</Button>
        </div>
      </Toast.Body>
    </Toast>
    </ToastContainer>
    </Container>
  );
}

export default SignIn;
