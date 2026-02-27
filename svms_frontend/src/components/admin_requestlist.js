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
            <div>
              <p><strong>Citizen names:</strong> {selectedRequest.user?.firstname} {selectedRequest.user?.lastname}</p>
              <p><strong>Email:</strong> {selectedRequest.user?.email}</p>
              <p><strong>Phone:</strong> {selectedRequest.user?.phone}</p>
              <p><strong>Reason:</strong> {selectedRequest.reason}</p>
              <p><strong>Status:</strong> {getStatusBadge(selectedRequest.status)}</p>
              <div style={{ display: "flex", gap: "20px", justifyContent: "space-between" }}>
                <div style={{ flex: "0 0 48%", padding: "15px", backgroundColor: "whitesmoke", borderRadius: "8px" }}>
                  <h5>Destination Location</h5>
                  <p><strong>County:</strong> {selectedRequest.county?.name}</p>
                  <p><strong>District:</strong> {selectedRequest.district?.name}</p>
                  <p><strong>Clan:</strong> {selectedRequest.clan?.name}</p>
                  <p><strong>Town:</strong> {selectedRequest.town?.name}</p>
                  <p><strong>Village:</strong> {selectedRequest.village?.name}</p>
                </div>

                <div style={{ flex: "0 0 48%", padding: "15px", backgroundColor: "whitesmoke", borderRadius: "8px" }}>
                  <h5>Current Location</h5>
                  <p><strong>County:</strong> {selectedRequest.user?.county?.name}</p>
                  <p><strong>District:</strong> {selectedRequest.user?.district?.name}</p>
                  <p><strong>Clan:</strong> {selectedRequest.user?.clan?.name}</p>
                  <p><strong>Town:</strong> {selectedRequest.user?.town?.name}</p>
                  <p><strong>Village:</strong> {selectedRequest.user?.village?.name}</p>
                </div>
              </div>
              <p><strong>Created At:</strong> {new Date(selectedRequest.createdAt).toLocaleString()}</p>
              <p><strong>Updated At:</strong> {new Date(selectedRequest.updatedAt).toLocaleString()}</p>
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
