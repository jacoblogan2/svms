import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Sidebar() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null); // Initialize role state

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/Login');
    }
  }, [navigate]);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        setRole(user.role); // Set role state based on user object
      } catch (error) {
        console.error('Error parsing user object:', error);
      }
    } else {
      console.error('User object not found in local storage');
    }
  }, []);

  return (
    <aside id="sidebar" className="sidebar">
      <ul className="sidebar-nav" id="sidebar-nav">
        <li className="nav-item">
          <a className="nav-link collapsed" href="/">
            <i className="bi bi-grid"></i>
            <span>Dashboard</span>
          </a>
        </li>

        {/* Render items based on user role */}
        {role === 'superadmin' && (
          <React.Fragment>
         <li className="nav-item">
          <a className="nav-link collapsed" href="../settings">
            <i className="bi bi-gear"></i>
            <span>Settings</span>
          </a>
        </li>
            <li className="nav-item">
              <a className="nav-link collapsed" href="../users">
                <i className="bi bi-person"></i>
                <span>Manage Users</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link collapsed" href="../event">
                <i className="bi bi-journal-text"></i>
                <span>Manage Posts</span>
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link collapsed" href="../event">
              <i class="bi bi-dash-circle"></i>
                <span>Manage Amaturo</span>
              </a>
            </li>
           
          </React.Fragment>
        )}

        {role === 'user' && (
          <React.Fragment>
            <li className="nav-item">
              <a className="nav-link collapsed" href="../profile">
                <i className="bi bi-person-circle"></i>
                <span>Profile</span>
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link collapsed" href="../users">
                <i className="bi bi-person"></i>
                <span>Manage Users</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link collapsed" href="../event">
                <i className="bi bi-journal-text"></i>
                <span>Manage Posts</span>
              </a>
            </li>
          
          </React.Fragment>
        )}

  

        <li className="nav-item">
          <a className="nav-link collapsed" href="../logout">
            <i className="bi bi-box-arrow-right"></i>
            <span>Logout</span>
          </a>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
