import { Form, InputGroup, Dropdown, Button } from 'react-bootstrap';
import { FaSearch, FaBell, FaCommentAlt, FaUserCircle, FaSun, FaMoon } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';

const TopBar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
      logout();
      navigate('/login');
  }

  return (
    <div className="d-flex justify-content-between align-items-center py-3 px-4 bg-app-surface border-bottom sticky-top" style={{borderColor: 'var(--border-color)'}}>
      <h3 className="fw-bold mb-0 text-app-primary">Hello, {user?.name?.split(' ')[0] || 'User'}</h3>

      <div className="d-flex align-items-center gap-4">
        <InputGroup className="bg-app-light rounded-pill px-3 py-1" style={{ width: '300px', border: '1px solid var(--border-color)' }}>
          <InputGroup.Text className="bg-transparent border-0 ps-0 text-secondary">
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            placeholder="Search"
            className="bg-transparent border-0 shadow-none ps-1 text-app-primary"
            style={{ color: 'var(--text-dark)' }}
          />
        </InputGroup>

        <div className="d-flex align-items-center gap-3">
             <Button 
                variant="link" 
                onClick={toggleTheme} 
                className="text-secondary p-0 d-flex align-items-center justify-content-center"
                style={{ width: '40px', height: '40px', borderRadius: '50%' }}
            >
                {theme === 'light' ? <FaMoon size={20} /> : <FaSun size={20} className="text-warning"/>}
            </Button>
            
            <Dropdown align="end">
                <Dropdown.Toggle as="div" className="d-flex align-items-center gap-2 cursor-pointer text-decoration-none" id="dropdown-profile">
                    <div style={{width: '40px', height: '40px', overflow: 'hidden', borderRadius: '50%'}}>
                        <img src={user?.profileImage || 'https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0='} alt="Profile" className="w-100 h-100 object-fit-cover"/>
                    </div>
                    <div className="d-none d-md-block text-start">
                        <div className="fw-bold small text-app-primary">{user?.name || 'Guest User'}</div>
                        <div className="text-secondary small" style={{fontSize: '10px'}}>{user?.email}</div>
                    </div>
                </Dropdown.Toggle>

                <Dropdown.Menu className="border-0 shadow-lg" style={{backgroundColor: 'var(--bg-white)'}}>
                    <Dropdown.Item as={Link} to="/profile" className="text-app-primary">Profile</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/my-orders" className="text-app-primary">My Orders</Dropdown.Item>
                    <Dropdown.Divider style={{borderColor: 'var(--border-color)'}}/>
                    <Dropdown.Item onClick={handleLogout} className="text-danger">Logout</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
