import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Spinner, Nav } from 'react-bootstrap';
import { useSearchParams, Link } from 'react-router-dom';
import foodService from '../services/foodService';
import { useCart } from '../context/CartContext';
import FoodCard from '../components/FoodCard';

const Menu = () => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategoryId = searchParams.get('categoryId');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const cats = await foodService.getAllCategories();
        // Safeguard: Ensure data is an array
        setCategories(Array.isArray(cats) ? cats : []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchFoods = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedCategoryId && selectedCategoryId !== 'all') {
          params.categoryId = selectedCategoryId;
        }
        const data = await foodService.getAllFoods(params);
        // Safeguard: Ensure data is an array
        setFoods(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching foods:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, [selectedCategoryId]);

  const handleCategorySelect = (id) => {
    if (id === 'all') {
      searchParams.delete('categoryId');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ categoryId: id });
    }
  };

  return (
    <div className="container-fluid px-0">
      <h2 className="fw-bold mb-4 text-center text-app-primary">Our Menu</h2>
      
      {/* Category Filter */}
      <Nav variant="pills" className="justify-content-center mb-5 gap-2" activeKey={selectedCategoryId || 'all'}>
        <Nav.Item>
          <Nav.Link 
            eventKey="all" 
            onClick={() => handleCategorySelect('all')} 
            className={`rounded-pill px-4 border ${!selectedCategoryId ? 'text-white border-primary' : 'bg-app-surface text-app-primary shadow-sm border-0'}`}
            style={{ 
                backgroundColor: !selectedCategoryId ? 'var(--primary-color)' : 'var(--bg-white)',
                transition: 'all 0.3s ease'
             }}
          >
            All
          </Nav.Link>
        </Nav.Item>
        {categories.map(cat => (
          <Nav.Item key={cat.id}>
            <Nav.Link 
                eventKey={cat.id.toString()} 
                onClick={() => handleCategorySelect(cat.id)}
                className={`rounded-pill px-4 border ${selectedCategoryId === cat.id.toString() ? 'text-white border-primary' : 'bg-app-surface text-app-primary shadow-sm border-0'}`}
                style={{ 
                    backgroundColor: selectedCategoryId === cat.id.toString() ? 'var(--primary-color)' : 'var(--bg-white)',
                    transition: 'all 0.3s ease'
                }}
            >
              {cat.name}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>

      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <Spinner animation="border" variant="warning" />
        </div>
      ) : (
        <>
            {foods.length === 0 ? (
                <div className="text-center text-muted my-5">
                    <h4>No items found in this category.</h4>
                </div>
            ) : (
                <Row xs={1} md={2} xl={3} className="g-4">
                {foods.map(food => (
                    <Col key={food.id}>
                        <FoodCard food={food} />
                    </Col>
                ))}
                </Row>
            )}
        </>
      )}
    </div>
  );
};

export default Menu;
