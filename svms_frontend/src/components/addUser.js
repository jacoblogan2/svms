import React, { useState, useEffect } from "react";

// Defines which address fields are required per role
const ROLE_REQUIRED_FIELDS = {
  admin:           [],
  county_leader:   ["county_id"],
  district_leader: ["county_id", "district_id"],
  clan_leader:     ["county_id", "district_id", "clan_id"],
  town_leader:     ["county_id", "district_id", "clan_id", "town_id"],
  village_leader:  ["county_id", "district_id", "clan_id", "town_id", "village_id"],
  citizen:         ["county_id", "district_id", "clan_id", "town_id", "village_id"],
};

const AddUser = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    nid: "",
    role: "village_leader",
    gender: "Male",
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

  const requiredFields = ROLE_REQUIRED_FIELDS[formData.role] || [];
  const needsDistrict = requiredFields.includes("district_id");
  const needsClan     = requiredFields.includes("clan_id");
  const needsTown     = requiredFields.includes("town_id");
  const needsVillage  = requiredFields.includes("village_id");

  // Fetch initial address data
  useEffect(() => {
    const fetchAddressData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/address`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Server responded with ${response.status}`);
        }
        const data = await response.json();
        if (data.success) {
          setCounties(data.data);
        } else {
          setMessage(data.message || "Failed to fetch address data.");
        }
      } catch (error) {
        console.error("Error fetching address data:", error);
        setMessage("Error fetching address data: " + error.message);
      }
    };
    fetchAddressData();
  }, [token]);

  // Reset downstream address fields when role changes
  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setFormData(prev => ({
      ...prev,
      role: newRole,
      county_id: "",
      district_id: "",
      clan_id: "",
      town_id: "",
      village_id: "",
    }));
    setDistricts([]); setClans([]); setTowns([]); setVillages([]);
  };

  const handleCountyChange = (e) => {
    const countyId = e.target.value;
    setFormData(prev => ({ ...prev, county_id: countyId, district_id: "", clan_id: "", town_id: "", village_id: "" }));
    const selectedCounty = counties.find(c => c.id === parseInt(countyId));
    setDistricts(selectedCounty ? selectedCounty.districts : []);
    setClans([]); setTowns([]); setVillages([]);
  };

  const handleDistrictChange = (e) => {
    const districtId = e.target.value;
    setFormData(prev => ({ ...prev, district_id: districtId, clan_id: "", town_id: "", village_id: "" }));
    const selectedDistrict = districts.find(d => d.id === parseInt(districtId));
    setClans(selectedDistrict ? selectedDistrict.clans : []);
    setTowns([]); setVillages([]);
  };

  const handleClanChange = (e) => {
    const clanId = e.target.value;
    setFormData(prev => ({ ...prev, clan_id: clanId, town_id: "", village_id: "" }));
    const selectedClan = clans.find(c => c.id === parseInt(clanId));
    setTowns(selectedClan ? selectedClan.towns : []);
    setVillages([]);
  };

  const handleTownChange = (e) => {
    const townId = e.target.value;
    setFormData(prev => ({ ...prev, town_id: townId, village_id: "" }));
    const selectedTown = towns.find(t => t.id === parseInt(townId));
    setVillages(selectedTown && selectedTown.villages ? selectedTown.villages : []);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Build payload: only include address fields relevant to the selected role
  const buildPayload = () => {
    const payload = {
      firstname: formData.firstname,
      lastname:  formData.lastname,
      email:     formData.email,
      phone:     formData.phone,
      nid:       formData.nid,
      role:      formData.role,
      gender:    formData.gender,
    };

    requiredFields.forEach(field => {
      // Only send the field if it has a value
      if (formData[field]) payload[field] = formData[field];
    });

    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Basic client-side validation: ensure required address fields are selected
    for (const field of requiredFields) {
      if (!formData[field]) {
        const label = field.replace("_id", "").replace("_", " ");
        setMessage(`Please select a ${label}.`);
        return;
      }
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/users/addUser`, {
        method: "POST",
        headers: {
          "accept": "*/*",
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(buildPayload()),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("User added successfully!");
        // Reset form
        setFormData({
          firstname: "", lastname: "", email: "", phone: "", nid: "",
          role: "village_leader", gender: "Male",
          county_id: "", district_id: "", clan_id: "", town_id: "", village_id: "",
        });
        setDistricts([]); setClans([]); setTowns([]); setVillages([]);
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
        {/* National ID */}
        <div className="col-12">
          <label className="text-white mb-1">National ID <span className="text-danger">*</span></label>
          <input
            type="text"
            name="nid"
            className="form-control"
            style={inputStyle}
            placeholder="Citizen ID Number"
            onChange={handleChange}
            value={formData.nid}
            required
            maxLength="10"
            minLength="10"
            pattern="\d{10}"
          />
        </div>

        {/* Basic Info */}
        <div className="col-md-6">
          <input type="text" name="firstname" className="form-control" style={inputStyle} placeholder="First Name" onChange={handleChange} value={formData.firstname} required />
        </div>
        <div className="col-md-6">
          <input type="text" name="lastname" className="form-control" style={inputStyle} placeholder="Last Name" onChange={handleChange} value={formData.lastname} required />
        </div>
        <div className="col-md-6">
          <input type="email" name="email" className="form-control" style={inputStyle} placeholder="Email" onChange={handleChange} value={formData.email} required />
        </div>
        <div className="col-md-6">
          <input type="text" name="phone" className="form-control" style={inputStyle} placeholder="Phone" onChange={handleChange} value={formData.phone} required />
        </div>

        {/* Role & Gender */}
        <div className="col-md-6">
          <label className="text-white mb-1">Select Role:</label>
          <select name="role" className="form-select" style={inputStyle} onChange={handleRoleChange} value={formData.role} required>
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

        {/* County — always shown unless admin */}
        {formData.role !== "admin" && (
          <div className="col-md-6">
            <label className="text-white mb-1">Select County:</label>
            <select name="county_id" className="form-select" style={inputStyle} onChange={handleCountyChange} value={formData.county_id} required>
              <option value="">Select County</option>
              {counties.map(county => (
                <option key={county.id} value={county.id}>{county.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* District */}
        {needsDistrict && (
          <div className="col-md-6">
            <label className="text-white mb-1">Select District:</label>
            <select name="district_id" className="form-select" style={inputStyle} onChange={handleDistrictChange} value={formData.district_id} disabled={!formData.county_id} required>
              <option value="">Select District</option>
              {districts.map(district => (
                <option key={district.id} value={district.id}>{district.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Clan */}
        {needsClan && (
          <div className="col-md-6">
            <label className="text-white mb-1">Select Clan:</label>
            <select name="clan_id" className="form-select" style={inputStyle} onChange={handleClanChange} value={formData.clan_id} disabled={!formData.district_id} required>
              <option value="">Select Clan</option>
              {clans.map(clan => (
                <option key={clan.id} value={clan.id}>{clan.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Town */}
        {needsTown && (
          <div className="col-md-6">
            <label className="text-white mb-1">Select Town:</label>
            <select name="town_id" className="form-select" style={inputStyle} onChange={handleTownChange} value={formData.town_id} disabled={!formData.clan_id} required>
              <option value="">Select Town</option>
              {towns.map(town => (
                <option key={town.id} value={town.id}>{town.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Village */}
        {needsVillage && (
          <div className="col-12">
            <label className="text-white mb-1">Select Village:</label>
            <select name="village_id" className="form-select" style={inputStyle} onChange={handleChange} value={formData.village_id} disabled={!formData.town_id || villages.length === 0} required={villages.length > 0}>
              <option value="">{villages.length > 0 ? "Select Village" : "No Villages Available"}</option>
              {villages.map(village => (
                <option key={village.id} value={village.id}>{village.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Submit */}
        <div className="col-12 mt-4">
          <button type="submit" className="btn w-100" style={{ backgroundColor: 'white', color: 'black', fontWeight: 'bold' }}>
            ADD USER
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;