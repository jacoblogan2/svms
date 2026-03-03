import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [collapsedSections, setCollapsedSections] = useState({});

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const user = JSON.parse(userString);
        setRole(user.role);
      } catch (error) {
        console.error("Error parsing user object:", error);
      }
    }
  }, []);

  const toggleCollapse = (category) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const commonItems = [];

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

    county_leader: [
      {
        category: "Dashboard",
        items: [
          { label: "Dashboard", icon: "bi-house", link: "/statistics" },
          { label: "Infographic", icon: "bi-bar-chart", link: "/map" },
        ],
      },
      {
        category: "Management",
        items: [
          { label: "Add Leaders/Users", icon: "bi-person-plus", link: "../addusers" },
          { label: "View Districts & Leaders", icon: "bi-person-lines-fill", link: "../users" },
          { label: "View Citizens", icon: "bi-people", link: "../citizens" },
        ],
      },
      {
        category: "Communication",
        items: [
          { label: "Add Broadcast", icon: "bi-pencil-square", link: "../addpost" },
          { label: "View Broadcasts", icon: "bi-file-earmark-text", link: "../post" },
          { label: "Requests", icon: "bi-envelope", link: "../request/admin" },
        ],
      },
      {
        category: "Activities",
        items: [{ label: "Notifications", icon: "bi-bell", link: "../notifications" }],
      },
      {
        category: "Settings",
        items: [
          { label: "Settings", icon: "bi-gear", link: "../profile" },
          { label: "Logout", icon: "bi-box-arrow-right", link: "../logout" },
        ],
      },
    ],

    district_leader: [
      {
        category: "Dashboard",
        items: [
          { label: "Dashboard", icon: "bi-house", link: "/statistics" },
          { label: "Infographic", icon: "bi-bar-chart", link: "/map" },
        ],
      },
      {
        category: "Management",
        items: [
          { label: "Add Leaders/Users", icon: "bi-person-plus", link: "../addusers" },
          { label: "View Leaders", icon: "bi-person-lines-fill", link: "../users" },
          { label: "View Citizens", icon: "bi-people", link: "../citizens" },
        ],
      },
      {
        category: "Communication",
        items: [
          { label: "Add Broadcast", icon: "bi-pencil-square", link: "../addpost" },
          { label: "View Broadcasts", icon: "bi-file-earmark-text", link: "../post" },
          { label: "Requests", icon: "bi-envelope", link: "../request/admin" },
        ],
      },
      {
        category: "Activities",
        items: [{ label: "Notifications", icon: "bi-bell", link: "../notifications" }],
      },
      {
        category: "Settings",
        items: [
          { label: "Settings", icon: "bi-gear", link: "../profile" },
          { label: "Logout", icon: "bi-box-arrow-right", link: "../logout" },
        ],
      },
    ],

    clan_leader: [
      {
        category: "Dashboard",
        items: [
          { label: "Dashboard", icon: "bi-house", link: "/statistics" },
          { label: "Infographic", icon: "bi-bar-chart", link: "/map" },
        ],
      },
      {
        category: "Community",
        items: [
          { label: "View Citizens", icon: "bi-people", link: "../citizens" },
        ],
      },
      {
        category: "Communication",
        items: [
          { label: "Add Alert", icon: "bi-pencil-square", link: "../addpost" },
          { label: "View Broadcasts", icon: "bi-file-earmark-text", link: "../post" },
        ],
      },
      {
        category: "Activities",
        items: [{ label: "Notifications", icon: "bi-bell", link: "../notifications" }],
      },
      {
        category: "Settings",
        items: [
          { label: "Settings", icon: "bi-gear", link: "../profile" },
          { label: "Logout", icon: "bi-box-arrow-right", link: "../logout" },
        ],
      },
    ],

    town_leader: [
      {
        category: "Dashboard",
        items: [
          { label: "Dashboard", icon: "bi-house", link: "/statistics" },
          { label: "Infographic", icon: "bi-bar-chart", link: "/map" },
        ],
      },
      {
        category: "Management",
        items: [
          { label: "Add Leaders/Users", icon: "bi-person-plus", link: "../addusers" },
          { label: "View Village Leaders", icon: "bi-person-lines-fill", link: "../users" },
          { label: "View Citizens", icon: "bi-people", link: "../citizens" },
        ],
      },
      {
        category: "Communication",
        items: [
          { label: "Add Broadcast", icon: "bi-pencil-square", link: "../addpost" },
          { label: "View Broadcasts", icon: "bi-file-earmark-text", link: "../post" },
          { label: "Requests", icon: "bi-envelope", link: "../request/admin" },
        ],
      },
      {
        category: "Activities",
        items: [{ label: "Notifications", icon: "bi-bell", link: "../notifications" }],
      },
      {
        category: "Settings",
        items: [
          { label: "Settings", icon: "bi-gear", link: "../profile" },
          { label: "Logout", icon: "bi-box-arrow-right", link: "../logout" },
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


  return (
    <aside id="sidebar" className="sidebar" style={{ backgroundColor: "black" }}>
      {/* <div style={{ backgroundColor: "white", color: "black", textAlign: "center", padding: "0.2cm" }}>
        <b>{role}</b>
      </div> */}
      <ul className="sidebar-nav" id="sidebar-nav">
        {role &&
          menuItems[role]?.map((section, index) => (
            <li key={index} className="nav-item">
              <span
                className="nav-link  fw-bold d-flex justify-content-between"
                style={{ backgroundColor: "#161617", cursor: "pointer",color:"#696870" }}
                onClick={() => toggleCollapse(section.category)}
              >
                {section.category}
                <i className={`bi ${collapsedSections[section.category] ? "bi-chevron-down" : "bi-chevron-right"}`} style={{color:'white'}}></i>
              </span>
              {!collapsedSections[section.category] &&
                section.items.map((item, idx) => (
                  <a
                    className="nav-link d-flex align-items-center text-white"
                    href={item.link}
                    key={idx}
                    style={{ backgroundColor: "black", paddingLeft: "30px" }}
                  >
                    <i className={`bi ${item.icon} me-2`} style={{color:'white'}}></i>
                    <span>{item.label}</span>
                  </a>
                ))}
            </li>
          ))}
        {commonItems.map((item, index) => (
          <li className="nav-item" key={index}>
            <a className="nav-link text-white" href={item.link} style={{ backgroundColor: "black" }}>
              <i className={`bi ${item.icon}`}></i>
              <span>{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;