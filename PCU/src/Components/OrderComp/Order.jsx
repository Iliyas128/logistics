import { Form, Button, Container, Alert } from 'react-bootstrap';

const CreateOrder=()=>{



    return(
        <>
            <div>
                <h1>Order page</h1>
                <Container>
                    <h2>Создать заказ</h2>

                    <Form onSubmit>
                        <Form.Group controlId="recipientName">
                            <Form.Label>ФИО получателя</Form.Label>
                            <Form.Control
                                type="text"
                                name="recipientName"
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="senderName">
                            <Form.Label>ФИО отправителя</Form.Label>
                            <Form.Control
                                type="text"
                                name="recipientPhone"
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="recipientPhone">
                            <Form.Label>Телефон получателя</Form.Label>
                            <Form.Control
                                type="text"
                                name="recipientPhone"
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="senderPhone">
                            <Form.Label>Телефон отправителя</Form.Label>
                            <Form.Control
                                type="text"
                                name="recipientPhone"
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="senderAddress">
                            <Form.Label>Адрес отправки</Form.Label>
                            <Form.Control
                                type="text"
                                name="recipientPhone"
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="recipientAddress">
                            <Form.Label>Адрес доставки</Form.Label>
                            <Form.Control
                                type="text"
                                name="recipientAddress"
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" class_PROP="mt-3">
                            Создать заказ
                        </Button>
                    </Form>
                </Container>
            </div>
        </>
    )
}
export default CreateOrder