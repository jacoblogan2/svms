// import './App.css';
import React, { useState } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate,useParams} from 'react-router-dom';
// import LoadingSpinner from '../../components/loading'; 

import 'react-toastify/dist/ReactToastify.css'
function Sidebar() {
  const navigate = useNavigate();
  const { email } = useParams();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
    
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/users/resetPassword/${email}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
        }),
      });

      if (response.ok) {
        const res = await response.json();
        toast.success(res.message);
        await new Promise((resolve) => setTimeout(resolve, 2000));


          await navigate('../login');
    
      } else {
        const errorData = await response.json();
        toast.error(errorData.message);
      }
    } catch (error) {
      console.error('Error creating account', error);
      toast.error('Failed to create account. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div class="container-fluid" style={{backgroundColor:'black' }}>

    <section class="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">

       

            <div class="card mb-3">

              <div class="card-body">

                <div class="pt-4 pb-2">
                  <h5 class="card-title text-center pb-0 fs-4">Now, Reset your Password</h5>
                  
                </div>

                <form onSubmit={handleSubmit}   class="row g-3 needs-validation" novalidate>

              

                  <div class="col-12">
                    <label for="yourPassword" class="form-label">New Password</label>
                    <input type="password" name="newPassword" class="form-control" id="yourPassword"  onChange={handleChange} required/>
                    <div class="invalid-feedback">Please enter your password!</div>
                  </div>

                  <div class="col-12">
                    <label for="yourPassword" class="form-label">Confirm Password</label>
                    <input type="password" name="confirmPassword" class="form-control" id="yourPassword"  onChange={handleChange} required/>
                    <div class="invalid-feedback">Please enter your password!</div>
                  </div>

                  <div class="col-12">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" name="remember" value="true"  onChange={handleChange} id="rememberMe"/>
                      <label class="form-check-label" for="rememberMe">Remember me</label>
                    </div>
                  </div>
                  <div class="col-12">
                  <button  type="submit" className={`btn d-block w-100 ${loading ? 'loading' : ''}`} style={{backgroundColor:'white',color:'black'}} disabled={loading}>
              {loading ? 'loading....': 'reset password'}</button>
                  </div>
                
                </form>

              </div>
            </div>

          
          </div>
        </div>
      </div>

    </section>
    <ToastContainer />



  </div>
  );
}

export default Sidebar;
