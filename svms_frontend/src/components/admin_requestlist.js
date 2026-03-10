import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEye } from "react-icons/fa";
import { Button, Modal, Table, Pagination, Badge } from "react-bootstrap";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [townFilter, setTownFilter] = useState('');
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

  const filteredRequests = requests.filter((request) => {
    return (
      (statusFilter === '' || request.status.toLowerCase() === statusFilter.toLowerCase()) &&
      (townFilter === '' || request.user.town?.name.toLowerCase().includes(townFilter.toLowerCase()))
    );
  });

  const handleView = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/v1/users/requests/approve/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status: "approved" } : req)));
      setShowModal(false);
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/v1/users/requests/reject/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status: "rejected" } : req)));
      setShowModal(false);
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);

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
      <div className="d-flex mb-3">
        <input
          type="text"
          placeholder="Search by Town"
          value={townFilter}
          onChange={(e) => setTownFilter(e.target.value)}
          className="form-control me-2"
        />
        <select
          className="form-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <Table striped bordered hover className="table-dark">
        <thead>
          <tr>
            <th>ID</th>
            <th>Current Town</th>
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
              <td>{request.user.town?.name}</td>
              <td>{request.town?.name}</td>
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
        {[...Array(Math.ceil(filteredRequests.length / requestsPerPage)).keys()].map((number) => (
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
                    <p className="mb-1 small"><strong>County:</strong> {selectedRequest.user?.county?.name || "N/A"}</p>
                    <p className="mb-1 small"><strong>Town:</strong> {selectedRequest.user?.town?.name || "N/A"}</p>
                    <p className="mb-0 small"><strong>Village:</strong> {selectedRequest.user?.village?.name || "N/A"}</p>
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
                  <div className="col-md-6"><p className="mb-1 small"><strong>Type:</strong> {selectedRequest.transfer_type || "N/A"}</p></div>
                  <div className="col-md-6"><p className="mb-1 small"><strong>Move Date:</strong> {selectedRequest.move_date ? new Date(selectedRequest.move_date).toLocaleDateString() : "N/A"}</p></div>
                  <div className="col-md-6"><p className="mb-1 small"><strong>Duration:</strong> {selectedRequest.transfer_duration || "N/A"}</p></div>
                </div>
                <hr className="my-2" />
                <p className="mb-1"><strong>Reason:</strong></p>
                <p className="bg-white p-2 border rounded small mb-2">{selectedRequest.reason}</p>
                {selectedRequest.supporting_document && (
                  <div className="mt-2 text-center">
                    <a href={selectedRequest.supporting_document} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-success">
                      <i className="bi bi-file-earmark-arrow-down me-1"></i> Download Supporting Document
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
        <Modal.Footer>
          <Button variant="success" onClick={() => handleApprove(selectedRequest.id)}>
            Approve
          </Button>
          <Button variant="danger" onClick={() => handleReject(selectedRequest.id)}>
            Reject
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Requests;
