import React, { useState, useEffect } from "react";

const AddUser = () => {
  const [formData, setFormData] = useState({
    reason: "",
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
    setFormData({ ...formData, county_id: countyId, district_id: "", clan_id: "", town_id: "", village_id: "" });

    const selectedCounty = counties.find(county => county.id === parseInt(countyId));
    setDistricts(selectedCounty ? selectedCounty.districts : []);
  };

  const handleDistrictChange = (e) => {
    const districtId = e.target.value;
    setFormData({ ...formData, district_id: districtId, clan_id: "", town_id: "", village_id: "" });

    const selectedDistrict = districts.find(district => district.id === parseInt(districtId));
    setClans(selectedDistrict ? selectedDistrict.clans : []);
  };

  const handleClanChange = (e) => {
    const clanId = e.target.value;
    setFormData({ ...formData, clan_id: clanId, town_id: "", village_id: "" });

    const selectedClan = clans.find(clan => clan.id === parseInt(clanId));
    setTowns(selectedClan ? selectedClan.towns : []);
  };

  const handleTownChange = (e) => {
    const townId = e.target.value;
    setFormData({ ...formData, town_id: townId, village_id: "" });

    const selectedTown = towns.find(town => town.id === parseInt(townId));
    setVillages(selectedTown ? selectedTown.villages : []);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/users/requests`, {
        method: "POST",
        headers: {
          "accept": "*/*",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("Transfer added successfully!");
      } else {
        setMessage(data.message || "Failed to add user.");
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-md-3">


        </div>
        <div className="col-md-6" >
          <div className="container member  mt-5" style={{ backgroundColor: '#212120', padding: '0.5cm' }}>
            <h2 className="text-center mb-4">Create transfer request</h2>
            {message && <div className="alert alert-info">{message}</div>}
            <form onSubmit={handleSubmit} className="row g-3" >
   
              <div className="col-md-12">
                <textarea
                  name="reason"
                  className="form-control"
                  placeholder="Enter Reason you want leave"
                  onChange={handleChange}
                  value={formData.reason}
                  rows="4"
                  required
                ></textarea>
              </div>






              {/* Address dropdowns */}
              <div className="col-md-6">
                <select name="county_id" className="form-select" onChange={handleCountyChange} required>
                  <option value="">Select County</option>
                  {counties.map((county) => (
                    <option key={county.id} value={county.id}>{county.name}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <select name="district_id" className="form-select" onChange={handleDistrictChange} disabled={!formData.county_id} required>
                  <option value="">Select District</option>
                  {districts.map((district) => (
                    <option key={district.id} value={district.id}>{district.name}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <select name="clan_id" className="form-select" onChange={handleClanChange} disabled={!formData.district_id} required>
                  <option value="">Select Clan</option>
                  {clans.map((clan) => (
                    <option key={clan.id} value={clan.id}>{clan.name}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <select name="town_id" className="form-select" onChange={handleTownChange} disabled={!formData.clan_id} required>
                  <option value="">Select Town/Village</option>
                  {towns.map((town) => (
                    <option key={town.id} value={town.id}>{town.name}</option>
                  ))}
                </select>
              </div>
            
            {/*
              <div className="col-md-6">
                <select name="village_id" className="form-select" onChange={handleChange} disabled={!formData.town_id} >
                  <option value="">Select Village (Optional)</option>
                  {villages.map((village) => (
                    <option key={village.id} value={village.id}>{village.name}</option>
                  ))}
                </select>
              </div>
            
            */}

              <div className="col-12">
                <button type="submit" className="btn btn-primary w-100">Create</button>
              </div>
            </form>
          
          </div>

        </div>
        <div className="col-md-3">



        </div>


      </div>

    </>

  );
};

export default AddUser;
