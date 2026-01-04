import { Card, Button } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { FaExchangeAlt, FaArrowUp, FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const RightPanel = () => {
  const { cartItems, cartTotal } = useCart();
  const navigate = useNavigate();

  return (
    <div className="bg-white h-100 p-4 position-fixed top-0 end-0 d-none d-xl-block" style={{ width: 'var(--right-panel-width)', borderLeft: '1px solid #f0f0f0', overflowY: 'auto' }}>
      
      {/* Balance Card */}
      <h5 className="fw-bold mb-3">My Balance</h5>
      <Card className="border-0 text-white mb-4" style={{ 
          background: 'linear-gradient(135deg, var(--secondary-color), var(--primary-color))',
          borderRadius: '20px',
          boxShadow: 'var(--shadow-card)'
      }}>
        <Card.Body className="p-4">
          <div className="mb-2 opacity-75 small">Balance</div>
          <h2 className="mb-4">$5789.76</h2>

        </Card.Body>
      </Card>

      {/* My Order (Mini Cart) */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0">My Order</h5>
        <span className="text-primary fw-bold cursor-pointer" onClick={() => navigate('/cart')}>Edit</span>
      </div>

      {cartItems.length === 0 ? (
          <div className="text-center text-secondary py-5">
              <FaShoppingCart size={40} className="mb-3 opacity-25"/>
              <p>Your cart is empty</p>
          </div>
      ) : (
          <div className="d-flex flex-column gap-3 mb-4">
              {cartItems.map(item => (
                  <Card key={item.foodId} className="border-0 shadow-sm rounded-4">
                      <Card.Body className="p-2 d-flex align-items-center">
                          <img 
                            src={item.imageUrl || 'https://via.placeholder.com/50'} 
                            alt={item.foodName} 
                            style={{width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover'}}
                            className="me-3"
                          />
                          <div className="flex-grow-1">
                              <h6 className="mb-1 text-truncate" style={{maxWidth: '120px'}}>{item.foodName}</h6>
                              <div className="fw-bold text-primary">${item.totalPrice}</div>
                          </div>
                          <div className="bg-light rounded px-2 py-1 fw-bold text-dark">
                              x{item.quantity}
                          </div>
                      </Card.Body>
                  </Card>
              ))}
          </div>
      )}

      {/* Summary */}
      <div className="mt-auto">
          <div className="d-flex justify-content-between mb-2 small text-secondary">
              <span>Service</span>
              <span>$2.00</span>
          </div>
          <div className="d-flex justify-content-between mb-3 small text-secondary">
              <span>Total</span>
              <span className="fw-bold text-dark fs-5">${(cartTotal + 2).toFixed(2)}</span>
          </div>
          <Button 
            className="w-100 btn-primary-custom py-3 rounded-4 fw-bold" 
            style={{background: 'var(--primary-color)'}}
            onClick={() => navigate('/checkout')}
            disabled={cartItems.length === 0}
          >
              Checkout
          </Button>
      </div>

    </div>
  );
};

export default RightPanel;
