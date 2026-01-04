import { Link, useLocation } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { FaThLarge, FaUtensils, FaTh, FaCommentDots, FaLayerGroup, FaHistory, FaFileInvoiceDollar, FaUser } from 'react-icons/fa';
import foodLogo from '../assets/food logo.png';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: FaThLarge },
    { name: 'Food Order', path: '/menu', icon: FaUtensils },
    { name: 'Order History', path: '/my-orders', icon: FaHistory },
    { name: 'Profile', path: '/profile', icon: FaUser },
  ];

  return (
    <div className="vh-100 position-fixed top-0 start-0 p-3 sidebar d-flex flex-column border-end" style={{ width: 'var(--sidebar-width)', zIndex: 1040, overflowY: 'auto', backgroundColor: 'var(--bg-sidebar)', borderColor: 'var(--border-color)' }}>
      <div className="d-flex align-items-center mb-5 ps-2">
        <div style={{width: '40px', height: '40px', marginRight: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <img src={foodLogo} alt="FoodCafe Logo" style={{width: '100%', height: '100%', objectFit: 'contain'}} />
        </div>
        <h4 className="fw-bold mb-0" style={{ color: 'var(--primary-color)' }}>FoodCafe</h4>
      </div>

      <Nav className="flex-column gap-2 mb-auto">
        {navItems.map((item, index) => (
          <Nav.Link 
            key={index}
            as={!item.disabled ? Link : 'span'} 
            to={item.path} 
            className={`d-flex align-items-center px-3 py-2 rounded-3 ${location.pathname === item.path ? 'text-white' : ''}`}
            style={{ 
                opacity: item.disabled ? 0.5 : 1, 
                backgroundColor: location.pathname === item.path ? 'var(--primary-color)' : 'transparent',
                fontWeight: location.pathname === item.path ? 600 : 400,
                color: location.pathname === item.path ? 'white' : 'var(--text-secondary)'
            }}
          >
            <item.icon className="me-3" size={18} />
            {item.name}
          </Nav.Link>
        ))}
      </Nav>

      <div className="mt-4">


           <Link to="/cart" className="text-decoration-none">
                <div className="text-white p-3 rounded-4 d-flex align-items-center justify-content-between shadow-sm hover-card" style={{backgroundColor: 'var(--primary-color)'}}>
                    <div>
                        <div className="fw-bold">My Order</div>
                        <div className="small opacity-75">View Cart</div>
                    </div>
                </div>
           </Link>
      </div>
    </div>
  );
};

export default Sidebar;
