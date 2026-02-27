import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

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

  const [message, setMessage] = useState("");
  const [counties, setCounties] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [clans, setClans] = useState([]);
  const [towns, setTowns] = useState([]);
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(false);

  let token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAddressData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/address`);
        const data = await response.json();
        if (data.success) {
          setCounties(data.data); // Store all address data
        } else {
          setMessage("Failed to fetch address data.");
        }
      } catch (error) {
        setMessage("Error fetching address data: " + error.message);
      }
    };
    fetchAddressData();
  }, []);

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

    const selectedDistrict = districts.find((district) => district.id === parseInt(districtId));
    setClans(selectedDistrict ? selectedDistrict.clans : []);
  };

  const handleClanChange = (e) => {
    const clanId = e.target.value;
    setFormData({ ...formData, clan_id: clanId, town_id: "", village_id: "" });

    const selectedClan = clans.find((clan) => clan.id === parseInt(clanId));
    setTowns(selectedClan ? selectedClan.towns : []);
  };

  const handleTownChange = (e) => {
    const townId = e.target.value;
    setFormData({ ...formData, town_id: townId, village_id: "" });

    const selectedTown = towns.find((town) => town.id === parseInt(townId));
    setVillages(selectedTown ? selectedTown.villages : []);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/users/signup`, {
        method: "POST",
        headers: {
          "accept": "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
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
              className="form-control bg-dark text-white"
              placeholder="National ID"
              onChange={handleChange}
              required
              maxLength="16"
              minLength="16"
              pattern="\d{16}"
              title="National ID must be exactly 16 digits"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="firstname" className="form-label">First Name*</label>
            <input
              type="text"
              name="firstname"
              className="form-control bg-dark text-white"
              placeholder="First Name"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="lastname" className="form-label">Last Name*</label>
            <input
              type="text"
              name="lastname"
              className="form-control bg-dark text-white"
              placeholder="Last Name"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email*</label>
            <input
              type="email"
              name="email"
              className="form-control bg-dark text-white"
              placeholder="Email"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="phone" className="form-label">Phone*</label>
            <input
              type="text"
              name="phone"
              className="form-control bg-dark text-white"
              placeholder="Phone number"
              onChange={handleChange}
              required
              maxLength="10"
              minLength="10"
              pattern="\d{10}"
              title="Phone number must be exactly 10 digits"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="gender" className="form-label">Gender*</label>
            <select
              name="gender"
              className="form-select bg-dark text-white"
              onChange={handleChange}
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
              className="form-select bg-dark text-white"
              onChange={handleCountyChange}
              required
            >
              <option value="">Select County</option>
              {counties.map((county) => (
                <option key={county.id} value={county.id}>
                  {county.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="district_id" className="form-label">District*</label>
            <select
              name="district_id"
              className="form-select bg-dark text-white"
              onChange={handleDistrictChange}
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
          </div>
          <div className="mb-3">
            <label htmlFor="clan_id" className="form-label">Clan*</label>
            <select
              name="clan_id"
              className="form-select bg-dark text-white"
              onChange={handleClanChange}
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
          </div>
          <div className="mb-3">
            <label htmlFor="town_id" className="form-label">Town*</label>
            <select
              name="town_id"
              className="form-select bg-dark text-white"
              onChange={handleTownChange}
              required
              disabled={!formData.clan_id}
            >
              <option value="">Select Town/Village</option>
              {towns.map((town) => (
                <option key={town.id} value={town.id}>
                  {town.name}
                </option>
              ))}
            </select>
          </div>
         
         {/*
          <div className="mb-3">
            <label htmlFor="village_id" className="form-label">Village (Optional)</label>
            <select
              name="village_id"
              className="form-select bg-dark text-white"
              onChange={handleChange}
              disabled={!formData.town_id}
            >
              <option value="">Select Village</option>
              {villages.map((village) => (
                <option key={village.id} value={village.id}>
                  {village.name}
                </option>
              ))}
            </select>
          </div>

         */}

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password*</label>
            <input
              type="password"
              name="password"
              className="form-control bg-dark text-white"
              placeholder="Password"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password*</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-control bg-dark text-white"
              placeholder="Confirm Password"
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-lg w-100 mt-4"
            disabled={loading}
          >
            {loading ? "Adding User..." : "Add User"}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddUser;
