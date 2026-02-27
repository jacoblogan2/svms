import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { useNavigate } from "react-router-dom";

function Home() {
  const [role, setRole] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const user = JSON.parse(userString);
        setRole(user.role);
      } catch (error) {
        console.error("Error parsing user object:", error);
      }
    } else {
      console.error("User object not found in local storage");
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/v1/users/citizen`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
        setFilteredUsers(data.users);
      } else {
        toast.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error fetching users");
    }
  };

  const filterUsers = () => {
    if (!searchQuery) {
      setFilteredUsers(users);
      setCurrentPage(1);
      return;
    }

    const filtered = users.filter(
      (user) =>
        user.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.nid && user.nid.includes(searchQuery))
    );

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const nextPage = () => {
    if (indexOfLastUser < filteredUsers.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Users Page</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/">Home</a>
              </li>
              <li className="breadcrumb-item">Pages</li>
              <li className="breadcrumb-item active">citizens</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row mb-3">
            <div className="col-md-4"></div>
            <div className="col-md-8">
              <input
                type="text"
                className="form-control"
                placeholder="Search by Name, Email, or NID"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            {/* <div className="col-md-4 text-end">
              {role === "admin" && (
                <button
                  type="button"
                  className="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#disablebackdrop"
                >
                  Add Users
                </button>
              )}
            </div> */}
          </div>
        </section>

        {filteredUsers.length > 0 ? (
          <section className="section">
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body table-responsive">
                    <h5 className="card-title">List of Users</h5>
                    <table className="table datatable table-dark">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentUsers.map((user) => (
                          <tr key={user.id}>
                            <td>{`${user.firstname} ${user.lastname}`}</td>
                            <td>{user.email}</td>
                            <td>
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => navigate(`../oneUser/${user.id}`)}
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Pagination Controls */}
                    <div className="d-flex justify-content-between">
                      <button
                        className="btn btn-secondary"
                        onClick={prevPage}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                      <span className="align-self-center">
                        Page {currentPage} of{" "}
                        {Math.ceil(filteredUsers.length / usersPerPage)}
                      </span>
                      <button
                        className="btn btn-secondary"
                        onClick={nextPage}
                        disabled={indexOfLastUser >= filteredUsers.length}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <div className="row">
            <div className="col-lg-12">
              <div className="card" style={{ padding: "0.5cm" }}>
                <div className="card-body">
                  <h5 className="card-title text-center">
                    There is no citizen registered!
                  </h5>
                </div>
              </div>
            </div>
          </div>
        )}

        <ToastContainer />
      </main>
    </>
  );
}

export default Home;
