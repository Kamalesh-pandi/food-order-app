import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { FaStar, FaFire, FaClock, FaPlus } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const FoodCard = ({ food }) => {
  const { addToCart } = useCart();

  return (
      <Card className="border-0 shadow-hover rounded-4 h-100 overflow-hidden bg-app-surface transition-all">
          <Link to={`/food/${food.id}`} className="text-decoration-none text-app-primary">
            <div className="position-relative">
                <img 
                    src={food.imageUrl || 'https://via.placeholder.com/300'} 
                    alt={food.name}
                    className="w-100 object-fit-cover"
                    style={{height: '220px'}} 
                />
                <Badge bg="white" text="dark" className="position-absolute top-0 start-0 m-3 px-3 py-2 rounded-3 fw-bold shadow-sm">
                    <FaStar className="text-warning me-1"/> {food.rating || 4.8}
                </Badge>
                <Button 
                      variant="light" 
                      className="position-absolute top-0 end-0 m-3 rounded-circle shadow-sm p-0 d-flex align-items-center justify-content-center text-danger"
                      style={{width: '35px', height: '35px'}}
                >
                    <FaFire size={14}/>
                </Button>
            </div>
          </Link>
          <Card.Body className="p-4 d-flex flex-column">
              <Link to={`/food/${food.id}`} className="text-decoration-none text-app-primary">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="fw-bold text-app-primary text-truncate mb-0" title={food.name}>{food.name}</h5>
                  </div>
              </Link>
              <div className="small text-secondary mb-3 d-flex align-items-center">
                  <FaClock className="me-1 text-secondary"/> 25-30 min • Free Delivery
              </div>
              
              <div className="mt-auto d-flex justify-content-between align-items-center">
                  <h4 className="fw-bold mb-0" style={{color: 'var(--primary-color)'}}>₹{food.price}</h4>
                  <Button 
                      variant="primary" 
                      size="sm" 
                      className="rounded-pill px-3 py-2 fw-bold text-white shadow-sm d-flex align-items-center btn-hover-effect"
                      onClick={(e) => {
                          e.preventDefault();
                          addToCart(food.id);
                      }}
                      style={{background: 'var(--primary-color)', border: 'none'}}
                  >
                      Add <FaPlus className="ms-2" size={10}/>
                  </Button>
              </div>
          </Card.Body>
      </Card>
  );
};

export default FoodCard;
