import { useAuth } from '../hooks/useAuth';

export default function AdminPanelPage() {
  const { user } = useAuth();

  if (!user) return <div>Загрузка...</div>;

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 12 }}>
      <h2>Админ-панель</h2>
      <p>Добро пожаловать, {user.username || user.name}!</p>
      <p>Здесь вы можете управлять пользователями, заказами и другими административными функциями.</p>
      {/* Здесь добавьте административные компоненты и таблицы */}
    </div>
  );
} 