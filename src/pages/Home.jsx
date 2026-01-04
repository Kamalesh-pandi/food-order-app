import { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Spinner, Badge, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import foodService from '../services/foodService';
import { useCart } from '../context/CartContext';
import { FaFire, FaMotorcycle, FaUtensils, FaGem, FaMapMarkerAlt, FaWalking, FaStar, FaPlus, FaClock } from 'react-icons/fa';
import FoodCard from '../components/FoodCard';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [popularFoods, setPopularFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const slides = [
      {
          title: "Delicious Pizza",
          subtitle: "The best fast food in town",
          desc: "Experience the taste of premium dining at your doorstep. Fresh, fast, and tasty.",
          img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop",
          bg: "linear-gradient(135deg, var(--primary-color), var(--secondary-color))",
          badge: "Free Delivery"
      },
      {
          title: "Juicy Burgers",
          subtitle: "Flame grilled to perfection",
          desc: "Order our signature burgers with secret sauce and crispy fries.",
          img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1999&auto=format&fit=crop",
          bg: "linear-gradient(135deg, #ff6b6b, #ee5253)",
          badge: "20% OFF"
      },
      {
          title: "Fresh Salad",
          subtitle: "Healthy & Organic",
          desc: "Start your day with our fresh, organic and healthy green salads.",
          img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop",
          bg: "linear-gradient(135deg, #1dd1a1, #10ac84)",
          badge: "New Arrival"
      }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, foods] = await Promise.all([
          foodService.getAllCategories(),
          foodService.getAllFoods({ popular: true })
        ]);
        // Create a helper to validate array
        const validateArray = (data) => Array.isArray(data) ? data : [];
        
        setCategories(validateArray(cats)); 
        setPopularFoods(validateArray(foods).slice(0, 4)); 
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
      return (
          <div className="d-flex justify-content-center align-items-center" style={{minHeight: '60vh'}}>
              <Spinner animation="border" variant="warning" />
          </div>
      )
  }

  return (
    <div className="container-fluid px-0">
      {/* Hero Carousel */}
      <Carousel 
          className="mb-5 shadow-lg rounded-5 overflow-hidden" 
          interval={2500} 
          fade 
          indicators={true} 
          controls={false} 
          pause={false}
      >
          {slides.map((slide, idx) => (
              <Carousel.Item key={idx}>
                  <div className="p-4 text-white position-relative overflow-hidden" style={{ 
                      background: slide.bg,
                      minHeight: '250px',
                  }}>
                    <div className="position-absolute top-0 start-0 w-100 h-100" style={{background: 'url(https://www.transparenttextures.com/patterns/food.png)', opacity: 0.1}}></div>
                    <Row className="align-items-center position-relative z-1 h-100">
                        <Col md={7} className="d-flex flex-column justify-content-center">
                            <div className="mb-2">
                                <Badge bg="white" text="dark" className="px-3 py-2 rounded-pill fw-bold shadow-sm text-uppercase" style={{letterSpacing: '1px', fontSize: '0.7rem'}}>{slide.badge}</Badge>
                            </div>
                            <div className="opacity-90 small text-uppercase fw-bold mb-1" style={{letterSpacing: '2px'}}>{slide.subtitle}</div>
                            <h1 className="fw-black display-5 mb-2 lh-sm text-white">{slide.title}</h1>
                            <p className="lead mb-3 opacity-90 small d-none d-sm-block" style={{maxWidth: '450px', fontWeight: 500, fontSize: '0.9rem'}}>
                                {slide.desc}
                            </p>
                            <div>
                                <Button variant="light" size="md" className="rounded-pill px-4 fw-bold text-primary shadow-sm hover-scale" as={Link} to="/menu">
                                    Order Now <FaUtensils className="ms-2"/>
                                </Button>
                            </div>
                        </Col>
                        <Col md={5} className="d-none d-md-block position-relative text-center">
                             <img 
                                src={slide.img} 
                                alt={slide.title} 
                                className="img-fluid rounded-circle shadow-lg floating-animation"
                                style={{
                                    width: '240px',
                                    height: '240px',
                                    objectFit: 'cover',
                                    border: '6px solid rgba(255,255,255,0.3)',
                                }}
                             />
                        </Col>
                    </Row>
                  </div>
              </Carousel.Item>
          ))}
      </Carousel>

      {/* Explore Categories */}
      <div className="d-flex justify-content-between align-items-end mb-4 px-2">
        <div>
            <h6 className="text-secondary text-uppercase fw-bold mb-1" style={{letterSpacing: '1px', fontSize: '0.8rem'}}>What's on your mind?</h6>
            <h2 className="fw-bold mb-0 text-app-primary">Explore Categories</h2>
        </div>
        <Link to="/menu" className="btn btn-outline-primary rounded-pill px-4 fw-bold small">View All</Link>
      </div>

      <Row className="g-3 mb-5">
          {Array.isArray(categories) && categories.slice(0, 6).map((cat, idx) => (
              <Col key={cat.id} xs={6} md={3} lg={2}>
                  <Link to={`/menu?categoryId=${cat.id}`} className="text-decoration-none">
                    <Card className="border-0 shadow-sm text-center h-100 category-card hover-scale-up transition-all bg-app-surface" 
                          style={{
                              borderRadius: '25px',
                              cursor: 'pointer'
                          }}
                    >
                        <Card.Body className="p-3 d-flex flex-column align-items-center justify-content-center">
                            <div className="mb-3 rounded-circle p-1 d-flex align-items-center justify-content-center shadow-sm" 
                                 style={{
                                     width: '65px', 
                                     height: '65px', 
                                     background: 'var(--bg-light)'
                                 }}
                            >
                                <img src={cat.imageUrl} alt={cat.name} className="w-100 h-100 rounded-circle object-fit-cover" />
                            </div>
                            <h6 className="fw-bold mb-1 text-app-primary">{cat.name}</h6>
                            <div className="small text-secondary" style={{fontSize: '0.75rem'}}>
                                View Menu <FaUtensils className="ms-1" size={10}/>
                            </div>
                        </Card.Body>
                    </Card>
                  </Link>
              </Col>
          ))}
      </Row>

      {/* Popular Dishes */}
      <div className="d-flex justify-content-between align-items-end mb-4 px-2">
        <div>
             <h6 className="text-secondary text-uppercase fw-bold mb-1" style={{letterSpacing: '1px', fontSize: '0.8rem'}}>Top Rated</h6>
             <h2 className="fw-bold mb-0 text-app-primary">Popular Dishes</h2>
        </div>
        <Link to="/menu" className="btn btn-outline-primary rounded-pill px-4 fw-bold small">View All</Link>
      </div>

      <Row xs={1} md={2} xl={4} className="g-4 mb-5">
          {popularFoods.map(food => (
              <Col key={food.id}>
                  <FoodCard food={food} />
              </Col>
          ))}
      </Row>
      
    </div>
  );
};

export default Home;
