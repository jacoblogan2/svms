import React, { useState, useEffect, useCallback } from "react";
import { Row, Col, Card, Form, Button, Table, Badge, Tabs, Tab, Spinner } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';

const ReportingModule = () => {
  const [myReports, setMyReports] = useState([]);
  const [receivedReports, setReceivedReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("my-reports");
  
  const [formData, setFormData] = useState({
    title: "",
    type: "Monthly Population Update",
    summary: ""
  });

  const token = localStorage.getItem("token");
  const baseURL = process.env.REACT_APP_BASE_URL;

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch My Reports
      const myRes = await fetch(`${baseURL}/api/v1/reports/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (myRes.ok) {
        const myData = await myRes.json();
        setMyReports(myData.data || []);
      }

      // Fetch Received Reports
      const recRes = await fetch(`${baseURL}/api/v1/reports/received`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (recRes.ok) {
        const recData = await recRes.json();
        setReceivedReports(recData.data || []);
      }
    } catch (error) {
      toast.error("Could not load reports.", { toastId: "fetch-errors" });
    } finally {
      setLoading(false);
    }
  }, [baseURL, token]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
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
        toast.success("Draft Report generated and saved!");
        setFormData({ title: "", type: "Monthly Population Update", summary: "" });
        fetchReports();
        setActiveTab("my-reports");
      } else {
        toast.error(data.message || "Failed to generate report");
      }
    } catch (err) {
      toast.error("Failed to generate report");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadPDF = async (id, title) => {
    try {
      toast.info("Generating PDF...", { autoClose: 2000 });
      const response = await fetch(`${baseURL}/api/v1/reports/${id}/pdf`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error("Failed to download PDF");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.replace(/\s+/g, '_')}_Report.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      toast.error("Could not download PDF");
    }
  };

  const handleSubmitReport = async (id) => {
    if (!window.confirm("Submit this report to your superior? You cannot edit or delete it afterwards.")) return;
    
    try {
      const response = await fetch(`${baseURL}/api/v1/reports/${id}/submit`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        fetchReports();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error submitting report");
    }
  };

  const handleDeleteReport = async (id) => {
    if (!window.confirm("Are you sure you want to delete this draft report?")) return;
    
    try {
      const response = await fetch(`${baseURL}/api/v1/reports/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Report deleted");
        fetchReports();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error deleting report");
    }
  };

  const renderTable = (data, isReceivedTable = false) => (
    <Table responsive variant="dark" hover className="mb-0 align-middle">
      <thead>
        <tr>
          <th>Report Title</th>
          <th>Type</th>
          <th>{isReceivedTable ? "Submitted By" : "Date"}</th>
          <th>Status</th>
          <th className="text-end">Actions</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan="5" className="text-center py-4 text-muted">
              <Spinner animation="border" size="sm" className="me-2" /> Loading...
            </td>
          </tr>
        ) : data.length === 0 ? (
          <tr>
            <td colSpan="5" className="text-center py-4 text-muted">
              No reports found.
            </td>
          </tr>
        ) : (
          data.map(report => (
            <tr key={report.id}>
              <td>
                <div className="fw-bold">{report.title}</div>
                <small className="text-muted">Scope: {report.scope.toUpperCase()}</small>
              </td>
              <td>{report.type}</td>
              <td>
                {isReceivedTable && report.generator 
                  ? `${report.generator.firstname} ${report.generator.lastname}`
                  : new Date(report.createdAt).toLocaleDateString()}
              </td>
              <td>
                <Badge bg={report.status === 'submitted' ? 'success' : 'secondary'}>
                  {report.status.toUpperCase()}
                </Badge>
                {report.sentTo && <div className="text-muted small mt-1">To: {report.sentTo.replace('_', ' ')}</div>}
              </td>
              <td className="text-end">
                <Button 
                  variant="outline-info" 
                  size="sm" 
                  className="me-2"
                  onClick={() => handleDownloadPDF(report.id, report.title)}
                  title="Download PDF"
                >
                  <i className="bi bi-file-earmark-pdf"></i> PDF
                </Button>
                
                {!isReceivedTable && report.status === 'draft' && (
                  <>
                    <Button 
                      variant="outline-success" 
                      size="sm" 
                      className="me-2"
                      onClick={() => handleSubmitReport(report.id)}
                      title="Submit to Superior"
                    >
                      <i className="bi bi-send"></i> Submit
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleDeleteReport(report.id)}
                      title="Delete Draft"
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );

  return (
    <main id="main" className="main py-4">
      <div className="pagetitle mb-4">
        <h2 className="text-white">Administrative Reporting</h2>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="/">Home</a></li>
            <li className="breadcrumb-item">Pages</li>
            <li className="breadcrumb-item active" style={{ color: "#f6c90e" }}>reports</li>
          </ol>
        </nav>
      </div>

      <Row className="gy-4">
        {/* ── Generate Form ─────────────────────────────── */}
        <Col lg={4}>
          <Card className="bg-dark text-white border-secondary h-100">
            <Card.Body>
              <Card.Title>Generate New Draft</Card.Title>
              <hr className="border-secondary" />
              <Form onSubmit={handleGenerate}>
                <Form.Group className="mb-3">
                  <Form.Label>Report Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., Q1 Village Progress"
                    className="bg-black text-white border-secondary"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Report Type</Form.Label>
                  <Form.Select
                    className="bg-black text-white border-secondary"
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option>Monthly Population Update</option>
                    <option>Development Progress</option>
                    <option>Incident Summary</option>
                    <option>Custom Strategic Report</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Executive Summary</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Enter key highlights and summary..."
                    className="bg-black text-white border-secondary"
                    value={formData.summary}
                    onChange={e => setFormData({ ...formData, summary: e.target.value })}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100" disabled={submitting}>
                  {submitting ? (
                    <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" /> Saving Draft...</>
                  ) : (
                    <><i className="bi bi-file-earmark-plus me-2"></i> Save Draft Report</>
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* ── Reports Tabs ─────────────────────────────── */}
        <Col lg={8}>
          <Card className="bg-dark text-white border-secondary">
            <Card.Body className="p-0">
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="custom-tabs nav-tabs-bordered border-secondary pt-3 px-3"
              >
                <Tab eventKey="my-reports" title="My Reports (Drafts & Sent)">
                  <div className="p-3">
                    {renderTable(myReports, false)}
                  </div>
                </Tab>
                <Tab eventKey="received-reports" title="Received Reports">
                  <div className="p-3">
                    {renderTable(receivedReports, true)}
                  </div>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <ToastContainer />
    </main>
  );
};

export default ReportingModule;