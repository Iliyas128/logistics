import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import styles from './SignIn.module.scss';
import axios from 'axios';
import { useState } from 'react';
import FullScreenSpinner from '../../shared/FullScreenSpinner';
import { useNavigate } from "react-router-dom";

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function SignInFunction(event) {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password
      });
      console.log('Login successful:', response.data);
      alert('Login successful!');
      navigate('/'); // Redirect to the main page after successful login

    } catch (error) {
      if(error.response?.data){
        setError(error.response.data);
      } 
      setError('Sing-in error');
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
    <div className={styles.centerSignInContainer}>
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
    <ToastContainer className = "p-3" position='top-end' style={{zIndex: 1}}>
    <Toast show={Boolean(error)}>
      <Toast.Body>
        <div className={styles.toasterContent}>
        <span>{error || 'Sign-in error'}</span>
        <Button onClick={closeToaster} variant='outline-dark' size='sm'>&times;</Button>
        </div>
      </Toast.Body>
    </Toast>
    </ToastContainer>
    </Container>
  );
}

export default SignIn;