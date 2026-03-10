import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEye } from "react-icons/fa";
import { Button, Modal, Table, Pagination, Badge, Col } from "react-bootstrap";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 5;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/users/requests/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(response.data.requests);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };
    fetchRequests();
  }, []);

  const handleView = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };


  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = requests.slice(indexOfFirstRequest, indexOfLastRequest);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Badge bg="warning" text="dark">Pending</Badge>;
      case "approved":
        return <Badge bg="success">Approved</Badge>;
      case "rejected":
        return <Badge bg="danger">Rejected</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="container mt-4">
      <h2>Requests</h2>
      <Table striped bordered hover className="table-dark">
        <thead>
          <tr>
            <th>ID</th>
            {/* <th>Reason</th> */}
            
            <th>current Town</th>
            <th>Destination Town</th>
            <th>Requested date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentRequests.map((request) => (
            <tr key={request.id}>
              <td>{request.id}</td>
              {/* <td>{request.reason || "N/A"}</td> */}
              <td>{request.current_town?.name || request.user?.town?.name || "N/A"}</td>
              <td>{request.town?.name || "N/A"}</td>
             
              <td>{new Date(request.createdAt).toLocaleDateString()}</td>
              <td>{getStatusBadge(request.status)}</td>
              <td>
                <FaEye onClick={() => handleView(request)} style={{ cursor: "pointer" }} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination>
        {[...Array(Math.ceil(requests.length / requestsPerPage)).keys()].map((number) => (
          <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => paginate(number + 1)}>
            {number + 1}
          </Pagination.Item>
        ))}
      </Pagination>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Request Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRequest && (
            <div className="text-dark">
              <div className="section mb-3 p-3 bg-light border rounded">
                <h6 className="text-secondary fw-bold text-uppercase small mb-2">Section 1: Citizen Identity</h6>
                <p className="mb-1"><strong>Name:</strong> {selectedRequest.full_name || `${selectedRequest.user?.firstname} ${selectedRequest.user?.lastname}`}</p>
                <p className="mb-1"><strong>National ID:</strong> {selectedRequest.national_id || selectedRequest.user?.nid || "N/A"}</p>
                <p className="mb-1"><strong>Phone:</strong> {selectedRequest.phone_number || selectedRequest.user?.phone || "N/A"}</p>
                <p className="mb-0"><strong>Household Size:</strong> {selectedRequest.household_size || "1"}</p>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <div className="p-3 bg-light border rounded h-100">
                    <h6 className="text-secondary fw-bold text-uppercase small mb-2">Current Location</h6>
                    <p className="mb-1 small"><strong>County:</strong> {selectedRequest.current_county?.name || selectedRequest.user?.county?.name || "N/A"}</p>
                    <p className="mb-1 small"><strong>Town:</strong> {selectedRequest.current_town?.name || selectedRequest.user?.town?.name || "N/A"}</p>
                    <p className="mb-0 small"><strong>Village:</strong> {selectedRequest.current_village?.name || selectedRequest.user?.village?.name || "N/A"}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 bg-warning-subtle border border-warning-low-light rounded h-100">
                    <h6 className="text-warning-emphasis fw-bold text-uppercase small mb-2">Destination</h6>
                    <p className="mb-1 small"><strong>County:</strong> {selectedRequest.county?.name || "N/A"}</p>
                    <p className="mb-1 small"><strong>Town:</strong> {selectedRequest.town?.name || "N/A"}</p>
                    <p className="mb-0 small"><strong>Village:</strong> {selectedRequest.village?.name || "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className="section mb-3 p-3 bg-success-subtle border rounded">
                <h6 className="text-success-emphasis fw-bold text-uppercase small mb-2">Transfer Details</h6>
                <div className="row">
                  <Col md={6}><p className="mb-1 small"><strong>Type:</strong> {selectedRequest.transfer_type || "N/A"}</p></Col>
                  <Col md={6}><p className="mb-1 small"><strong>Move Date:</strong> {selectedRequest.move_date ? new Date(selectedRequest.move_date).toLocaleDateString() : "N/A"}</p></Col>
                  <Col md={6}><p className="mb-1 small"><strong>Duration:</strong> {selectedRequest.transfer_duration || "N/A"}</p></Col>
                </div>
                <hr className="my-2" />
                <p className="mb-1"><strong>Reason:</strong></p>
                <p className="bg-white p-2 border rounded small mb-2">{selectedRequest.reason}</p>
                {selectedRequest.supporting_document && (
                  <div className="mt-2">
                    <a href={selectedRequest.supporting_document} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-success">
                      <i className="bi bi-file-earmark-arrow-down me-1"></i> View Supporting Document
                    </a>
                  </div>
                )}
              </div>

              {selectedRequest.host_name && (
                <div className="section mb-3 p-3 bg-light border rounded">
                  <h6 className="text-secondary fw-bold text-uppercase small mb-2">Host Information</h6>
                  <p className="mb-1"><strong>Host:</strong> {selectedRequest.host_name}</p>
                  <p className="mb-1"><strong>Phone:</strong> {selectedRequest.host_phone}</p>
                  <p className="mb-0"><strong>Relationship:</strong> {selectedRequest.host_relationship}</p>
                </div>
              )}

              <div className="d-flex justify-content-between text-muted small mt-3 px-2">
                <span>Requested: {new Date(selectedRequest.createdAt).toLocaleString()}</span>
                <span>Status: {getStatusBadge(selectedRequest.status)}</span>
              </div>
            </div>
          )}
        </Modal.Body>
   
  
      </Modal>
    </div>
  );
};

export default Requests;