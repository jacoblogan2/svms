import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Container, Row, Col } from "react-bootstrap";

const Dashboard = () => {
  const [citizens, setCitizens] = useState([]);
  const token = localStorage.getItem("token");
  
  useEffect(() => {
    if (!token) {
      console.error("No token found");
      return;
    }
    fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/users/citizen`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data && data.users) {
          setCitizens(data.users);
        } else {
          setCitizens([]);
        }
      })
      .catch(error => console.error("Error fetching citizens:", error));
  }, [token]);

  const genderData = [
    { name: "Male", value: (citizens || []).filter(user => user.gender === "Male").length },
    { name: "Female", value: (citizens || []).filter(user => user.gender === "Female").length }
  ];

  const COLORS = ["#0088FE", "#FFBB28"];

  const townCounts = (citizens || []).reduce((acc, user) => {
    acc[user.town?.name || "N/A"] = (acc[user.town?.name || "N/A"] || 0) + 1;
    return acc;
  }, {});
  
  const townData = Object.keys(townCounts).map(town => ({ name: town, count: townCounts[town] }));

  return (
    <Container fluid className="py-4" style={{ backgroundColor: "#0c0c0c", minHeight: "100vh", color: "#fff" }}>
      <h2 className="text-center mb-4">Citizen Statistics</h2>
      
      <Row className="gy-4"> {/* Adds spacing between rows on small screens */}
        <Col xs={12} md={6}>
          <div className="p-3 rounded" style={{ background: "#222" }}>
            <h3 className="text-center">Citizens by Gender</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={genderData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value">
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Col>

        <Col xs={12} md={6}>
          <div className="p-3 rounded" style={{ background: "#222" }}>
            <h3 className="text-center">Citizens by Town</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={townData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
