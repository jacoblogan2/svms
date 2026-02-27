import { Offcanvas } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import Image from './images.png';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [collapsedSections, setCollapsedSections] = useState({});

  const toggleCollapse = (category) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const menuItems = {
    admin: [
      {
        category: "Dashboard",
        items: [{ label: "Dashboard", icon: "bi-house", link: "/statistics" }],
      },
      {
        category: "Services",
        items: [
          { label: "Add Leaders Users", icon: "bi-person-plus", link: "../addusers" },
          { label: "Requests", icon: "bi-envelope", link: "../request/admin" },
          { label: "Manage Post Types", icon: "bi-tags", link: "../post_type" },

        ],
      },
      {
        category: "Access",
        items: [
          { label: "List of Leaders", icon: "bi-person-lines-fill", link: "../users" },
          { label: "List of Citizens", icon: "bi-people", link: "../citizens" },
        ],
      },
      {
        category: "Activities",
        items: [{ label: "Notifications", icon: "bi-bell", link: "../notifications" }],
      },
      {
        category: "Settings",
        items: [{ label: "Settings", icon: "bi-gear", link: "../profile" },
        { label: "Logout", icon: "bi-box-arrow-right", link: "../logout" }

        ],
      },
    ],

    village_leader: [
      {
        category: "Dashboard",
        items: [{ label: "Dashboard", icon: "bi-house", link: "/statistics" },
        { label: "Infographic", icon: "bi-file", link: "/map" }
        ],
      },
      {
        category: "Communication",
        items: [
          { label: "Add Post Broadcasts", icon: "bi-pencil-square", link: "../addpost" },
          { label: "View Posts Broadcasts", icon: "bi-file-earmark-text", link: "../post" },
        ],
      },
      {
        category: "Access",
        items: [{ label: "View Village Citizens", icon: "bi-person-badge", link: "../users" },
        { label: "Add Citizen", icon: "bi-person", link: "../addcitizen" }
        ],
      },
      {
        category: "Settings",
        items: [{ label: "Settings", icon: "bi-gear", link: "../profile" },
        { label: "Logout", icon: "bi-box-arrow-right", link: "../logout" }

        ],
      },
    ],

    citizen: [
      {
        category: "Dashboard",
        items: [{ label: "Dashboard", icon: "bi-house", link: "/statistics" },
        { label: "Infographic", icon: "bi-file", link: "/map" }
        ],
      },

      {
        category: "Communication",
        items: [{ label: "Broadcast", icon: "bi-file-earmark-text", link: "../citizenpost" }],
      },
      {
        category: "Activities",
        items: [
          { label: "Request", icon: "bi-exclamation-circle", link: "../request" },
          { label: "Notifications", icon: "bi-bell", link: "../notifications" },
        ],
      },
      {
        category: "Settings",
        items: [{ label: "Settings", icon: "bi-gear", link: "../profilecitizen" },
        { label: "Logout", icon: "bi-box-arrow-right", link: "../logout" }
        ],
      },
    ],
  };

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const userData = JSON.parse(userString);
        setUser(userData);
        setRole(userData.role);
      } catch (error) {
        console.error('Error parsing user object:', error);
      }
    }
  }, []);



  return (
    <>
      {/* Header */}
      <header className="header fixed-top d-flex align-items-center" style={{ backgroundColor: '#2e2e2d', color: 'white',padding:'0.6cm' }}>
        <div className="d-flex align-items-center justify-content-between">
          <a href="/" className="logo d-flex align-items-center">
            <span className="d-none d-lg-block" style={{ backgroundColor: '#2e2e2d', color: 'white' }}>Smart Village Management</span>

          </a>
          <i className="bi bi-list toggle-sidebar-btn" onClick={() => setShowMenu(!showMenu)} style={{ backgroundColor: '#2e2e2d', color: 'white' }}></i>

        </div>

        {/* Profile Section */}
        <nav className="header-nav ms-auto">
          <ul className="d-flex align-items-center">
          <li className="nav-item dropdown pe-1">
  <a className="nav-link nav-profile d-flex align-items-center pe-0" href="../profile" style={{ backgroundColor: '#2e2e2d', color: 'white' }}>
    {user ? (
      <>
        <div className="d-flex align-items-center">
          <div
            className="d-flex align-items-center justify-content-center rounded-circle text-white"
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "blue",
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginTop: "0.2cm",
            }}
          >
            {user.firstname?.charAt(0).toUpperCase() || "?"}
            {/* {user?.lastname?.charAt(0).toUpperCase() || "?"} */}
          </div>
          <span className="ps-2 d-md-inline d-none">{user.firstname}</span>
        </div>
      </>
    ) : (
      <div>Loading...</div>
    )}
  </a>
</li>

          </ul>
        </nav>
      </header>

      {/* Sidebar Menu */}
      <Offcanvas show={showMenu} onHide={() => setShowMenu(false)} placement="start" style={{ backgroundColor: 'black', color: 'white' }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <span className="d-none d-lg-block" style={{ backgroundColor: 'black', color: 'white' }}>Smart Village Management</span>

          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ul className="sidebar-nav" id="sidebar-nav">
            {role &&
              menuItems[role]?.map((section, index) => (
                <li key={index} className="nav-item">
                  <span
                    className="nav-link  fw-bold d-flex justify-content-between"
                    style={{ backgroundColor: "#161617", cursor: "pointer", color: "#696870" }}
                    onClick={() => toggleCollapse(section.category)}
                  >
                    {section.category}
                    <i className={`bi ${collapsedSections[section.category] ? "bi-chevron-down" : "bi-chevron-right"}`} style={{ color: 'white' }}></i>
                  </span>
                  {!collapsedSections[section.category] &&
                    section.items.map((item, idx) => (
                      <a
                        className="nav-link d-flex align-items-center text-white"
                        href={item.link}
                        key={idx}
                        style={{ backgroundColor: "black", paddingLeft: "30px" }}
                      >
                        <i className={`bi ${item.icon} me-2`} style={{ color: 'white' }}></i>
                        <span>{item.label}</span>
                      </a>
                    ))}
                </li>
              ))}

          </ul>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default Header;
