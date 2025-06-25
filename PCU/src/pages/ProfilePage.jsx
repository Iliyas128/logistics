import { useAuth } from '../hooks/useAuth';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return <div>Загрузка...</div>;

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 12 }}>
      <h2>Профиль пользователя</h2>
      <p><b>Имя:</b> {user.username || user.name}</p>
      <p><b>Email:</b> {user.email}</p>
      <p><b>Роль:</b> {user.role}</p>
    </div>
  );
} 