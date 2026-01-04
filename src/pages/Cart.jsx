import { Container, Row, Col, Card, Button, Table } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaTrash, FaArrowRight } from 'react-icons/fa';

const Cart = () => {
  const { cartItems, cartTotal, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (!cartItems || cartItems.length === 0) {
    return (
      <Container className="text-center py-5">
        <h2 className="mb-4">Your Cart is Empty</h2>
        <p className="text-muted mb-4">Looks like you haven't added anything to your cart yet.</p>
        <Button as={Link} to="/menu" variant="primary" className="btn-primary-custom px-4">Browse Menu</Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="fw-bold mb-4">Shopping Cart</h2>
      <Row>
        <Col lg={8}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body className="p-0">
              <Table responsive className="mb-0 align-middle">
                <thead className="bg-light">
                  <tr>
                    <th className="border-0 py-3 ps-4">Product</th>
                    <th className="border-0 py-3">Price</th>
                    <th className="border-0 py-3">Quantity</th>
                    <th className="border-0 py-3">Total</th>
                    <th className="border-0 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(cartItems) && cartItems.map((item) => (
                    <tr key={item.id}>
                      <td className="ps-4">
                        <div className="d-flex align-items-center">
                          <img 
                            src={item.imageUrl || 'https://placehold.co/80x80'} 
                            alt={item.foodName} 
                            style={{width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px'}} 
                            className="me-3"
                          />
                          <div>
                            <h6 className="mb-0">{item.foodName}</h6>
                          </div>
                        </div>
                      </td>
                      <td>₹{item.price}</td>
                      <td>
                        <div className="d-flex align-items-center border rounded-pill px-2" style={{width: 'fit-content'}}>
                           <Button variant="link" size="sm" className="text-dark p-0 text-decoration-none" onClick={() => updateQuantity(item.foodId, Math.max(1, item.quantity - 1))}>-</Button>
                           <span className="mx-2 fw-semibold">{item.quantity}</span>
                           <Button variant="link" size="sm" className="text-dark p-0 text-decoration-none" onClick={() => updateQuantity(item.foodId, item.quantity + 1)}>+</Button>
                        </div>
                      </td>
                      <td className="fw-bold">₹{item.totalPrice}</td>
                      <td>
                        <Button variant="link" className="text-danger p-0" onClick={() => removeFromCart(item.foodId)}>
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-4">Order Summary</h5>
              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Subtotal</span>
                <span className="fw-bold">₹{cartTotal}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Delivery Fee</span>
                <span className="fw-bold">₹30.00</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <span className="fw-bold fs-5">Total</span>
                <span className="fw-bold fs-5 text-orange">₹{(cartTotal + 30).toFixed(2)}</span>
              </div>
              <Button onClick={() => navigate('/checkout')} className="w-100 btn-primary-custom py-2 d-flex align-items-center justify-content-center">
                Proceed to Checkout <FaArrowRight className="ms-2" />
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;
