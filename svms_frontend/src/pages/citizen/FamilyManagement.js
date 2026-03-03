import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Table, Badge, Modal } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import { hasPermission } from "../../utils/permissions";

const FamilyManagement = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMember, setCurrentMember] = useState({
    fullname: "",
    dob: "",
    gender: "Male",
    relationship: "Child",
    marital_status: "Single",
    occupation: "",
    status: "Alive",
    notes: ""
  });

  const token = localStorage.getItem("token");
  const baseURL = process.env.REACT_APP_BASE_URL;

  const fetchMembers = async () => {
    try {
      const response = await fetch(`${baseURL}/api/v1/family-members/my-family`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setMembers(data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch family records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEditing 
      ? `${baseURL}/api/v1/family-members/update/${currentMember.id}`
      : `${baseURL}/api/v1/family-members/add`;
    
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const resp = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(currentMember)
      });
      const data = await resp.json();
      if (data.success) {
        toast.success(data.message);
        setShowModal(false);
        fetchMembers();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  const handleEdit = (member) => {
    setCurrentMember(member);
    setIsEditing(true);
    setShowModal(true);
  };

  return (
    <Container fluid className="py-4" style={{ backgroundColor: "#000", minHeight: "100vh", color: "#fff" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-white">Household & Family Records</h2>
        {hasPermission('manage_family') && (
          <Button variant="primary" onClick={() => { setIsEditing(false); setCurrentMember({ fullname: "", relationship: "Child", gender: "Male", status: "Alive" }); setShowModal(true); }}>
            <i className="bi bi-person-plus me-2"></i> Add Family Member
          </Button>
        )}
      </div>

      <Card className="bg-dark text-white border-secondary">
        <Card.Body>
          <Table responsive variant="dark" hover className="mb-0">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Relationship</th>
                <th>Gender</th>
                <th>Status</th>
                <th>Occupation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map(member => (
                <tr key={member.id}>
                  <td>{member.fullname}</td>
                  <td>{member.relationship}</td>
                  <td>{member.gender}</td>
                  <td>
                    <Badge bg={member.status === 'Alive' ? 'success' : 'danger'}>
                      {member.status}
                    </Badge>
                  </td>
                  <td>{member.occupation || 'N/A'}</td>
                  <td>
                    <Button variant="outline-info" size="sm" className="me-2" onClick={() => handleEdit(member)}>
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
              {members.length === 0 && !loading && (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">No family members registered yet.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="bg-dark text-white border-secondary">
        <Modal.Header closeButton closeVariant="white" className="border-secondary">
          <Modal.Title>{isEditing ? 'Edit Member' : 'Add Family Member'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control 
                type="text" 
                required 
                className="bg-black text-white border-secondary"
                value={currentMember.fullname}
                onChange={e => setCurrentMember({...currentMember, fullname: e.target.value})}
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Relationship</Form.Label>
                  <Form.Select 
                    className="bg-black text-white border-secondary"
                    value={currentMember.relationship}
                    onChange={e => setCurrentMember({...currentMember, relationship: e.target.value})}
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Child">Child</option>
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select 
                    className="bg-black text-white border-secondary"
                    value={currentMember.status}
                    onChange={e => setCurrentMember({...currentMember, status: e.target.value})}
                  >
                    <option value="Alive">Alive</option>
                    <option value="Deceased">Deceased</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Occupation</Form.Label>
              <Form.Control 
                type="text" 
                className="bg-black text-white border-secondary"
                value={currentMember.occupation}
                onChange={e => setCurrentMember({...currentMember, occupation: e.target.value})}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-secondary">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit">{isEditing ? 'Save Changes' : 'Add Member'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <ToastContainer />
    </Container>
  );
};

export default FamilyManagement;
