import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Table, Badge, Modal } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import { hasPermission } from "../../utils/permissions";

const FamilyManagement = () => {
  const [submitting, setSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  // ✅ FIX 1: All missing state declarations added
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMember, setCurrentMember] = useState({
    fullname: "",
    relationship: "Child",
    gender: "Male",
    dob: "",
    status: "Alive",
    occupation: ""
  });

  const token = localStorage.getItem("token");
  const baseURL = process.env.REACT_APP_BASE_URL;

  const fetchMembers = React.useCallback(async () => {
    try {
      setFetchError(false);
      const response = await fetch(`${baseURL}/api/v1/family-members/my-family`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      if (data.success) {
        setMembers(data.data || []);
      }
    } catch (error) {
      setFetchError(true);
      toast.error("Failed to fetch family records. Please try again later.", { toastId: "fetch-family-error" });
    } finally {
      setLoading(false);
    }
  }, [baseURL, token]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

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

  // ✅ FIX 2: Guard hasPermission call — only invoke after loading is done
  //    and wrap in try/catch so a missing user context won't crash the render
  const canManageFamily = (() => {
    try {
      return !loading && hasPermission('manage_family');
    } catch {
      return false;
    }
  })();

  return (
    <main id="main" className="main py-4">
      <div className="pagetitle mb-4">
        <h2 className="text-white">Household & Family Records</h2>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="/">Home</a></li>
            <li className="breadcrumb-item active" style={{ color: "#f6c90e" }}>family</li>
          </ol>
        </nav>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="text-muted small text-uppercase fw-bold">Manage Household members</h4>
        {canManageFamily && (
          <Button
            variant="primary"
            onClick={() => {
              setIsEditing(false);
              setCurrentMember({ fullname: "", relationship: "Child", gender: "Male", status: "Alive", occupation: "" });
              setShowModal(true);
            }}
          >
            <i className="bi bi-person-plus me-2"></i> Add Family Member
          </Button>
        )}
      </div>

      <Card className="bg-dark text-white border-secondary">
        <Card.Body>
          {loading ? (
            <p className="text-center text-muted py-4">Loading...</p>
          ) : (
            <Table responsive variant="dark" hover className="mb-0">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Relationship</th>
                  <th>Gender</th>
                  <th>Age (DOB)</th>
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
                      {member.dob ? (
                        `${Math.floor((new Date() - new Date(member.dob)) / 31557600000)} yrs`
                      ) : 'N/A'}
                    </td>
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
                {members.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">No family members registered yet.</td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
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
                onChange={e => setCurrentMember({ ...currentMember, fullname: e.target.value })}
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Gender <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    className="bg-black text-white border-secondary"
                    value={currentMember.gender}
                    onChange={e => setCurrentMember({ ...currentMember, gender: e.target.value })}
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date of Birth <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="date"
                    className="bg-black text-white border-secondary"
                    value={currentMember.dob ? currentMember.dob.substring(0, 10) : ""}
                    onChange={e => setCurrentMember({ ...currentMember, dob: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Relationship</Form.Label>
                  <Form.Select
                    className="bg-black text-white border-secondary"
                    value={currentMember.relationship}
                    onChange={e => setCurrentMember({ ...currentMember, relationship: e.target.value })}
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
                    onChange={e => setCurrentMember({ ...currentMember, status: e.target.value })}
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
                value={currentMember.occupation || ""}
                onChange={e => setCurrentMember({ ...currentMember, occupation: e.target.value })}
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
    </main>
  );
};

export default FamilyManagement;