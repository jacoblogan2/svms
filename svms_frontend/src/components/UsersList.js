import React, { useState, useEffect } from 'react';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  let token=localStorage.getItem('token');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/users`, {
        method: 'GET',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.users); // Assuming `data.users` is an array of all users
        setTotalPages(Math.ceil(data.users.length / 5)); // Total pages = total users / 5 per page
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/users/delete/${userId}`, {
      method: 'DELETE',
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (data.success) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const handleActivateDeactivate = async (userId, currentStatus) => {
    const url = currentStatus === 'active'
      ? `${process.env.REACT_APP_BASE_URL}/api/v1/users/deactivate/${userId}`
      : `${process.env.REACT_APP_BASE_URL}/api/v1/users/activate/${userId}`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (data.success) {
      setUsers(users.map(user =>
        user.id === userId ? { ...user, status: currentStatus === 'active' ? 'inactive' : 'active' } : user
      ));
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const usersToDisplay = users.slice((currentPage - 1) * 5, currentPage * 5);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container member mt-5">
      <h1 className="text-center">Users List</h1>

      <table className="table table-striped table-dark">
        <thead>
          <tr>
            <th>#</th>
            {/* <th>Image</th> */}
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            {/* <th>Address</th> */}
            <th>Status</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {usersToDisplay.map((user, index) => (
            <tr key={user.id}>
              <td>{(currentPage - 1) * 5 + index + 1}</td>
              {/* <td>
                <img
                  src={user.image}
                  alt={`${user.firstname} ${user.lastname}`}
                  className="img-thumbnail"
                  style={{ width: '50px', height: '50px' }}
                />
              </td> */}
              <td>{user.firstname} {user.lastname}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              {/* <td>{user.address}</td> */}
              <td>{user.status}</td>
              <td>{user.role}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm mr-2"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button>

                <button
                  className={`btn btn-${user.status === 'active' ? 'warning' : 'success'} btn-sm`}
                  onClick={() => handleActivateDeactivate(user.id, user.status)}
                >
                  {user.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
              Previous
            </button>
          </li>
          {[...Array(totalPages)].map((_, index) => (
            <li
              key={index}
              className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
            >
              <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default UsersList;
