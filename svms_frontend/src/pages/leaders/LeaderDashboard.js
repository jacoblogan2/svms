import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Alert } from "react-bootstrap";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { hasPermission } from "../../utils/permissions";
import { ROLE_LABELS } from "../../App";

const LeaderDashboard = () => {
  const [stats, setStats] = useState({
    citizens: [],
    reports: [],
    households: []
  });
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const token = localStorage.getItem("token");
  const baseURL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch basic statistics
        const citizenRes = await fetch(`${baseURL}/api/v1/users/citizen`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const citizenData = await citizenRes.json();

        // Fetch reports if permitted
        let reportData = { data: [] };
        if (hasPermission('view_reports')) {
          const reportRes = await fetch(`${baseURL}/api/v1/reports/all`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          reportData = await reportRes.json();
        }

        setStats({
          citizens: citizenData.users || [],
          reports: reportData.data || [],
          households: [] // Future: fetch household counts
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token, baseURL]);

  const genderData = [
    { name: "Male", value: stats.citizens.filter(u => u.gender === "Male").length },
    { name: "Female", value: stats.citizens.filter(u => u.gender === "Female").length }
  ];
  const COLORS = ["#0088FE", "#FFBB28"];

  return (
    <Container fluid className="py-4" style={{ backgroundColor: "#000", minHeight: "100vh", color: "#fff" }}>
      <div className="pagetitle mb-4">
        <h1 className="text-white">Dashboard</h1>
        <p className="text-muted">
          Welcome back, {user.firstname}! You are logged in as{' '}
          <span className="badge bg-primary">{ROLE_LABELS[user.role]}</span>
        </p>
      </div>

      <Row className="gy-4">
        {/* Statistics Widget - Always shown for leaders */}
        <Col xs={12} lg={8}>
          <Card className="bg-dark text-white border-secondary h-100">
            <Card.Body>
              <Card.Title>Citizen Demographics</Card.Title>
              <hr className="border-secondary" />
              <Row>
                <Col md={6}>
                  <h5 className="text-center small mb-3">Gender Distribution</h5>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={genderData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" dataKey="value">
                        {genderData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Col>
                <Col md={6} className="d-flex flex-column justify-content-center">
                  <div className="text-center">
                    <h2 className="display-4 fw-bold">{stats.citizens.length}</h2>
                    <p className="text-muted">Total Citizens in Jurisdiction</p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* Quick Actions Widget */}
        <Col xs={12} lg={4}>
          <Card className="bg-dark text-white border-secondary h-100">
            <Card.Body>
              <Card.Title>Quick Actions</Card.Title>
              <hr className="border-secondary" />
              <div className="d-grid gap-2">
                {hasPermission('create_user') && (
                  <a href="/add-leader" className="btn btn-outline-light text-start py-3">
                    <i className="bi bi-person-plus me-2"></i> Register New User
                  </a>
                )}
                {hasPermission('create_report') && (
                  <a href="/create-report" className="btn btn-outline-light text-start py-3">
                    <i className="bi bi-file-earmark-bar-graph me-2"></i> Generate Periodic Report
                  </a>
                )}
                {hasPermission('view_households') && (
                  <a href="/households" className="btn btn-outline-light text-start py-3">
                    <i className="bi bi-house-door me-2"></i> View Household Records
                  </a>
                )}
                {hasPermission('send_broadcast') && (
                  <a href="/broadcast" className="btn btn-outline-light text-start py-3">
                    <i className="bi bi-megaphone me-2"></i> Send Notification
                  </a>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Reports Widget - Permission based */}
        {hasPermission('view_reports') && (
          <Col xs={12}>
            <Card className="bg-dark text-white border-secondary">
              <Card.Body>
                <Card.Title>Recent Reports</Card.Title>
                <hr className="border-secondary" />
                {stats.reports.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-dark table-hover mb-0">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Type</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.reports.slice(0, 5).map(report => (
                          <tr key={report.id}>
                            <td>{report.title}</td>
                            <td>{report.type}</td>
                            <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                            <td><span className="badge bg-success">Verified</span></td>
                            <td>
                              <button className="btn btn-sm btn-outline-info">View</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <Alert variant="secondary" className="bg-transparent text-white border-secondary">
                    No reports generated yet for this jurisdiction.
                  </Alert>
                )}
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default LeaderDashboard;
