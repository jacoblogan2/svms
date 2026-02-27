import React, { useState } from "react";

const AddUser = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    nid: "",
    role: "citizen",
    gender: "Male",
  });

  const [message, setMessage] = useState("");
  let token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/v1/users/addUser`,
        {
          method: "POST",
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setMessage("User added successfully!");
      } else {
        setMessage(data.message || "Failed to add user.");
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4" style={{color:'white'}}>
        <h2 className="text-center mb-4">Add User</h2>
        {message && <div className="alert alert-info">{message}</div>}
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-6">
            <label className="form-label">First Name</label>
            <input
              type="text"
              name="firstname"
              className="form-control"
              placeholder="Enter first name"
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              name="lastname"
              className="form-control"
              placeholder="Enter last name"
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter email"
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Phone</label>
            <input
              type="text"
              name="phone"
              className="form-control"
              placeholder="Enter phone number"
              onChange={handleChange}
              required
            />
          </div>
      
          <div className="col-md-6">
            <label className="form-label">Gender</label>
            <select
              name="gender"
              className="form-control"
              onChange={handleChange}
              value={formData.gender}
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">National ID number</label>
            <input
             type="text"
             name="nid"
             className="form-control bg-dark text-white"
             placeholder="National ID"
             onChange={handleChange}
             value={formData.nid}
             required
             maxLength="16"
             minLength="16"
             pattern="\d{16}"
             title="National ID must be exactly 16 digits"
            />
          </div>
          <div className="col-12 text-center">
            <button type="submit" className="btn  w-100"  style={{backgroundColor:'white',color:'black'}}>Add Citizen</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;