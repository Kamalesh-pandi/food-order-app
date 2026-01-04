import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-5 mt-auto">
      <Container>
        <Row className="g-4">
          <Col md={4}>
            <h4 className="text-orange fw-bold mb-3">FoodOrderApp</h4>
            <p className="text-secondary">Delivering happiness to your doorstep. The best food from the best restaurants.</p>
          </Col>
          <Col md={4}>
            <h5 className="mb-3">Quick Links</h5>
            <ul className="list-unstyled text-secondary">
              <li className="mb-2"><a href="#" className="text-decoration-none text-secondary hover-white">About Us</a></li>
              <li className="mb-2"><a href="#" className="text-decoration-none text-secondary hover-white">Terms of Use</a></li>
              <li className="mb-2"><a href="#" className="text-decoration-none text-secondary hover-white">Privacy Policy</a></li>
            </ul>
          </Col>
          <Col md={4}>
            <h5 className="mb-3">Connect With Us</h5>
             <div className="d-flex gap-3">
                <FaFacebook size={24} className="text-secondary cursor-pointer hover-white" />
                <FaTwitter size={24} className="text-secondary cursor-pointer hover-white" />
                <FaInstagram size={24} className="text-secondary cursor-pointer hover-white" />
             </div>
             <p className="mt-3 text-secondary">&copy; 2024 FoodOrderApp. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
