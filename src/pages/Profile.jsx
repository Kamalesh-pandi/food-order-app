import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    password: '', // Optional to prevent accidental change
  });
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        address: user.address || '',
        password: '',
      });
      if(user.profileImage) {
          // Assuming backend returns full URL or we need to prepend base
          // If it's just filename, prepending logic might be needed here or in service
          setPreview(user.profileImage);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
          setSelectedFile(file);
          setPreview(URL.createObjectURL(file));
      }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('fullName', formData.fullName);
    data.append('email', formData.email);
    data.append('phoneNumber', formData.phoneNumber);
    data.append('address', formData.address);
    if (formData.password) data.append('password', formData.password);
    if (selectedFile) data.append('profileImage', selectedFile);

    try {
      const updatedUser = await authService.updateProfile(data);
      updateUser(updatedUser); // Update context
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-lg border-0 rounded-4 bg-app-surface transition-all">
            <Card.Body className="p-4">
              <h3 className="fw-bold mb-4 text-center text-app-primary">My Profile</h3>
              <Form onSubmit={handleSubmit}>
                <div className="text-center mb-4">
                    <div style={{width: '100px', height: '100px', margin: '0 auto', overflow: 'hidden', borderRadius: '50%', border: '3px solid #ff5e00'}}>
                        <img 
                            src={preview || 'https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0='} 
                            alt="Profile" 
                            className="w-100 h-100 object-fit-cover" 
                        />
                    </div>
                    <Form.Label htmlFor="profileImage" className="btn btn-sm btn-outline-primary mt-2">Change Photo</Form.Label>
                    <Form.Control 
                        type="file" 
                        id="profileImage" 
                        onChange={handleFileChange} 
                        style={{display: 'none'}} 
                        accept="image/*"
                    />
                </div>

                <Form.Group className="mb-3">
                  <Form.Label className="text-secondary fw-bold small">Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="bg-app-light border-0 p-3 text-app-primary"
                    style={{color: 'var(--text-dark)'}}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="text-secondary fw-bold small">Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-app-light border-0 p-3 text-app-primary"
                    style={{color: 'var(--text-dark)', opacity: 0.7}}
                    disabled // Often emails are immutable
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label className="text-secondary fw-bold small">Phone Number</Form.Label>
                  <Form.Control
                    type="number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="bg-app-light border-0 p-3 text-app-primary"
                    placeholder="Enter phone number"
                    style={{color: 'var(--text-dark)'}}
                  />
                </Form.Group>
                
                 <Form.Group className="mb-3">
                  <Form.Label className="text-secondary fw-bold small">Default Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="bg-app-light border-0 p-3 text-app-primary"
                    placeholder="Enter default delivery address"
                    style={{color: 'var(--text-dark)'}}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="text-secondary fw-bold small">New Password (Optional)</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="bg-app-light border-0 p-3 text-app-primary"
                    placeholder="Leave blank to keep current"
                    style={{color: 'var(--text-dark)'}}
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 btn-primary-custom" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
