import { useState, useEffect } from 'react';
import { Container, Table, Badge, Button, Modal, Spinner } from 'react-bootstrap';
import orderService from '../services/orderService';
import { toast } from 'react-toastify';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getMyOrders();
      // Safeguard: Ensure data is an array before sorting
      if (Array.isArray(data)) {
        setOrders(data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)));
      } else {
        setOrders([]);
        console.warn("Received non-array order data:", data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if(!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await orderService.cancelOrder(orderId);
      toast.success("Order cancelled successfully");
      fetchOrders();
    } catch (error) {
      console.error(error);
      const message = error.response?.data || "Failed to cancel order";
      toast.error(typeof message === 'string' ? message : "Failed to cancel order");
    }
  };

  const handleShowDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING': return <Badge bg="warning" text="dark">Pending</Badge>;
      case 'CONFIRMED': return <Badge bg="info">Confirmed</Badge>;
      case 'DELIVERED': return <Badge bg="success">Delivered</Badge>;
      case 'CANCELLED': return <Badge bg="danger">Cancelled</Badge>;
      default: return <Badge bg="secondary">{status}</Badge>;
    }
  };

  if (loading) return <div className="text-center my-5"><Spinner animation="border" variant="danger"/></div>;

  return (
    <Container className="py-5">
      <h2 className="fw-bold mb-4">My Orders</h2>
      {orders.length === 0 ? (
        <div className="alert alert-info">You have no orders yet.</div>
      ) : (
        <div className="table-responsive shadow-sm rounded">
          <Table hover className="mb-0 bg-white align-middle">
            <thead className="bg-light">
              <tr>
                <th className="py-3 ps-4">Order ID</th>
                <th className="py-3">Date</th>
                <th className="py-3">Amount</th>
                <th className="py-3">Status</th>
                <th className="py-3">Address</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td className="ps-4">#{order.id}</td>
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td className="fw-bold text-primary">₹{order.totalAmount}</td>
                  <td>{getStatusBadge(order.status)}</td>
                  <td className="text-truncate" style={{maxWidth: '200px'}}>{order.address}</td>
                  <td>
                    <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShowDetails(order)}>Details</Button>
                    {order.status === 'PENDING' && (
                      <Button variant="outline-danger" size="sm" onClick={() => handleCancelOrder(order.id)}>Cancel</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Order Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Order Details #{selectedOrder?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div>
              <div className="d-flex justify-content-between mb-3">
                  <div>
                      <strong>Date:</strong> {new Date(selectedOrder.orderDate).toLocaleString()}<br/>
                      <strong>Status:</strong> {selectedOrder.status}<br/>
                      <strong>Payment:</strong> {selectedOrder.paymentMethod}
                  </div>
                  <div className="text-end">
                      <strong>Address:</strong><br/>
                      {selectedOrder.address}
                  </div>
              </div>
              <Table size="sm">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th className="text-end">Price</th>
                    <th className="text-center">Qty</th>
                    <th className="text-end">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.foodName || `Food #${item.foodId}`}</td>
                      <td className="text-end text-primary">₹{item.price}</td>
                      <td className="text-center">{item.quantity}</td>
                      <td className="text-end text-primary">₹{item.totalPrice}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan="3" className="text-end fw-bold">Grand Total:</td>
                        <td className="text-end fw-bold text-primary">₹{selectedOrder.totalAmount}</td>
                    </tr>
                </tfoot>
              </Table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MyOrders;
