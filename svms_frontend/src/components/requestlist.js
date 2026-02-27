import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEye } from "react-icons/fa";
import { Button, Modal, Table, Pagination, Badge } from "react-bootstrap";

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
              {/* <td>{request.reson || "N/A"}</td> */}
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
            <div>
              
              <p><strong>Citizen names:</strong> {selectedRequest.user?.firstname} {selectedRequest.user?.lastname}</p>
              <p><strong>Email:</strong> {selectedRequest.user?.email}</p>
              <p><strong>Phone:</strong> {selectedRequest.user?.phone}</p>
              <p><strong>Reason:</strong> {selectedRequest.reson}</p>
              <p><strong>Status:</strong> {getStatusBadge(selectedRequest.status)}</p>
              <div style={{ display: "flex", gap: "20px", justifyContent: "space-between" }}>
  {/* Destination Location Card */}
  <div style={{
    flex: "0 0 48%",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "15px",
    boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff"
  }}>
    <h5 style={{ marginBottom: "10px", color: "#333" }}>Destination Location</h5>
    <p><strong>County:</strong> {selectedRequest.county?.name}</p>
    <p><strong>District:</strong> {selectedRequest.district?.name}</p>
    <p><strong>Clan:</strong> {selectedRequest.clan?.name}</p>
    <p><strong>Town:</strong> {selectedRequest.town?.name}</p>
    <p><strong>Village:</strong> {selectedRequest.village?.name}</p>
  </div>

  {/* Current Location Card */}
  <div style={{
    flex: "0 0 48%",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "15px",
    boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff"
  }}>
    <h5 style={{ marginBottom: "10px", color: "#333" }}>Current Location</h5>
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
   
  
      </Modal>
    </div>
  );
};

export default Requests;