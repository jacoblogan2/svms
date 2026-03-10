import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        const res = await response.json();
        toast.success(res.message);
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        
        setTimeout(() => {
          navigate(res.user.role === 'admin' ? '../statistics' : '../statistics');
        }, 2000);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message);
      }
    } catch (error) {
      toast.error('Failed to login. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-black">
      <div className="row justify-content-center w-100">
        <div className="col-md-6 col-12">
          <div className="bg-dark p-5 rounded shadow-lg text-white">
            <h2 className="text-center h3">Smart Village Management System</h2>
           <br/> <h3 className="text-center h5 mt-2">Sign in</h3>
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address*</label>
                <input 
                  type="email" 
                  name="email" 
                  className="form-control bg-dark text-white" 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password*</label>
                <input 
                  type="password" 
                  name="password" 
                  className="form-control bg-dark text-white" 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="d-flex justify-content-between mb-3">
                <label className="d-flex align-items-center">
                  <input type="checkbox" className="me-2" /> Remember me
                </label>
                {/* <a href="./reset" className="text-primary">Forgotten your password?</a> */}
              </div>
              <button 
                type="submit" 
                className={`btn btn-primary w-100 ${loading ? 'opacity-50' : ''}`} 
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Sign in'}
              </button>
            </form>
            <div className="text-center mt-3">
              <a href="./signup" className="text-primary">Sign up for an account</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
