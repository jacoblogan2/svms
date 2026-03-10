import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import * as valUtils from "../utils/validation";

const AddUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    role: "citizen",
    nid: "",
    familyinfo: "",
    gender: "Male",
    address: "",
    county_id: "",
    district_id: "",
    clan_id: "",
    town_id: "",
    village_id: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [message, setMessage] = useState("");
  const [counties, setCounties] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [clans, setClans] = useState([]);
  const [towns, setTowns] = useState([]);
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAddressData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/address`);
        const data = await response.json();
        if (data.success) {
          setCounties(data.data);
        } else {
          setMessage("Failed to fetch address data.");
        }
      } catch (error) {
        setMessage("Error fetching address data: " + error.message);
      }
    };
    fetchAddressData();
  }, []);

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
      case "password":
        if (!valUtils.validatePassword(value)) error = "Password must be at least 8 characters.";
        break;
      case "confirmPassword":
        if (value !== formData.password) error = "Passwords do not match.";
        break;
      case "county_id":
        if (!value) error = "Please select a county.";
        break;
      case "district_id":
        if (!value) error = "Please select a district.";
        break;
      case "clan_id":
        if (!value) error = "Please select a clan.";
        break;
      case "town_id":
        if (!value) error = "Please select a town.";
        break;
      case "village_id":
        if (!value) error = "Please select a village.";
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

  const handleCountyChange = (e) => {
    const countyId = e.target.value;
    setFormData({
      ...formData,
      county_id: countyId,
      district_id: "",
      clan_id: "",
      town_id: "",
      village_id: "",
    });
    setTouched({ ...touched, county_id: true });
    setErrors({ ...errors, county_id: validateField("county_id", countyId) });

    const selectedCounty = counties.find((county) => county.id === parseInt(countyId));
    setDistricts(selectedCounty ? selectedCounty.districts : []);
  };

  const handleDistrictChange = (e) => {
    const districtId = e.target.value;
    setFormData({
      ...formData,
      district_id: districtId,
      clan_id: "",
      town_id: "",
      village_id: "",
    });
    setTouched({ ...touched, district_id: true });
    setErrors({ ...errors, district_id: validateField("district_id", districtId) });

    const selectedDistrict = districts.find((district) => district.id === parseInt(districtId));
    setClans(selectedDistrict ? selectedDistrict.clans : []);
  };

  const handleClanChange = (e) => {
    const clanId = e.target.value;
    setFormData({ ...formData, clan_id: clanId, town_id: "", village_id: "" });
    setTouched({ ...touched, clan_id: true });
    setErrors({ ...errors, clan_id: validateField("clan_id", clanId) });

    const selectedClan = clans.find((clan) => clan.id === parseInt(clanId));
    setTowns(selectedClan ? selectedClan.towns : []);
  };

  const handleTownChange = (e) => {
    const townId = e.target.value;
    setFormData({ ...formData, town_id: townId, village_id: "" });
    setTouched({ ...touched, town_id: true });
    setErrors({ ...errors, town_id: validateField("town_id", townId) });

    const selectedTown = towns.find((town) => town.id === parseInt(townId));
    setVillages(selectedTown ? selectedTown.villages : []);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let sanitizedValue = value;

    if (name === "nid" || name === "phone") {
      sanitizedValue = valUtils.sanitizeDigits(value);
    } else if (name === "firstname" || name === "lastname") {
      sanitizedValue = valUtils.sanitizeName(value);
    } else if (name === "email" || name === "familyinfo" || name === "address") {
      sanitizedValue = valUtils.sanitize(value);
    }

    setFormData({ ...formData, [name]: sanitizedValue });
    
    if (touched[name]) {
      setErrors({ ...errors, [name]: validateField(name, sanitizedValue) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
      toast.error("Please correct the errors in the form.");
      return;
    }

    setLoading(true);
    setMessage("");

    const { confirmPassword, ...payload } = formData;

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/users/signup`, {
        method: "POST",
        headers: {
          "accept": "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("User added successfully!");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error(data.message || "Failed to add user.");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getValidationClass = (name) => {
    if (!touched[name]) return "bg-dark text-white";
    return errors[name] ? "bg-dark text-white is-invalid" : "bg-dark text-white is-valid";
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100" style={{ backgroundColor: "black" }}>
      <div className="bg-dark p-5 rounded shadow-lg w-50 text-white">
        <h2 className="text-center h3">Liberia Smart Village Management System</h2>
        <h3 className="text-center h5 mt-2">Sign up</h3>
        {message && <div className="alert alert-info">{message}</div>}
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-3">
            <label htmlFor="nid" className="form-label">National ID*</label>
            <input
              type="text"
              name="nid"
              className={`form-control ${getValidationClass("nid")}`}
              placeholder="National ID"
              onChange={handleChange}
              onBlur={handleBlur}
              value={formData.nid}
              required
              maxLength="10"
            />
            {touched.nid && errors.nid && <div className="invalid-feedback">{errors.nid}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="firstname" className="form-label">First Name*</label>
            <input
              type="text"
              name="firstname"
              className={`form-control ${getValidationClass("firstname")}`}
              placeholder="First Name"
              onChange={handleChange}
              onBlur={handleBlur}
              value={formData.firstname}
              required
            />
            {touched.firstname && errors.firstname && <div className="invalid-feedback">{errors.firstname}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="lastname" className="form-label">Last Name*</label>
            <input
              type="text"
              name="lastname"
              className={`form-control ${getValidationClass("lastname")}`}
              placeholder="Last Name"
              onChange={handleChange}
              onBlur={handleBlur}
              value={formData.lastname}
              required
            />
            {touched.lastname && errors.lastname && <div className="invalid-feedback">{errors.lastname}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email*</label>
            <input
              type="email"
              name="email"
              className={`form-control ${getValidationClass("email")}`}
              placeholder="Email address"
              onChange={handleChange}
              onBlur={handleBlur}
              value={formData.email}
              required
            />
            {touched.email && errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="phone" className="form-label">Phone*</label>
            <input
              type="text"
              name="phone"
              className={`form-control ${getValidationClass("phone")}`}
              placeholder="Phone number"
              onChange={handleChange}
              onBlur={handleBlur}
              value={formData.phone}
              required
              maxLength="10"
            />
            {touched.phone && errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="gender" className="form-label">Gender*</label>
            <select
              name="gender"
              className="form-select bg-dark text-white"
              onChange={handleChange}
              value={formData.gender}
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="county_id" className="form-label">County*</label>
            <select
              name="county_id"
              className={`form-select ${getValidationClass("county_id")}`}
              onChange={handleCountyChange}
              onBlur={handleBlur}
              value={formData.county_id}
              required
            >
              <option value="">Select County</option>
              {counties.map((county) => (
                <option key={county.id} value={county.id}>
                  {county.name}
                </option>
              ))}
            </select>
            {touched.county_id && errors.county_id && <div className="invalid-feedback">{errors.county_id}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="district_id" className="form-label">District*</label>
            <select
              name="district_id"
              className={`form-select ${getValidationClass("district_id")}`}
              onChange={handleDistrictChange}
              onBlur={handleBlur}
              value={formData.district_id}
              required
              disabled={!formData.county_id}
            >
              <option value="">Select District</option>
              {districts.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
            </select>
            {touched.district_id && errors.district_id && <div className="invalid-feedback">{errors.district_id}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="clan_id" className="form-label">Clan*</label>
            <select
              name="clan_id"
              className={`form-select ${getValidationClass("clan_id")}`}
              onChange={handleClanChange}
              onBlur={handleBlur}
              value={formData.clan_id}
              required
              disabled={!formData.district_id}
            >
              <option value="">Select Clan</option>
              {clans.map((clan) => (
                <option key={clan.id} value={clan.id}>
                  {clan.name}
                </option>
              ))}
            </select>
            {touched.clan_id && errors.clan_id && <div className="invalid-feedback">{errors.clan_id}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="town_id" className="form-label">Town*</label>
            <select
              name="town_id"
              className={`form-select ${getValidationClass("town_id")}`}
              onChange={handleTownChange}
              onBlur={handleBlur}
              value={formData.town_id}
              required
              disabled={!formData.clan_id}
            >
              <option value="">Select Town</option>
              {towns.map((town) => (
                <option key={town.id} value={town.id}>
                  {town.name}
                </option>
              ))}
            </select>
            {touched.town_id && errors.town_id && <div className="invalid-feedback">{errors.town_id}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="village_id" className="form-label">Village*</label>
            <select
              name="village_id"
              className={`form-select ${getValidationClass("village_id")}`}
              onChange={handleChange}
              onBlur={handleBlur}
              value={formData.village_id}
              required
              disabled={!formData.town_id}
            >
              <option value="">Select Village</option>
              {villages.map((village) => (
                <option key={village.id} value={village.id}>
                  {village.name}
                </option>
              ))}
            </select>
            {touched.village_id && errors.village_id && <div className="invalid-feedback">{errors.village_id}</div>}
          </div>
         
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password*</label>
            <input
              type="password"
              name="password"
              className={`form-control ${getValidationClass("password")}`}
              placeholder="Password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={formData.password}
              required
            />
            {touched.password && errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password*</label>
            <input
              type="password"
              name="confirmPassword"
              className={`form-control ${getValidationClass("confirmPassword")}`}
              placeholder="Confirm Password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={formData.confirmPassword}
              required
            />
            {touched.confirmPassword && errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-lg w-100 mt-4"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
