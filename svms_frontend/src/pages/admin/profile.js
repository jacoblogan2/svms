import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    nid: ''
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingChangePassword, setLoadingChangePassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userString = localStorage.getItem('user');
    let userId; // Declare userId variable outside try-catch to widen its scope
  
    if (userString) {
      try {
        const user = JSON.parse(userString);
        userId = user.id; // Assign userId inside try block
        console.log('User ID:', userId);
      } catch (error) {
        console.error('Error parsing user object:', error);
      }
    } else {
      console.error('User object not found in local storage');
      setLoadingUpdate(false);
      return;
    }
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.success) {
          setUser(data.user);
          setFormData({
            firstname: data.user.firstname,
            lastname: data.user.lastname,
            phone: data.user.phone || '',
            nid: data.user.nid || ''
          });
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
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingUpdate(true);
  
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    let userId; // Declare userId variable outside try-catch to widen its scope
  
    if (userString) {
      try {
        const user = JSON.parse(userString);
        userId = user.id; // Assign userId inside try block
        console.log('User ID:', userId);
      } catch (error) {
        console.error('Error parsing user object:', error);
      }
    } else {
      console.error('User object not found in local storage');
      setLoadingUpdate(false);
      return;
    }
  
    const updateData = new FormData();
  
    updateData.append('firstname', formData.firstname);
    updateData.append('lastname', formData.lastname);
    updateData.append('phone', formData.phone);
    updateData.append('nid', formData.nid);
  
    if (file) {
      updateData.append('file', file);
    }
  
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/users/update/${userId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        },
        body: updateData
      });
  
      const data = await response.json();
  
      if (data.success) {
        toast.success('Profile updated successfully');
        setUser(data.user);
        setFormData({
          firstname: data.user.firstname,
          lastname: data.user.lastname,
          phone: data.user.phone || '',
          nid: data.user.nid || ''
        });
        // window.location.reload();
      } else {
        toast.error('Failed to update profile');
        console.error('Update error:', data.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoadingUpdate(false);
    }
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoadingChangePassword(true);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/users/changePassword`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(passwordData)
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Password changed successfully');
        setPasswordData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        toast.error('Failed to change password');
        console.error('Change password error:', data.message);
      }
    } catch (error) {
      console.error('Error changing password:', error);
    } finally {
      setLoadingChangePassword(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Profile</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item">Users</li>
              <li className="breadcrumb-item active">Profile</li>
            </ol>
          </nav>
        </div>

        <section className="section profile">
          <div className="row">
            <div className="col-xl-4">
              <div className="card">
                <div className="card-body profile-card pt-4 d-flex flex-column align-items-center">
                  <img src={user.file || 'assets/img/v.jpg'} alt="Profile" className="rounded-circle" style={{height:'3.5cm',width:'10cm'}}/>
                  <h2 style={{color:'white'}}>{user.firstname} {user.lastname}</h2>
                  <h3>{user.role}</h3>
                </div>
              </div>
            </div>

            <div className="col-xl-8">
              <div className="card">
                <div className="card-body pt-3">
                  <ul className="nav nav-tabs nav-tabs-bordered">
                    <li className="nav-item">
                      <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#profile-overview">Overview</button>
                    </li>
                    <li className="nav-item">
                      <button className="nav-link" data-bs-toggle="tab" data-bs-target="#profile-edit">Edit Profile</button>
                    </li>
                    <li className="nav-item">
                      <button className="nav-link" data-bs-toggle="tab" data-bs-target="#profile-change-password">Change Password</button>
                    </li>
                  </ul>
                  <div className="tab-content pt-2">
                    <div className="tab-pane fade show active profile-overview" style={{color:'white'}} id="profile-overview">
                      <h5 className="card-title">Profile Details</h5>
                      <div className="row">
                        <div className="col-lg-3 col-md-4 label">Full Name</div>
                        <div className="col-lg-9 col-md-8">{user.firstname} {user.lastname}</div>
                      </div>
                      <div className="row">
                        <div className="col-lg-3 col-md-4 label">Email</div>
                        <div className="col-lg-9 col-md-8">{user.email}</div>
                      </div>
                      <div className="row">
                        <div className="col-lg-3 col-md-4 label">Role</div>
                        <div className="col-lg-9 col-md-8">{user.role}</div>
                      </div>
                      <div className="row">
                        <div className="col-lg-3 col-md-4 label">Phone</div>
                        <div className="col-lg-9 col-md-8">{user.phone || 'N/A'}</div>
                      </div>
                      <div className="row">
                        <div className="col-lg-3 col-md-4 label">NID</div>
                        <div className="col-lg-9 col-md-8">{user.nid || 'N/A'}</div>
                      </div>
                    </div>

                    <div className="tab-pane fade profile-edit pt-3" id="profile-edit">
                      <form onSubmit={handleSubmit}>
                        
                        <div className="row mb-3">
                          <label htmlFor="firstname" className="col-md-4 col-lg-3 col-form-label">First Name</label>
                          <div className="col-md-8 col-lg-9">
                            <input name="firstname" type="text" className="form-control" id="firstname" value={formData.firstname} onChange={handleInputChange} />
                          </div>
                        </div>
                        <div className="row mb-3">
                          <label htmlFor="lastname" className="col-md-4 col-lg-3 col-form-label">Last Name</label>
                          <div className="col-md-8 col-lg-9">
                            <input name="lastname" type="text" className="form-control" id="lastname" value={formData.lastname} onChange={handleInputChange} />
                          </div>
                        </div>
                        <div className="row mb-3">
                          <label htmlFor="phone" className="col-md-4 col-lg-3 col-form-label">Phone</label>
                          <div className="col-md-8 col-lg-9">
                            <input name="phone" type="text" className="form-control" id="phone" value={formData.phone} onChange={handleInputChange} />
                          </div>
                        </div>
                        <div className="row mb-3">
                          <label htmlFor="phone" className="col-md-4 col-lg-3 col-form-label">NID</label>
                          <div className="col-md-8 col-lg-9">
                            <input name="nid" type="text" className="form-control" id="nid"
                              required
                              maxLength="16"
                              minLength="16"
                              pattern="\d{16}"
                              title="National ID must be exactly 16 digits"
                             value={formData.nid} onChange={handleInputChange} />
                          </div>
                        </div>
                        <div className="text-center">
                          <button type="submit" className="btn " disabled={loadingUpdate} style={{backgroundColor:'white',color:'black'}}>
                            {loadingUpdate ? 'Updating...' : 'Update Profile'}
                          </button>
                        </div>
                      </form>
                    </div>

                    <div className="tab-pane fade pt-3" id="profile-change-password">
                      <form onSubmit={handleChangePassword}>
                        <div className="row mb-3">
                          <label htmlFor="oldPassword" className="col-md-4 col-lg-3 col-form-label">Old Password</label>
                          <div className="col-md-8 col-lg-9">
                            <input name="oldPassword" type="password" className="form-control" id="oldPassword" value={passwordData.oldPassword} onChange={handlePasswordChange} required />
                          </div>
                        </div>
                        <div className="row mb-3">
                          <label htmlFor="newPassword" className="col-md-4 col-lg-3 col-form-label">New Password</label>
                          <div className="col-md-8 col-lg-9">
                            <input name="newPassword" type="password" className="form-control" id="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} required />
                          </div>
                        </div>
                        <div className="row mb-3">
                          <label htmlFor="confirmPassword" className="col-md-4 col-lg-3 col-form-label">Confirm Password</label>
                          <div className="col-md-8 col-lg-9">
                            <input name="confirmPassword" type="password" className="form-control" id="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} required />
                          </div>
                        </div>
                        <div className="text-center">
                          <button type="submit" className="btn " disabled={loadingChangePassword} style={{backgroundColor:'white',color:'black'}}>
                            {loadingChangePassword ? 'Changing...' : 'Change Password'}
                          </button>
                        </div>
                      </form>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            
            
          </div>
        </section>
      </main>
      <ToastContainer />
    </>
  );
}

export default Home;
