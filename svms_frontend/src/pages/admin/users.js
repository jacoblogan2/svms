import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [role, setRole] = useState(null);
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    email: '',
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        setRole(user.role);
      } catch (error) {
        console.error('Error parsing user object:', error);
      }
    } else {
      console.error('User object not found in local storage');
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
        setLoading(false);
      } else {
        toast.error('Failed to fetch users');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error fetching users');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleAddUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/users/addUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });
      const data = await response.json();
      if (data.success) {
        toast.success('User added successfully');
        setNewUser({ firstname: '', lastname: '', phone: '', email: '' });
        fetchUsers(); // Refresh the list of users
      } else {
        toast.error('Failed to add user');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Error adding user');
    }
  };

  const handleView = (id) => {
    navigate(`../oneUser/${id}`);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredUsers = users.filter(user =>
    user.firstname.toLowerCase().includes(search.toLowerCase()) ||
    user.lastname.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  const sortedUsers = filteredUsers.sort((a, b) => {
    return a.firstname.localeCompare(b.firstname);
  });

  const currentUsers = sortedUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Users Page</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item">Pages</li>
              <li className="breadcrumb-item active">users</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-md-12">
              <input
                type="text"
                placeholder="Search users..."
                className="form-control mb-3"
                value={search}
                onChange={handleSearch}
              />
            </div>
          </div>

          {users.length > 0 ? (
            <section className="section">
              <div className="row">
                <div className="col-lg-12">
                  <div className="card">
                    <div className="card-body table-responsive">
                      <h5 className="card-title">List of Users</h5>
                      {loading ? (
                        <p>Loading...</p>
                      ) : (
                        <table className="table datatable table-dark">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Phone</th>
                              <th>Role</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentUsers.map((user, index) => (
                              <tr key={user.id}>
                                <td>{`${user.firstname} ${user.lastname}`}</td>
                                <td>{user.email}</td>
                                <td>{user.phone}</td>
                                <td>{`${user.role}`}</td>
                                <td>
                                  <button className="btn btn-outline-primary" onClick={() => handleView(user.id)}>View</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                      {/* Pagination */}
                      <div className="d-flex justify-content-center">
                        <nav>
                          <ul className="pagination">
                            {[...Array(Math.ceil(filteredUsers.length / itemsPerPage))].map((_, index) => (
                              <li key={index} className="page-item">
                                <button
                                  className="page-link"
                                  onClick={() => handlePagination(index + 1)}
                                >
                                  {index + 1}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <div className="row">
              <div className="col-lg-12">
                <div className="card" style={{ padding: '0.5cm' }}>
                  <div className="card-body">
                    <h5 className="card-title">
                      <center>There are no users registered!</center>
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
      <ToastContainer />
    </>
  );
}

export default Home;
