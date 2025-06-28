import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useState } from 'react';
import axios from 'axios';

const CreateOrder=()=>{
const [form, setForm] = useState({
    receiverCompany: '',
    receiverContact: '',
    receiverCountry:'',
    receiverCity:'',
    receiverAddress:'',
    receiverPhone:'',
    
    senderCompany: '',
    senderContact: '',
    senderCountry:'',
    senderCity:'',
    senderAddress:'',
    senderPhone:'',

    serviceExpress:false,
    serviceNotification:false,
    servicePersonal:false,
    paymentCondition: '',
    paymentForm:'',
    cargoDescription:'',

    places:'',
    weight: '',
    volumeWeight: '',
    dimensions: '',
    declaredValue: '',
    additionalService: '',
    additionalPacking: '',
    deliveryPoint: '',
})
const [success,setSuccess] = useState('');
const [error,setError] = useState('');

const handleChange=(e)=>{
    const {name, value, type, checked } = e.target;
    setForm((prev)=>({
        ...prev,
        [name]: type ==='checkbox' ? checked :value,
    }));
};
const handleSubmit = async(e)=>{
    e.preventDefault();
    setError('');
    setSuccess('');
    try{
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:5000/api/orders/', form, {
            headers: {Authorization: `Bearer ${token}`}
        });
    setSuccess('Заказ успешно создан!');
    setForm({...form, cargoDescription:''})
}
    catch(err){
        setError(err.response?.data?.message || 'Ошибка при создании заказа')
        console.log(err)
    }
};

    return(
        <>
            <div>
                <h1>Order page</h1>
                <Container>
      <h2>Создать заказ</h2>
      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col>
            <h4>Жөнелтуші / Отправитель</h4>
            <Form.Group>
              <Form.Label>Компания/Компания БИН</Form.Label>
              <Form.Control name="senderCompany" value={form.senderCompany} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>ФИО контактного лица</Form.Label>
              <Form.Control name="senderContact" value={form.senderContact} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Страна</Form.Label>
              <Form.Control name="senderCountry" value={form.senderCountry} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Город</Form.Label>
              <Form.Control name="senderCity" value={form.senderCity} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Индекс</Form.Label>
              <Form.Control name="senderIndex" value={form.senderIndex} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Улица, Дом, Квартира</Form.Label>
              <Form.Control name="senderAddress" value={form.senderAddress} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Телефон</Form.Label>
              <Form.Control name="senderPhone" value={form.senderPhone} onChange={handleChange} />
            </Form.Group>
          </Col>
          <Col>
            <h4>Алушы / Получатель</h4>
            <Form.Group>
              <Form.Label>Компания/Компания БИН</Form.Label>
              <Form.Control name="receiverCompany" value={form.receiverCompany} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>ФИО контактного лица</Form.Label>
              <Form.Control name="receiverContact" value={form.receiverContact} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Страна</Form.Label>
              <Form.Control name="receiverCountry" value={form.receiverCountry} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Город</Form.Label>
              <Form.Control name="receiverCity" value={form.receiverCity} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Индекс</Form.Label>
              <Form.Control name="receiverIndex" value={form.receiverIndex} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Улица, Дом, Квартира</Form.Label>
              <Form.Control name="receiverAddress" value={form.receiverAddress} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Телефон</Form.Label>
              <Form.Control name="receiverPhone" value={form.receiverPhone} onChange={handleChange} />
            </Form.Group>
          </Col>
        </Row>
        <h4>Кызмет / Услуги</h4>
        <Form.Check type="checkbox" label="Экспресс" name="serviceExpress" checked={form.serviceExpress} onChange={handleChange} />
        <Form.Check type="checkbox" label="Уведомление" name="serviceNotification" checked={form.serviceNotification} onChange={handleChange} />
        <Form.Check type="checkbox" label="Лично в руки" name="servicePersonal" checked={form.servicePersonal} onChange={handleChange} />
        <Form.Group>
          <Form.Label>Условия оплаты</Form.Label>
          <Form.Control as="select" name="paymentCondition" value={form.paymentCondition} onChange={handleChange}>
            <option value="">Выберите...</option>
            <option value="sender">Отправитель</option>
            <option value="receiver">Получатель</option>
            <option value="third">3-я сторона</option>
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Форма оплаты</Form.Label>
          <Form.Control as="select" name="paymentForm" value={form.paymentForm} onChange={handleChange}>
            <option value="">Выберите...</option>
            <option value="cash">Наличные</option>
            <option value="invoice">По счету</option>
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Описание груза</Form.Label>
          <Form.Control as="textarea" name="cargoDescription" value={form.cargoDescription} onChange={handleChange} />
        </Form.Group>
        <h4>Дополнительная информация</h4>
        <Form.Group>
          <Form.Label>Ориентиры / Места</Form.Label>
          <Form.Control name="places" value={form.places} onChange={handleChange} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Фактический вес</Form.Label>
          <Form.Control name="weight" value={form.weight} onChange={handleChange} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Объемный вес</Form.Label>
          <Form.Control name="volumeWeight" value={form.volumeWeight} onChange={handleChange} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Габариты</Form.Label>
          <Form.Control name="dimensions" value={form.dimensions} onChange={handleChange} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Объявленная стоимость</Form.Label>
          <Form.Control name="declaredValue" value={form.declaredValue} onChange={handleChange} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Дополнительные услуги</Form.Label>
          <Form.Control name="additionalService" value={form.additionalService} onChange={handleChange} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Дополнительная упаковка</Form.Label>
          <Form.Control name="additionalPacking" value={form.additionalPacking} onChange={handleChange} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Отделенный пункт</Form.Label>
          <Form.Control name="deliveryPoint" value={form.deliveryPoint} onChange={handleChange} />
        </Form.Group>
        <Button type="submit" className="mt-3">Создать заказ</Button>
      </Form>
    </Container>
            </div>
        </>
    )
}
export default CreateOrder