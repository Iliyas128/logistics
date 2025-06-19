import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import styles from './SignUp.module.scss';
import Container from 'react-bootstrap/Container';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";


function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const navigate = useNavigate();
  
  async function SignUpFunction(event) {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/register', {
        username,
        email,
        password,
        phone,
        address
      });
      alert('Registration successful! Please check your email for OTP.')
			navigate('/verify-otp', { state: { email } })
      // Здесь можно добавить редирект на страницу входа или другую страницу
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
    }
  }
  
  return (
    <Container fluid="lg"> 
      <div className={styles.signUpContainer}>
        <Form onSubmit={SignUpFunction}>
          <h1>Sign Up</h1>
          
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Enter username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email address</Form.Label>
            <Form.Control 
              type="email" 
              placeholder="Enter email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="phone">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control 
              type="tel" 
              placeholder="Enter phone number" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Enter your address, it is not required" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}

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

          <Button variant="primary" type="submit">
            Register
          </Button>
        </Form>
      </div>
    </Container>
  );
}

export default SignUp;
