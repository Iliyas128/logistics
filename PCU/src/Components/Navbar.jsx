import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const NavbarComp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = () => {
    navigate('/signin');
  };

  const handleSectionClick = (sectionId) => {
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  return (
    <Navbar fixed="top" expand="lg" className="bg-body-tertiary" bg="dark" data-bs-theme="dark">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">Logistics</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Nav.Link as={Link} to="/">Главная</Nav.Link>
            <Nav.Link as={Link} to="/track">Отследить</Nav.Link>
            <Nav.Link as={Link} to="/order">Создать заказ</Nav.Link>
            <Nav.Link onClick={() => handleSectionClick('calculator')}>Калькулятор</Nav.Link>
            <Nav.Link onClick={() => handleSectionClick('about')}>О нас</Nav.Link>
            <Nav.Link onClick={() => handleSectionClick('contact')}>Связаться с нами</Nav.Link>
            <Nav.Link as={Link} to="/admin">Админ панель</Nav.Link>
          </Nav>
          <Form className="d-flex">
            <Button variant="outline-success" onClick={handleLogin}>Войти</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComp;