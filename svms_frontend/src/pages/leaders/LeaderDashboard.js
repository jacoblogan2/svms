import React, { useEffect, useState, useCallback } from "react";
import { Container, Row, Col, Card, Form, Alert } from "react-bootstrap";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from "recharts";
import { hasPermission } from "../../utils/permissions";
import { ROLE_LABELS } from "../../App";

const LeaderDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Time filtering state
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // 0-indexed
  
  const [filterYear, setFilterYear] = useState(currentYear.toString());
  const [filterMonth, setFilterMonth] = useState("all");

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const token = localStorage.getItem("token");
  const baseURL = process.env.REACT_APP_BASE_URL;

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Calculate Date Range based on filters
      let queryParams = "";
      if (filterMonth !== "all" && filterYear) {
        const start = new Date(parseInt(filterYear), parseInt(filterMonth), 1);
        const end = new Date(parseInt(filterYear), parseInt(filterMonth) + 1, 0, 23, 59, 59); // Last day of month
        queryParams = `?startDate=${start.toISOString()}&endDate=${end.toISOString()}`;
      } else if (filterYear) {
        const start = new Date(parseInt(filterYear), 0, 1);
        const end = new Date(parseInt(filterYear), 11, 31, 23, 59, 59);
        queryParams = `?startDate=${start.toISOString()}&endDate=${end.toISOString()}`;
      }

      // Fetch aggregated demographics from new endpoint
      const statsRes = await fetch(`${baseURL}/api/v1/reports/dashboard-stats${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.data);
      }

      // Fetch recent reports if permitted
      if (hasPermission('view_reports')) {
        const reportRes = await fetch(`${baseURL}/api/v1/reports/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (reportRes.ok) {
          const reportData = await reportRes.json();
          setRecentReports(reportData.data || []);
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [baseURL, token, filterMonth, filterYear]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Chart Colors
  const COLORS_GENDER = ["#0088FE", "#FFBB28"];
  const COLORS_AGE = ["#00C49F", "#FF8042"];
  const COLORS_EMP = ["#8884d8", "#82ca9d"];

  // Prepare chart data safely
  const genderData = stats ? [
    { name: "Male", value: stats.males || 0 },
    { name: "Female", value: stats.females || 0 }
  ] : [];

  const ageData = stats ? [
    { name: "Adults (18+)", value: stats.adults || 0 },
    { name: "Kids (<18)", value: stats.kids || 0 }
  ] : [];

  const employmentData = stats ? [
    { name: "Employed", value: stats.employed || 0 },
    { name: "Unemployed/Student", value: stats.unemployed || 0 }
  ] : [];

  const StatValue = ({ val }) => (
    loading ? <span className="spinner-border spinner-border-sm text-info" /> : val
  );

  return (
    <main id="main" className="main py-4">
      <div className="pagetitle mb-4">
        <h1 className="text-white">Dashboard Dashboard</h1>
        <p className="text-muted">
          Welcome back, {user.firstname}! You are logged in as{' '}
          <span className="badge bg-primary">{ROLE_LABELS[user.role]}</span>
        </p>
      </div>

      {/* ── Time Filter Controls ── */}
      <Card className="bg-dark text-white border-secondary mb-4">
        <Card.Body className="py-3">
          <Row className="align-items-center">
            <Col md="auto" className="fw-bold text-info"><i className="bi bi-filter me-2"></i>Data Filter:</Col>
            <Col md={3}>
              <Form.Select 
                className="bg-black text-white border-secondary" 
                value={filterYear} 
                onChange={e => setFilterYear(e.target.value)}
              >
                <option value={currentYear}>{currentYear}</option>
                <option value={currentYear - 1}>{currentYear - 1}</option>
                <option value={currentYear - 2}>{currentYear - 2}</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Select 
                className="bg-black text-white border-secondary" 
                value={filterMonth} 
                onChange={e => setFilterMonth(e.target.value)}
              >
                <option value="all">Entire Year</option>
                <option value="0">January</option>
                <option value="1">February</option>
                <option value="2">March</option>
                <option value="3">April</option>
                <option value="4">May</option>
                <option value="5">June</option>
                <option value="6">July</option>
                <option value="7">August</option>
                <option value="8">September</option>
                <option value="9">October</option>
                <option value="10">November</option>
                <option value="11">December</option>
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* ── Top Level KPIs ── */}
      <Row className="gy-4 mb-4">
        <Col md={3}>
          <Card className="bg-dark text-white border-secondary h-100 border-start border-info border-4">
            <Card.Body>
              <h6 className="text-muted text-uppercase mb-2">Total Population</h6>
              <h2 className="display-6 fw-bold mb-0"><StatValue val={stats?.population || 0} /></h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="bg-dark text-white border-secondary h-100 border-start border-success border-4">
            <Card.Body>
              <h6 className="text-muted text-uppercase mb-2">Households</h6>
              <h2 className="display-6 fw-bold mb-0"><StatValue val={stats?.households || 0} /></h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="bg-dark text-white border-secondary h-100 border-start border-warning border-4">
            <Card.Body>
              <h6 className="text-muted text-uppercase mb-2">Subordinate Leaders</h6>
              <h2 className="display-6 fw-bold mb-0"><StatValue val={stats?.localLeaders || 0} /></h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="bg-dark text-white border-secondary h-100 border-start border-danger border-4">
            <Card.Body>
              <h6 className="text-muted text-uppercase mb-2">Registered Deceased</h6>
              <h2 className="display-6 fw-bold mb-0"><StatValue val={stats?.deceasedRecorded || 0} /></h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="gy-4">
        {/* Statistics Charts */}
        <Col xs={12} lg={8}>
          <Card className="bg-dark text-white border-secondary h-100">
            <Card.Body>
              <Card.Title>Advanced Demographics</Card.Title>
              <hr className="border-secondary" />
              {loading ? (
                <div className="text-center py-5 text-muted">Loading demographic data...</div>
              ) : (
                <Row className="g-4">
                  <Col md={6}>
                    <h5 className="text-center small">Gender Split</h5>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie data={genderData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} fill="#8884d8" dataKey="value" label>
                          {genderData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS_GENDER[index % COLORS_GENDER.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#000', borderColor: '#333' }} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Col>
                  
                  <Col md={6}>
                    <h5 className="text-center small">Age Distribution</h5>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie data={ageData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} fill="#8884d8" dataKey="value" label>
                          {ageData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS_AGE[index % COLORS_AGE.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#000', borderColor: '#333' }} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Col>

                  <Col md={12} className="mt-4">
                    <h5 className="text-center small">Employment Status</h5>
                    <ResponsiveContainer width="100%" height={150}>
                      <BarChart data={employmentData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                        <XAxis type="number" stroke="#666" />
                        <YAxis dataKey="name" type="category" stroke="#ccc" width={120} />
                        <Tooltip contentStyle={{ backgroundColor: '#000', borderColor: '#333' }} />
                        <Bar dataKey="value" fill="#8884d8" radius={[0, 4, 4, 0]}>
                          {employmentData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS_EMP[index % COLORS_EMP.length]} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Col>
                </Row>
              )}
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
                  <a href="/reports" className="btn btn-outline-light text-start py-3 bg-primary border-primary">
                    <i className="bi bi-file-earmark-bar-graph me-2"></i> Generate Analytics Report
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
                <Card.Title>Recent Submissions</Card.Title>
                <hr className="border-secondary" />
                {recentReports.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-dark table-hover mb-0 align-middle">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Type</th>
                          <th>Scope</th>
                          <th>Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentReports.slice(0, 5).map(report => (
                          <tr key={report.id}>
                            <td>{report.title}</td>
                            <td>{report.type}</td>
                            <td><span className="text-uppercase small">{report.scope}</span></td>
                            <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                            <td>
                              <span className={`badge bg-${report.status === 'submitted' ? 'success' : 'secondary'}`}>
                                {report.status.toUpperCase()}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <Alert variant="secondary" className="bg-transparent text-white border-secondary mb-0">
                    <i className="bi bi-info-circle me-2"></i> No reports available.
                  </Alert>
                )}
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </main>
  );
};

export default LeaderDashboard;
