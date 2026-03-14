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
    <>
      <div className="gov-page">
        <div className="gov-top-bar">
          <div className="gov-top-bar-text">SMART VILLAGE Portal - LIBERIA</div>
        </div>

        <div className="gov-card">
          <div className="gov-card-head">
            <div className="gov-card-title">Smart Village Management System</div>
          </div>

          <div className="gov-card-body">
            <form onSubmit={handleSubmit}>
              <div className="gov-field">
                <label className="gov-label" htmlFor="email">
                  Email Address <span className="gov-label-required">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  className="gov-input"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="gov-field">
                <label className="gov-label" htmlFor="password">
                  Password <span className="gov-label-required">*</span>
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  className="gov-input"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="gov-check-row">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Keep me signed in on this device</label>
              </div>

              <button type="submit" className="gov-btn" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>

          <div className="gov-card-footer">
            <a href="./signup" className="gov-footer-link">Register for access</a>
            <span className="gov-footer-ref">SVMS-2026</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;