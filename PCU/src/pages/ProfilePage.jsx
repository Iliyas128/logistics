import { useAuth } from '../hooks/useAuth';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import UserInfo from '../Components/Profile/UserInfo';
import OrderList from '../Components/Profile/OrderList';

export default function ProfilePage() {
    const { user } = useAuth();

    const dummyOrders = [
        { _id: '1', title: 'Заказ №1', status: 'В обработке', createdAt: new Date() },
        { _id: '2', title: 'Заказ №2', status: 'Завершён', createdAt: new Date() },
    ];

    if (!user) return <div className="text-center mt-5">Загрузка...</div>;

    return (
        <Container className="py-5" style={{ maxWidth: '900px' }}>
            {/* Секция: Информация о пользователе */}
            <UserInfo user={user}/>

            {/* Секция: Заказы */}
            <OrderList orders={dummyOrders}/>
        </Container>
    );
}
