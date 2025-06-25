import NavbarPage from '../../Components/Navbar.jsx'
import OtpVerify from '../../Components/OTP/OtpVerify.jsx'

function OtpPage() {
	return (
		<div>
			<NavbarPage />
			<div className='container mt-5'>
				<OtpVerify />
			</div>
		</div>
	)
}

export default OtpPage
