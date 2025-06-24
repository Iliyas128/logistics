import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import styles from './OtpVerify.module.scss'

function OtpVerify() {
	const [otp, setOtp] = useState('')
	const [error, setError] = useState('')
	const location = useLocation()
	const navigate = useNavigate()
	const email = location.state?.email

	const handleSubmit = async e => {
		e.preventDefault()
		try {
			await axios.post('http://localhost:5000/api/users/verify-otp', {
				email,
				otp,
			})
			alert('Email verified! You may log in.')
			navigate('/signIn')
		} catch (err) {
			setError(err.response?.data?.message || 'OTP verification failed')
		}
	}

	return (
		<Container className={styles.otpContainer}>
			<h2>Verify Your Email</h2>
			<Form onSubmit={handleSubmit}>
				<Form.Group controlId='otp'>
					<Form.Label>Enter OTP sent to {email}</Form.Label>
					<Form.Control
						type='text'
						value={otp}
						onChange={e => setOtp(e.target.value)}
						required
					/>
				</Form.Group>
				{error && <div className={styles.errorMessage}>{error}</div>}
				<Button className='mt-3 me-2' type='submit'>Verify OTP</Button>
				<Button className='mt-3' variant='secondary' onClick={() => navigate('/signUp')}>
					Back
				</Button>
			</Form>
		</Container>
	)
}

export default OtpVerify
