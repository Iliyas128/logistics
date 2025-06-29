import {useEffect, useState} from "react";
import axios from "axios";
import { Card, Alert } from "react-bootstrap";

const OrderList = () =>{
const [ordersList, setOrdersList] = useState([])
const [loading,setLoading] = useState(true)
const [error,setError] = useState('')

const getOrders = async()=>{
    try{setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/users/orders',{
            headers: {Authorization: `Bearer ${token}`}
        });
        setOrdersList(response.data);
    } catch (err){
        setError(err.response?.data?.message || 'Ошибка при загрузке заказов!')
    } finally{
        setLoading(false);
    }
};
useEffect(()=>{
    getOrders()
},[])
if (loading) return<div>Загрузка заказов...</div>;
if (error) return <Alert variant="danger">{error}</Alert>;
return (
    <Card className="mb-4 shadow-sm border-0 rounded-4">
      <Card.Body>
        <h4 className="mb-4">📦 Мои заказы</h4>
        {ordersList.length === 0 ? (
          <p className="text-muted">Нет заказов</p>
        ) : (
          ordersList.map(order => (
            <div key={order._id} className="mb-3 p-3 rounded bg-light">
              <div className="d-flex justify-content-between">
                <div>
                  <strong>Заказ №{order.orderNumber}</strong>
                  <p className="mb-1"><small>{order.cargoDescription || 'Описание груза'}</small></p>
                  <p className="mb-1"><small>Статус: {order.status}</small></p>
                </div>
                <div className="text-end">
                  <small className="text-muted">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </small>
                </div>
              </div>
            </div>
          ))
        )}
      </Card.Body>
    </Card>
  );
}

export default OrderList