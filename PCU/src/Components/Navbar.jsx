import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const NavbarComp = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const { user, logout } = useAuth()

	const handleLogin = () => {
		navigate('/signin')
	}

	const handleSectionClick = sectionId => {
		if (location.pathname === '/') {
			const element = document.getElementById(sectionId)
			if (element) {
				element.scrollIntoView({ behavior: 'smooth' })
			}
		} else {
			navigate(`/#${sectionId}`)
		}
	}

	return (
		<Navbar
			fixed='top'
			z-index='1'
			expand='lg'
			className='bg-body-tertiary'
			bg='dark'
			data-bs-theme='dark'
		>
			<Container fluid>
				<Navbar.Brand as={Link} to='/'>
					Logistics
				</Navbar.Brand>
				<Navbar.Toggle aria-controls='navbarScroll' />
				<Navbar.Collapse id='navbarScroll'>
					<Nav
						className='me-auto my-2 my-lg-0'
						style={{ maxHeight: '100px' }}
						navbarScroll
					>
						<Nav.Link as={Link} to='/'>
							Главная
						</Nav.Link>
						<Nav.Link as={Link} to='/track'>
							Отследить
						</Nav.Link>
						<Nav.Link as={Link} to='/profile/order'>
							Создать заказ
						</Nav.Link>
						<Nav.Link onClick={() => handleSectionClick('calculator')}>
							Калькулятор
						</Nav.Link>
						<Nav.Link onClick={() => handleSectionClick('about')}>
							О нас
						</Nav.Link>
						<Nav.Link onClick={() => handleSectionClick('contact')}>
							Связаться с нами
						</Nav.Link>
					</Nav>
					<Form className='d-flex'>
						{user ? (
							<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
								<span
									style={{ color: '#fff', fontWeight: 500, cursor: 'pointer' }}
									onClick={() => navigate('/profile')}
								>
									{user.username}
								</span>
								<Button variant='outline-danger' size='sm' onClick={logout}>
									Выйти
								</Button>
							</div>
						) : (
							<Button variant='outline-success' onClick={handleLogin}>
								Войти
							</Button>
						)}
					</Form>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	)
}

export default NavbarComp
