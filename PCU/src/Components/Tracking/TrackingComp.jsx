import axios from "axios"
import {useState} from "react"
import { Container, Form, Button, Card, Alert, Spinner, Row, Col } from "react-bootstrap"

const TrackingComp = () => {
    const [orderNumber, setOrderNumber] = useState("")
    const [trackData, setTrackData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleTrack = async (e) => {
        e.preventDefault()
        setError("")
        setTrackData(null)
        if (!orderNumber) {
            setError("Введите номер заказа!")
            return
        }
        try {
            setLoading(true)
            const response = await axios.get(
                `http://localhost:5000/api/orders/track/${orderNumber}`
            )
            setTrackData(response.data)
        } catch (err) {
            setError(err.response?.data?.message || "Заказ не найден!")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Container style={{ maxWidth: 600, marginTop: 40 }}>
            <Card className="shadow-sm border-0 rounded-4 p-4">
                <h2 className="mb-4 text-center">Отслеживание заказа</h2>
                <Form onSubmit={handleTrack} className="mb-4">
                    <Form.Group controlId="orderNumber">
                        <Form.Label>Введите номер заказа (6 цифр)</Form.Label>
                        <Form.Control
                            type="text"
                            value={orderNumber}
                            onChange={(e) => setOrderNumber(e.target.value)}
                            placeholder="Например, 000123"
                            maxLength={6}
                            required
                        />
                    </Form.Group>
                    <div className="d-flex justify-content-center mt-3">
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? <Spinner size="sm" animation="border" /> : "Отследить"}
                        </Button>
                    </div>
                </Form>
                {error && <Alert variant="danger" className="text-center">{error}</Alert>}
                {trackData && (
                    <Card className="mt-4 shadow-sm border-0 bg-light">
                        <Card.Body>
                            <h4 className="mb-3">Заказ №{trackData.orderNumber}</h4>
                            <Row>
                                <Col md={6}>
                                    <p><strong>Статус:</strong> {trackData.status}</p>
                                    <p><strong>Дата создания:</strong> {new Date(trackData.createdAt).toLocaleDateString()}</p>
                                    <p><strong>Описание груза:</strong> {trackData.cargoDescription || "-"}</p>
                                </Col>
                                <Col md={6}>
                                    <p><strong>Отправитель:</strong> {trackData.senderCompany || "-"}</p>
                                    <p><strong>Получатель:</strong> {trackData.receiverCompany || "-"}</p>
                                    <p><strong>Адрес доставки:</strong> {trackData.receiverAddress || "-"}</p>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                )}
            </Card>
        </Container>
    )
}

export default TrackingComp