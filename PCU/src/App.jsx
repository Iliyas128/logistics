import './App.css'
import MainPage from './pages/MainPage'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import OtpVerify from './pages/OtpPage'


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path='/verify-otp' element={<OtpVerify />} />
      </Routes>
    </>
  )
}

export default App
