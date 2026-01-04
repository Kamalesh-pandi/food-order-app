import { Navbar, Container, Nav, Badge, NavDropdown, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FaShoppingCart, FaUser } from 'react-icons/fa';

const AppNavbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar expand="lg" className="shadow-sm sticky-top py-3 bg-app-surface border-bottom" style={{borderColor: 'var(--border-color)'}} collapseOnSelect>
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 text-orange">
          FoodOrder<span className="text-app-primary">App</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto ms-4">
            <Nav.Link as={Link} to="/" className="fw-medium text-app-primary">Home</Nav.Link>
            <Nav.Link as={Link} to="/menu" className="fw-medium text-app-primary">Menu</Nav.Link>
          </Nav>
          <Nav className="align-items-center">
            {user ? (
               <>
                <Nav.Link as={Link} to="/cart" className="position-relative me-3 text-app-primary">
                  <FaShoppingCart size={20} />
                  {cartItems.length > 0 && (
                    <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">
                      {cartItems.length}
                    </Badge>
                  )}
                </Nav.Link>
                <NavDropdown title={<span className="text-app-primary"><FaUser className="me-1"/> {user.name || 'User'}</span>} id="collasible-nav-dropdown" align="end">
                  <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/my-orders">My Orders</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                </NavDropdown>
               </>
            ) : (
                <div className="d-flex gap-2">
                    <Button variant="outline-dark" as={Link} to="/login" className="px-4 rounded-pill">Login</Button>
                    <Button variant="primary" as={Link} to="/signup" className="px-4 rounded-pill btn-primary-custom">Sign Up</Button>
                </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
