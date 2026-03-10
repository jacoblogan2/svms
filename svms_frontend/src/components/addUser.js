import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import * as valUtils from "../utils/validation";

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

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [message, setMessage] = useState("");
  const [counties, setCounties] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [clans, setClans] = useState([]);
  const [towns, setTowns] = useState([]);
  const [villages, setVillages] = useState([]);
  let token = localStorage.getItem('token');

  const inputStyle = { backgroundColor: 'white', color: 'black' };

  const requiredFields = ROLE_REQUIRED_FIELDS[formData.role] || [];

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
      case "role":
        if (!value) error = "Role is required.";
        break;
      default:
        if (requiredFields.includes(name) && !value) {
          error = `Please select a ${name.replace("_id", "").replace("_", " ")}.`;
        }
        break;
    }
    return error;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

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
    setTouched({ ...touched, role: true });
    setErrors({ ...errors, role: validateField("role", newRole) });
    setDistricts([]); setClans([]); setTowns([]); setVillages([]);
  };

  const handleCountyChange = (e) => {
    const countyId = e.target.value;
    setFormData(prev => ({ ...prev, county_id: countyId, district_id: "", clan_id: "", town_id: "", village_id: "" }));
    setTouched({ ...touched, county_id: true });
    setErrors({ ...errors, county_id: validateField("county_id", countyId) });

    const selectedCounty = counties.find(c => c.id === parseInt(countyId));
    setDistricts(selectedCounty ? selectedCounty.districts : []);
    setClans([]); setTowns([]); setVillages([]);
  };

  const handleDistrictChange = (e) => {
    const districtId = e.target.value;
    setFormData(prev => ({ ...prev, district_id: districtId, clan_id: "", town_id: "", village_id: "" }));
    setTouched({ ...touched, district_id: true });
    setErrors({ ...errors, district_id: validateField("district_id", districtId) });

    const selectedDistrict = districts.find(d => d.id === parseInt(districtId));
    setClans(selectedDistrict ? selectedDistrict.clans : []);
    setTowns([]); setVillages([]);
  };

  const handleClanChange = (e) => {
    const clanId = e.target.value;
    setFormData(prev => ({ ...prev, clan_id: clanId, town_id: "", village_id: "" }));
    setTouched({ ...touched, clan_id: true });
    setErrors({ ...errors, clan_id: validateField("clan_id", clanId) });

    const selectedClan = clans.find(c => c.id === parseInt(clanId));
    setTowns(selectedClan ? selectedClan.towns : []);
    setVillages([]);
  };

  const handleTownChange = (e) => {
    const townId = e.target.value;
    setFormData(prev => ({ ...prev, town_id: townId, village_id: "" }));
    setTouched({ ...touched, town_id: true });
    setErrors({ ...errors, town_id: validateField("town_id", townId) });

    const selectedTown = towns.find(t => t.id === parseInt(townId));
    setVillages(selectedTown && selectedTown.villages ? selectedTown.villages : []);
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

    setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
    
    if (touched[name]) {
      setErrors({ ...errors, [name]: validateField(name, sanitizedValue) });
    }
  };

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
      if (formData[field]) payload[field] = formData[field];
    });

    return payload;
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
        toast.success("User added successfully!");
        setMessage("User added successfully!");
        setFormData({
          firstname: "", lastname: "", email: "", phone: "", nid: "",
          role: "village_leader", gender: "Male",
          county_id: "", district_id: "", clan_id: "", town_id: "", village_id: "",
        });
        setErrors({});
        setTouched({});
        setDistricts([]); setClans([]); setTowns([]); setVillages([]);
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
            className={`form-control ${getValidationClass("nid")}`}
            style={inputStyle}
            placeholder="Citizen ID Number"
            onChange={handleChange}
            onBlur={handleBlur}
            value={formData.nid}
            required
            maxLength="10"
          />
          {touched.nid && errors.nid && <div className="invalid-feedback">{errors.nid}</div>}
        </div>

        {/* Basic Info */}
        <div className="col-md-6">
          <label className="text-white mb-1">First Name*</label>
          <input type="text" name="firstname" className={`form-control ${getValidationClass("firstname")}`} style={inputStyle} placeholder="First Name" onChange={handleChange} onBlur={handleBlur} value={formData.firstname} required />
          {touched.firstname && errors.firstname && <div className="invalid-feedback d-block">{errors.firstname}</div>}
        </div>
        <div className="col-md-6">
          <label className="text-white mb-1">Last Name*</label>
          <input type="text" name="lastname" className={`form-control ${getValidationClass("lastname")}`} style={inputStyle} placeholder="Last Name" onChange={handleChange} onBlur={handleBlur} value={formData.lastname} required />
          {touched.lastname && errors.lastname && <div className="invalid-feedback d-block">{errors.lastname}</div>}
        </div>
        <div className="col-md-6">
          <label className="text-white mb-1">Email*</label>
          <input type="email" name="email" className={`form-control ${getValidationClass("email")}`} style={inputStyle} placeholder="Email" onChange={handleChange} onBlur={handleBlur} value={formData.email} required />
          {touched.email && errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}
        </div>
        <div className="col-md-6">
          <label className="text-white mb-1">Phone*</label>
          <input type="text" name="phone" className={`form-control ${getValidationClass("phone")}`} style={inputStyle} placeholder="Phone" onChange={handleChange} onBlur={handleBlur} value={formData.phone} required maxLength="10" />
          {touched.phone && errors.phone && <div className="invalid-feedback d-block">{errors.phone}</div>}
        </div>

        {/* Role & Gender */}
        <div className="col-md-6">
          <label className="text-white mb-1">Select Role:</label>
          <select name="role" className={`form-select ${getValidationClass("role")}`} style={inputStyle} onChange={handleRoleChange} onBlur={handleBlur} value={formData.role} required>
            <option value="citizen">Citizen</option>
            <option value="village_leader">Village Leader</option>
            <option value="town_leader">Town Leader</option>
            <option value="clan_leader">Clan Leader</option>
            <option value="district_leader">District Leader</option>
            <option value="county_leader">County Leader</option>
            <option value="admin">Admin</option>
          </select>
          {touched.role && errors.role && <div className="invalid-feedback d-block">{errors.role}</div>}
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
            <select name="county_id" className={`form-select ${getValidationClass("county_id")}`} style={inputStyle} onChange={handleCountyChange} onBlur={handleBlur} value={formData.county_id} required>
              <option value="">Select County</option>
              {counties.map(county => (
                <option key={county.id} value={county.id}>{county.name}</option>
              ))}
            </select>
            {touched.county_id && errors.county_id && <div className="invalid-feedback d-block">{errors.county_id}</div>}
          </div>
        )}

        {/* District */}
        {requiredFields.includes("district_id") && (
          <div className="col-md-6">
            <label className="text-white mb-1">Select District:</label>
            <select name="district_id" className={`form-select ${getValidationClass("district_id")}`} style={inputStyle} onChange={handleDistrictChange} onBlur={handleBlur} value={formData.district_id} disabled={!formData.county_id} required>
              <option value="">Select District</option>
              {districts.map(district => (
                <option key={district.id} value={district.id}>{district.name}</option>
              ))}
            </select>
            {touched.district_id && errors.district_id && <div className="invalid-feedback d-block">{errors.district_id}</div>}
          </div>
        )}

        {/* Clan */}
        {requiredFields.includes("clan_id") && (
          <div className="col-md-6">
            <label className="text-white mb-1">Select Clan:</label>
            <select name="clan_id" className={`form-select ${getValidationClass("clan_id")}`} style={inputStyle} onChange={handleClanChange} onBlur={handleBlur} value={formData.clan_id} disabled={!formData.district_id} required>
              <option value="">Select Clan</option>
              {clans.map(clan => (
                <option key={clan.id} value={clan.id}>{clan.name}</option>
              ))}
            </select>
            {touched.clan_id && errors.clan_id && <div className="invalid-feedback d-block">{errors.clan_id}</div>}
          </div>
        )}

        {/* Town */}
        {requiredFields.includes("town_id") && (
          <div className="col-md-6">
            <label className="text-white mb-1">Select Town:</label>
            <select name="town_id" className={`form-select ${getValidationClass("town_id")}`} style={inputStyle} onChange={handleTownChange} onBlur={handleBlur} value={formData.town_id} disabled={!formData.clan_id} required>
              <option value="">Select Town</option>
              {towns.map(town => (
                <option key={town.id} value={town.id}>{town.name}</option>
              ))}
            </select>
            {touched.town_id && errors.town_id && <div className="invalid-feedback d-block">{errors.town_id}</div>}
          </div>
        )}

        {/* Village */}
        {requiredFields.includes("village_id") && (
          <div className="col-12">
            <label className="text-white mb-1">Select Village:</label>
            <select name="village_id" className={`form-select ${getValidationClass("village_id")}`} style={inputStyle} onChange={handleChange} onBlur={handleBlur} value={formData.village_id} disabled={!formData.town_id || villages.length === 0} required={villages.length > 0}>
              <option value="">{villages.length > 0 ? "Select Village" : "No Villages Available"}</option>
              {villages.map(village => (
                <option key={village.id} value={village.id}>{village.name}</option>
              ))}
            </select>
            {touched.village_id && errors.village_id && <div className="invalid-feedback d-block">{errors.village_id}</div>}
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
