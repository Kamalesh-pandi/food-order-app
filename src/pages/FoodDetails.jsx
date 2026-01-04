import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Spinner, Badge } from 'react-bootstrap';
import foodService from '../services/foodService';
import { useCart } from '../context/CartContext';
import { FaArrowLeft, FaStar, FaShoppingCart } from 'react-icons/fa';

const FoodDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const data = await foodService.getFoodById(id);
        setFood(data);
      } catch (error) {
        console.error("Error fetching food details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFood();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(food.id, quantity);
  };

  if (loading) return <div className="text-center my-5"><Spinner animation="border" variant="danger"/></div>;
  if (!food) return <div className="text-center my-5"><h3>Food not found</h3><Button onClick={() => navigate('/menu')}>Back to Menu</Button></div>;

  return (
    <Container className="py-5">
      <Button variant="link" className="text-decoration-none text-dark mb-4 ps-0" onClick={() => navigate(-1)}>
        <FaArrowLeft className="me-2" /> Back
      </Button>
      <Row className="align-items-center">
        <Col md={6} className="mb-4 mb-md-0">
          <img 
            src={food.imageUrl || 'https://placehold.co/600x400'} 
            alt={food.name} 
            className="img-fluid rounded-4 shadow-lg w-100 object-fit-cover" 
            style={{maxHeight: '500px'}}
          />
        </Col>
        <Col md={6}>
          <div className="ps-md-4">
            <Badge bg="secondary" className="mb-2">{food.categoryName || 'Category'}</Badge>
            <h1 className="display-5 fw-bold mb-3">{food.name}</h1>
            <div className="d-flex align-items-center mb-4">
                <span className="text-warning me-2"><FaStar /> {food.rating || 4.5}</span>
                <span className="text-muted"> | </span>
                <span className="text-primary ms-2 fw-semibold">₹{food.price}</span>
            </div>
            <p className="lead text-muted mb-5">{food.description}</p>
            
            <div className="d-flex align-items-center gap-3 mb-4">
               <div className="d-flex align-items-center border rounded-pill px-3 py-1">
                   <Button variant="link" className="text-dark text-decoration-none p-0" onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</Button>
                   <span className="mx-3 fw-bold">{quantity}</span>
                   <Button variant="link" className="text-dark text-decoration-none p-0" onClick={() => setQuantity(q => q + 1)}>+</Button>
               </div>
               <Button variant="primary" size="lg" className="btn-primary-custom rounded-pill px-4" onClick={handleAddToCart}>
                   <FaShoppingCart className="me-2"/> Add to Cart
               </Button>
            </div>
            
            {/* Additional Info or Reviews could go here */}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default FoodDetails;
