import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import * as valUtils from "../utils/validation";

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

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [message, setMessage] = useState("");
  let token = localStorage.getItem("token");

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "email":
        if (!valUtils.validateEmail(value)) error = "Invalid email format.";
        break;
      case "phone":
        if (!valUtils.validatePhone(value)) error = "Phone must be exactly 10 digits.";
        break;
      case "nid":
        if (!valUtils.validateNID(value)) error = "National ID must be exactly 10 digits.";
        break;
      case "firstname":
      case "lastname":
        if (!value.trim()) error = "This field is required.";
        break;
      default:
        break;
    }
    return error;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let sanitizedValue = value;

    if (name === "nid" || name === "phone") {
      sanitizedValue = valUtils.sanitizeDigits(value);
    } else if (name === "firstname" || name === "lastname") {
      sanitizedValue = valUtils.sanitizeName(value);
    } else if (name === "email") {
      sanitizedValue = valUtils.sanitize(value);
    }

    setFormData({ ...formData, [name]: sanitizedValue });
    
    if (touched[name]) {
      setErrors({ ...errors, [name]: validateField(name, sanitizedValue) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
      setMessage("Please correct the errors in the form.");
      return;
    }

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
        toast.success("User added successfully!");
        setMessage("User added successfully!");
        setFormData({
          firstname: "",
          lastname: "",
          email: "",
          phone: "",
          nid: "",
          role: "citizen",
          gender: "Male",
        });
        setErrors({});
        setTouched({});
      } else {
        setMessage(data.message || "Failed to add user.");
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  const getValidationClass = (name) => {
    if (!touched[name]) return "";
    return errors[name] ? "is-invalid" : "is-valid";
  };

  return (
    <div className="container mt-5">
      <ToastContainer />
      <div className="card shadow p-4" style={{color:'white', backgroundColor: '#212529'}}>
        <h2 className="text-center mb-4">Add Citizen</h2>
        {message && (
          <div className={`alert ${message.includes("successfully") ? "alert-success" : "alert-danger"}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-6">
            <label className="form-label">First Name*</label>
            <input
              type="text"
              name="firstname"
              className={`form-control ${getValidationClass("firstname")}`}
              placeholder="Enter first name"
              onChange={handleChange}
              onBlur={handleBlur}
              value={formData.firstname}
              required
            />
            {touched.firstname && errors.firstname && <div className="invalid-feedback">{errors.firstname}</div>}
          </div>
          <div className="col-md-6">
            <label className="form-label">Last Name*</label>
            <input
              type="text"
              name="lastname"
              className={`form-control ${getValidationClass("lastname")}`}
              placeholder="Enter last name"
              onChange={handleChange}
              onBlur={handleBlur}
              value={formData.lastname}
              required
            />
            {touched.lastname && errors.lastname && <div className="invalid-feedback">{errors.lastname}</div>}
          </div>
          <div className="col-md-6">
            <label className="form-label">Email*</label>
            <input
              type="email"
              name="email"
              className={`form-control ${getValidationClass("email")}`}
              placeholder="Enter email"
              onChange={handleChange}
              onBlur={handleBlur}
              value={formData.email}
              required
            />
            {touched.email && errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>
          <div className="col-md-6">
            <label className="form-label">Phone*</label>
            <input
              type="text"
              name="phone"
              className={`form-control ${getValidationClass("phone")}`}
              placeholder="Enter 10-digit phone number"
              onChange={handleChange}
              onBlur={handleBlur}
              value={formData.phone}
              required
              maxLength="10"
            />
            {touched.phone && errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
          </div>
      
          <div className="col-md-6">
            <label className="form-label">Gender</label>
            <select
              name="gender"
              className="form-control bg-dark text-white"
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
            <label className="form-label">National ID Number*</label>
            <input
             type="text"
             name="nid"
             className={`form-control bg-dark text-white ${getValidationClass("nid")}`}
             placeholder="10-digit National ID"
             onChange={handleChange}
             onBlur={handleBlur}
             value={formData.nid}
             required
             maxLength="10"
            />
            {touched.nid && errors.nid && <div className="invalid-feedback">{errors.nid}</div>}
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
