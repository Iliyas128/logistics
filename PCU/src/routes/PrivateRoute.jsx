import { useAuth } from '../hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';

export default function PrivateRoute({ children, adminOnly = false }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Не авторизован — редирект на логин
    return <Navigate to="/signIn" state={{ from: location }} replace />;
  }

  if (adminOnly && user.role !== 'ADMIN') {
    // Не админ — редирект на главную или 403
    return <Navigate to="/" replace />;
  }

  return children;
} 