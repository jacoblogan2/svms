import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../../components/loading';
import AddDocument from '../admin/addDocument'
import ListDocument from '../admin/documents'

function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (isNaN(id)) {
      navigate('/');
    }
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.success) {
          setUser(data.user);
        } else {
          console.error('Failed to fetch user:', data.message);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching user:', error);
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate]);

  const handleDelete = async (userId) => {
    try {
      const isConfirmed = window.confirm('Are you sure you want to delete this user?');
      if (!isConfirmed) {
        return;
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/users/delete/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const res = await response.json();
        toast.success(res.message);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        navigate('/users');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleUser = (userId) => {
    navigate(`../penarity/${userId}`);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>User Details</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item">Users</li>
              <li className="breadcrumb-item active">User Details</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">User Details</h5>
                  {user && (
                    <>
                      <p><strong>First Name:</strong> {user.firstname}</p>
                      <p><strong>Last Name:</strong> {user.lastname}</p>
                      <p><strong>National ID:</strong> {user.nid}</p>
                      <p><strong>Phone:</strong> {user.phone}</p>
                      <p><strong>Email:</strong> {user.email}</p>
                      <p><strong>Phone:</strong> {user.phone}</p>
                      <p><strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}</p>
                      <p><strong>Updated At:</strong> {new Date(user.updatedAt).toLocaleString()}</p>
                      <button className='btn btn-outline-danger m-2' onClick={() => handleDelete(user.id)}>Delete User</button>
                     
                    </>
                  )}
                </div>
              </div>
            </div>

          

            <div className="col-lg-6">
              <div className="card">
               <AddDocument/>
              </div>
            </div>

            <div className="col-lg-6" >
              <div className="card" style={{padding:'0.3cm'}}>
               <ListDocument/>
              </div>
            </div>
          </div>
        </section>
        <ToastContainer />
      </main>
    </>
  );
}

export default Home;
