import React, { useEffect, useState, useCallback } from "react";
import { Container, Row, Col, Card, Form, Alert } from "react-bootstrap";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from "recharts";
import { hasPermission } from "../../utils/permissions";
import { ROLE_LABELS } from "../../App";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Address Options State
  const [counties, setCounties] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [clans, setClans] = useState([]);
  const [towns, setTowns] = useState([]);
  const [villages, setVillages] = useState([]);

  // Time filters
  const currentYear = new Date().getFullYear();
  const [filterYear, setFilterYear] = useState(currentYear.toString());
  const [filterMonth, setFilterMonth] = useState("all");

  // Location filters
  const [selectedCounty, setSelectedCounty] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedClan, setSelectedClan] = useState("");
  const [selectedTown, setSelectedTown] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const token = localStorage.getItem("token");
  const baseURL = process.env.REACT_APP_BASE_URL;

  // Initialize Address Hierarchy
  useEffect(() => {
    const fetchAddressData = async () => {
      try {
        const response = await fetch(`${baseURL}/api/v1/address`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setCounties(data.data || []);
        }
      } catch (error) {
        console.error("Error fetching address data:", error);
      }
    };
    fetchAddressData();
  }, [baseURL, token]);

  // Handle Cascading Location Changes
  const handleCountyChange = (e) => {
    const cid = e.target.value;
    setSelectedCounty(cid);
    setSelectedDistrict(""); setSelectedClan(""); setSelectedTown(""); setSelectedVillage("");
    const countyObj = counties.find(c => c.id === parseInt(cid));
    setDistricts(countyObj ? countyObj.districts : []);
    setClans([]); setTowns([]); setVillages([]);
  };

  const handleDistrictChange = (e) => {
    const did = e.target.value;
    setSelectedDistrict(did);
    setSelectedClan(""); setSelectedTown(""); setSelectedVillage("");
    const distObj = districts.find(d => d.id === parseInt(did));
    setClans(distObj ? distObj.clans : []);
    setTowns([]); setVillages([]);
  };

  const handleClanChange = (e) => {
    const clid = e.target.value;
    setSelectedClan(clid);
    setSelectedTown(""); setSelectedVillage("");
    const clanObj = clans.find(c => c.id === parseInt(clid));
    setTowns(clanObj ? clanObj.towns : []);
    setVillages([]);
  };

  const handleTownChange = (e) => {
    const tid = e.target.value;
    setSelectedTown(tid);
    setSelectedVillage("");
    const townObj = towns.find(t => t.id === parseInt(tid));
    setVillages(townObj && townObj.villages ? townObj.villages : []);
  };

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      const queryParams = new URLSearchParams();

      // Time Filtering
      if (filterMonth !== "all" && filterYear) {
        const start = new Date(parseInt(filterYear), parseInt(filterMonth), 1);
        const end = new Date(parseInt(filterYear), parseInt(filterMonth) + 1, 0, 23, 59, 59);
        queryParams.append("startDate", start.toISOString());
        queryParams.append("endDate", end.toISOString());
      } else if (filterYear) {
        const start = new Date(parseInt(filterYear), 0, 1);
        const end = new Date(parseInt(filterYear), 11, 31, 23, 59, 59);
        queryParams.append("startDate", start.toISOString());
        queryParams.append("endDate", end.toISOString());
      }

      // Location Filtering
      if (selectedCounty) queryParams.append("county_id", selectedCounty);
      if (selectedDistrict) queryParams.append("district_id", selectedDistrict);
      if (selectedClan) queryParams.append("clan_id", selectedClan);
      if (selectedTown) queryParams.append("town_id", selectedTown);
      if (selectedVillage) queryParams.append("village_id", selectedVillage);

      // Fetch aggregated demographics
      const statsRes = await fetch(`${baseURL}/api/v1/reports/dashboard-stats?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [baseURL, token, filterMonth, filterYear, selectedCounty, selectedDistrict, selectedClan, selectedTown, selectedVillage]);

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
    <section className="dashboard-stats">
      <div className="mb-4">

      {/* ── Filter Controls ── */}
      <Card className="bg-dark text-white border-secondary mb-4 shadow-sm">
        <Card.Body className="py-3">
          <Row className="g-3 align-items-center mb-3 pb-3 border-bottom border-secondary">
            <Col md="auto" className="fw-bold text-info"><i className="bi bi-calendar me-2"></i>Time Scope:</Col>
            <Col md={3}>
              <Form.Select className="bg-black text-white border-secondary" value={filterYear} onChange={e => setFilterYear(e.target.value)}>
                <option value={currentYear}>{currentYear}</option>
                <option value={currentYear - 1}>{currentYear - 1}</option>
                <option value={currentYear - 2}>{currentYear - 2}</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Select className="bg-black text-white border-secondary" value={filterMonth} onChange={e => setFilterMonth(e.target.value)}>
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

          <Row className="g-3 align-items-center">
            <Col md="auto" className="fw-bold text-warning"><i className="bi bi-geo-alt me-2"></i>Location Scope:</Col>
            <Col md={2}>
              <Form.Select className="bg-black text-white border-secondary" value={selectedCounty} onChange={handleCountyChange}>
                <option value="">All Counties</option>
                {counties.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Select className="bg-black text-white border-secondary" value={selectedDistrict} onChange={handleDistrictChange} disabled={!selectedCounty}>
                <option value="">All Districts</option>
                {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Select className="bg-black text-white border-secondary" value={selectedClan} onChange={handleClanChange} disabled={!selectedDistrict}>
                <option value="">All Clans</option>
                {clans.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Select className="bg-black text-white border-secondary" value={selectedTown} onChange={handleTownChange} disabled={!selectedClan}>
                <option value="">All Towns</option>
                {towns.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Select className="bg-black text-white border-secondary" value={selectedVillage} onChange={e => setSelectedVillage(e.target.value)} disabled={!selectedTown}>
                <option value="">All Villages</option>
                {villages.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
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
              <h6 className="text-muted text-uppercase mb-2">Local Leaders</h6>
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
        <Col xs={12}>
          <Card className="bg-dark text-white border-secondary h-100">
            <Card.Body>
              <Card.Title>Advanced Demographics Filtered View</Card.Title>
              <hr className="border-secondary" />
              {loading ? (
                <div className="text-center py-5 text-muted">Calculating spatial demographic data...</div>
              ) : (
                <Row className="g-4">
                  <Col md={4}>
                    <h5 className="text-center small">Gender Split</h5>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie data={genderData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} fill="#8884d8" dataKey="value" label>
                          {genderData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS_GENDER[index % COLORS_GENDER.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#000', borderColor: '#333' }} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Col>
                  
                  <Col md={4}>
                    <h5 className="text-center small">Age Distribution</h5>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie data={ageData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} fill="#8884d8" dataKey="value" label>
                          {ageData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS_AGE[index % COLORS_AGE.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#000', borderColor: '#333' }} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Col>

                  <Col md={4}>
                    <h5 className="text-center small">Employment Status</h5>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={employmentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <XAxis dataKey="name" stroke="#ccc" />
                        <YAxis type="number" stroke="#666" />
                        <Tooltip contentStyle={{ backgroundColor: '#000', borderColor: '#333' }} />
                        <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]}>
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
      </Row>
      </div>
    </section>
  );
};

export default Dashboard;