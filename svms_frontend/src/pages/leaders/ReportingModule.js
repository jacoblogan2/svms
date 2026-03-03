import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Table, Badge, Alert } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';

const ReportingModule = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    type: "Monthly Population Update",
    summary: ""
  });

  const token = localStorage.getItem("token");
  const baseURL = process.env.REACT_APP_BASE_URL;

  const fetchReports = async () => {
    try {
      const response = await fetch(`${baseURL}/api/v1/reports/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setReports(data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseURL}/api/v1/reports/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Report generated and saved!");
        setFormData({ title: "", type: "Monthly Population Update", summary: "" });
        fetchReports();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to generate report");
    }
  };

  return (
    <Container fluid className="py-4" style={{ backgroundColor: "#000", minHeight: "100vh", color: "#fff" }}>
      <h2 className="mb-4 text-white">Administrative Reporting</h2>

      <Row className="gy-4">
        <Col lg={4}>
          <Card className="bg-dark text-white border-secondary">
            <Card.Body>
              <Card.Title>Generate New Report</Card.Title>
              <hr className="border-secondary" />
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Report Title</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="e.g., Q1 Village Progress" 
                    className="bg-black text-white border-secondary"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Report Type</Form.Label>
                  <Form.Select 
                    className="bg-black text-white border-secondary"
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                  >
                    <option>Monthly Population Update</option>
                    <option>Development Progress</option>
                    <option>Incident Summary</option>
                    <option>Custom Strategic Report</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Scope Summary</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={3} 
                    className="bg-black text-white border-secondary"
                    value={formData.summary}
                    onChange={e => setFormData({...formData, summary: e.target.value})}
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100">
                  Compile & Save Report
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <Card className="bg-dark text-white border-secondary">
            <Card.Body>
              <Card.Title>Archived Reports</Card.Title>
              <hr className="border-secondary" />
              <Table responsive variant="dark" hover className="mb-0">
                <thead>
                  <tr>
                    <th>Report Title</th>
                    <th>Type</th>
                    <th>Generated On</th>
                    <th>Population Stat</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map(report => (
                    <tr key={report.id}>
                      <td>{report.title}</td>
                      <td>{report.type}</td>
                      <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                      <td>
                        <Badge bg="info">Pop: {report.data?.population || 'N/A'}</Badge>
                      </td>
                      <td>
                        <Button variant="outline-light" size="sm">Download PDF</Button>
                      </td>
                    </tr>
                  ))}
                  {reports.length === 0 && !loading && (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-muted">No reports found in archive.</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <ToastContainer />
    </Container>
  );
};

export default ReportingModule;
