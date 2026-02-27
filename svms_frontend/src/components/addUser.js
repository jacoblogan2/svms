import React, { useState, useEffect } from "react";

const AddUser = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    nid: "",
    role: "village_leader", 
    gender: "Male",
    address: "",
    county_id: "",
    district_id: "",
    clan_id: "",
    town_id: "",
    village_id: "",
  });

  const [message, setMessage] = useState("");
  const [counties, setCounties] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [clans, setClans] = useState([]);
  const [towns, setTowns] = useState([]);
  const [villages, setVillages] = useState([]);
  let token = localStorage.getItem('token');

  const inputStyle = { backgroundColor: 'white', color: 'black' };

  // Fetch initial address data
  useEffect(() => {
    const fetchAddressData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/address`, {
           headers: { Authorization: `Bearer ${token}` }
        });
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
  }, [token]);

  // Handle County Change
  const handleCountyChange = (e) => {
    const countyId = e.target.value;
    setFormData({ ...formData, county_id: countyId, district_id: "", clan_id: "", town_id: "", village_id: "" });
    const selectedCounty = counties.find(county => county.id === parseInt(countyId));
    setDistricts(selectedCounty ? selectedCounty.districts : []);
    setClans([]); setTowns([]); setVillages([]); // Reset dependent lists
  };

  // Handle District Change
  const handleDistrictChange = (e) => {
    const districtId = e.target.value;
    setFormData({ ...formData, district_id: districtId, clan_id: "", town_id: "", village_id: "" });
    const selectedDistrict = districts.find(district => district.id === parseInt(districtId));
    setClans(selectedDistrict ? selectedDistrict.clans : []);
    setTowns([]); setVillages([]); // Reset dependent lists
  };

  // Handle Clan Change
  const handleClanChange = (e) => {
    const clanId = e.target.value;
    setFormData({ ...formData, clan_id: clanId, town_id: "", village_id: "" });
    const selectedClan = clans.find(clan => clan.id === parseInt(clanId));
    setTowns(selectedClan ? selectedClan.towns : []);
    setVillages([]); // Reset dependent lists
  };

  // Handle Town Change (The Fix for Village populating)
  const handleTownChange = (e) => {
    const townId = e.target.value;
    setFormData({ ...formData, town_id: townId, village_id: "" });
    const selectedTown = towns.find(town => town.id === parseInt(townId));
    setVillages(selectedTown && selectedTown.villages ? selectedTown.villages : []);
  };

  // Standard input handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/users/addUser`, {
        method: "POST",
        headers: {
          "accept": "*/*",
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
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
    <div className="container memberx mt-5" style={{ backgroundColor: '#212120', padding: '0.5cm', borderRadius: '8px' }}>
      <h2 className="text-center mb-4 text-white">Add User/Leader</h2>
      
      {message && (
        <div className={`alert ${message.includes("successfully") ? "alert-success" : "alert-danger"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="row g-3">
        {/* National ID Section */}
        <div className="col-12">
          <label className="text-white mb-1">National ID <span className="text-danger">*</span></label>
          <input
            type="text"
            name="nid"
            className="form-control"
            style={inputStyle}
            placeholder="Citizen ID Number"
            onChange={handleChange}
            required
            maxLength="10"
            minLength="10"
            pattern="\d{10}"
          />
        </div>

        {/* Basic Info */}
        <div className="col-md-6">
          <input type="text" name="firstname" className="form-control" style={inputStyle} placeholder="First Name" onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <input type="text" name="lastname" className="form-control" style={inputStyle} placeholder="Last Name" onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <input type="email" name="email" className="form-control" style={inputStyle} placeholder="Email" onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <input type="text" name="phone" className="form-control" style={inputStyle} placeholder="Phone" onChange={handleChange} required />
        </div>

        {/* Role & Gender */}
        <div className="col-md-6">
          <label className="text-white mb-1">Select Role:</label>
          <select name="role" className="form-select" style={inputStyle} onChange={handleChange} value={formData.role} required>
            <option value="citizen">Citizen</option>
            <option value="village_leader">Village Leader</option>
            <option value="town_leader">Town Leader</option>
            <option value="clan_leader">Clan Leader</option>
            <option value="district_leader">District Leader</option>
            <option value="county_leader">County Leader</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="col-md-6">
          <label className="text-white mb-1">Select Gender:</label>
          <select name="gender" className="form-select" style={inputStyle} onChange={handleChange} value={formData.gender} required>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* Address dropdowns hierarchy */}
        <div className="col-md-6">
          <select name="county_id" className="form-select" style={inputStyle} onChange={handleCountyChange} required>
            <option value="">Select County</option>
            {counties.map((county) => (
              <option key={county.id} value={county.id}>{county.name}</option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <select name="district_id" className="form-select" style={inputStyle} onChange={handleDistrictChange} disabled={!formData.county_id} required>
            <option value="">Select District</option>
            {districts.map((district) => (
              <option key={district.id} value={district.id}>{district.name}</option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <select name="clan_id" className="form-select" style={inputStyle} onChange={handleClanChange} disabled={!formData.district_id} required>
            <option value="">Select Clan</option>
            {clans.map((clan) => (
              <option key={clan.id} value={clan.id}>{clan.name}</option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <select name="town_id" className="form-select" style={inputStyle} onChange={handleTownChange} disabled={!formData.clan_id} required>
            <option value="">Select Town</option>
            {towns.map((town) => (
              <option key={town.id} value={town.id}>{town.name}</option>
            ))}
          </select>
        </div>

        <div className="col-12">
          <select name="village_id" className="form-select" style={inputStyle} onChange={handleChange} disabled={!formData.town_id || villages.length === 0} required={villages.length > 0}>
            <option value="">{villages.length > 0 ? "Select Village" : "No Villages Available"}</option>
            {villages.map((village) => (
              <option key={village.id} value={village.id}>{village.name}</option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <div className="col-12 mt-4">
          <button type="submit" className="btn w-100" style={{backgroundColor:'white', color:'black', fontWeight:'bold'}}>
            ADD USER
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;