import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import orderService from '../services/orderService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState(user?.address || '');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.address) {
      setAddress(user.address);
    }
  }, [user]);

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

      if (!res) {
          toast.error('Razorpay SDK failed to load. Are you online?');
          setLoading(false);
          return;
      }

      // Calculated amount in paisa
      const amount = Math.round((cartTotal + 30) * 100); 

      const options = {
          key: 'rzp_test_RyuVrPFZgGCZrX', 
          amount: amount,
          currency: "INR",
          name: "Food Order App",
          description: "Food Order Payment",
          image: "https://via.placeholder.com/150", 
          handler: async function (response) {
              const orderData = {
                address,
                paymentMethod: 'Online',
                paymentId: response.razorpay_payment_id,
                items: cartItems.map(item => ({
                  foodId: item.foodId,
                  quantity: item.quantity
                }))
              };
              
              try {
                await orderService.placeOrder(orderData);
                await clearCart();
                toast.success("Payment Successful! Order Placed.");
                navigate('/my-orders');
              } catch (error) {
                console.error(error);
                toast.error("Payment successful but order placement failed.");
              }
          },
          prefill: {
              name: user?.name,
              email: user?.email,
              contact: user?.phoneNumber
          },
          notes: {
              address: address
          },
          theme: {
              color: "#ff6b00"
          }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      setLoading(false);
  };

  if (cartItems.length === 0) {
      navigate('/cart');
      return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (paymentMethod === 'Online') {
        handleRazorpayPayment();
        return;
    }
    try {
      const orderData = {
        address,
        paymentMethod,
        items: cartItems.map(item => ({
          foodId: item.foodId,
          quantity: item.quantity
        }))
      };
      
      await orderService.placeOrder(orderData);
      await clearCart();
      toast.success("Order placed successfully!");
      navigate('/my-orders');
    } catch (error) {
      console.error(error);
      toast.error("Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <h2 className="fw-bold mb-4 text-center">Checkout</h2>
      <Row>
        <Col md={8} className="mx-auto">
          <Card className="border-0 shadow-sm p-4">
            <Card.Body>
              <h5 className="mb-4 fw-bold">Shipping & Payment</h5>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label>Delivery Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter full delivery address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="bg-light border-0 p-3"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Payment Method</Form.Label>
                  <div className="d-flex gap-3">
                    <Form.Check
                      type="radio"
                      label="Cash on Delivery (COD)"
                      name="paymentMethod"
                      id="cod"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="border rounded p-3 flex-grow-1"
                    />
                     <Form.Check
                      type="radio"
                      label="Online Payment (Razorpay)"
                      name="paymentMethod"
                      id="online"
                      checked={paymentMethod === 'Online'}
                      onChange={() => setPaymentMethod('Online')}
                      className="border rounded p-3 flex-grow-1"
                    />
                  </div>
                </Form.Group>

                <div className="bg-light p-3 rounded mb-4">
                    <div className="d-flex justify-content-between mb-2">
                        <span>Subtotal</span>
                        <span>₹{cartTotal}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                        <span>Delivery Fee</span>
                        <span>₹30.00</span>
                    </div>
                    <hr/>
                    <div className="d-flex justify-content-between fw-bold fs-5">
                        <span>Total to Pay</span>
                        <span className="text-orange">₹{(cartTotal + 30).toFixed(2)}</span>
                    </div>
                </div>

                <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100 btn-primary-custom py-2"
                    disabled={loading}
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;
