import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from "react-bootstrap";
import { toast } from "react-toastify";

const TransferRequest = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || {});
  const token = localStorage.getItem("token");
  const baseURL = process.env.REACT_APP_BASE_URL;

  const [formData, setFormData] = useState({
    // Citizen Identity
    full_name: `${user.firstname || ""} ${user.lastname || ""}`,
    national_id: user.nid || "",
    phone_number: user.phone || "",
    household_size: "1",

    // Current Residence (Pre-filled/Read-only representation)
    current_county_id: user.county_id || "",
    current_district_id: user.district_id || "",
    current_clan_id: user.clan_id || "",
    current_town_id: user.town_id || "",
    current_village_id: user.village_id || "",

    // Destination
    county_id: "",
    district_id: "",
    clan_id: "",
    town_id: "",
    village_id: "",

    // Transfer Details
    transfer_type: "Family relocation",
    move_date: "",
    transfer_duration: "Permanent",
    reason: "",
    document: null,

    // Host Info
    host_name: "",
    host_phone: "",
    host_relationship: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user.id) return;
      try {
        const res = await fetch(`${baseURL}/api/v1/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            setUser(data.data);
            // Also update localStorage so they don't have to keep fetching
            localStorage.setItem("user", JSON.stringify({ ...user, ...data.data }));
          }
        }
      } catch (err) {
        console.error("Error fetching latest profile:", err);
      }
    };
    fetchProfile();
  }, [baseURL, token, user.id]);

  useEffect(() => {
    // Re-sync form if user object updates (after fetch)
    setFormData(prev => ({
      ...prev,
      full_name: `${user.firstname || ""} ${user.lastname || ""}`,
      national_id: user.nid || prev.national_id,
      phone_number: user.phone || prev.phone_number,
      current_county_id: user.county_id || prev.current_county_id,
      current_district_id: user.district_id || prev.current_district_id,
      current_clan_id: user.clan_id || prev.current_clan_id,
      current_town_id: user.town_id || prev.current_town_id,
      current_village_id: user.village_id || prev.current_village_id,
    }));
  }, [user]);

  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [addressHierarchy, setAddressHierarchy] = useState([]);
  
  // Selection filtering for Destination
  const [districts, setDistricts] = useState([]);
  const [clans, setClans] = useState([]);
  const [towns, setTowns] = useState([]);
  const [villages, setVillages] = useState([]);

  // Selection filtering for Current Residence
  const [currentDistricts, setCurrentDistricts] = useState([]);
  const [currentClans, setCurrentClans] = useState([]);
  const [currentTowns, setCurrentTowns] = useState([]);
  const [currentVillages, setCurrentVillages] = useState([]);

  // Resolve residence IDs to Names
  const [residenceNames, setResidenceNames] = useState({
    county: "Loading...",
    district: "Loading...",
    clan: "Loading...",
    town: "Loading...",
    village: "Loading..."
  });

  useEffect(() => {
    if (addressHierarchy.length > 0 && user.county_id) {
      const county = addressHierarchy.find(c => c.id === parseInt(user.county_id));
      const district = county?.districts?.find(d => d.id === parseInt(user.district_id));
      const clan = district?.clans?.find(c => c.id === parseInt(user.clan_id));
      const town = clan?.towns?.find(t => t.id === parseInt(user.town_id));
      const village = town?.villages?.find(v => v.id === parseInt(user.village_id));
      
      setResidenceNames({
        county: county?.name || "N/A",
        district: district?.name || "N/A",
        clan: clan?.name || "N/A",
        town: town?.name || "N/A",
        village: village?.name || "N/A"
      });
    } else if (addressHierarchy.length > 0) {
      setResidenceNames({
        county: "N/A",
        district: "N/A",
        clan: "N/A",
        town: "N/A",
        village: "N/A"
      });
    }
  }, [addressHierarchy, user.county_id, user.district_id, user.clan_id, user.town_id, user.village_id]);

  useEffect(() => {
    const fetchAddressData = async () => {
      try {
        const response = await fetch(`${baseURL}/api/v1/address`);
        const data = await response.json();
        if (data.success) {
          setAddressHierarchy(data.data);
        }
      } catch (error) {
        toast.error("Error fetching address data");
      }
    };
    fetchAddressData();
  }, [baseURL]);

  useEffect(() => {
    if (addressHierarchy.length > 0 && user.county_id) {
      const county = addressHierarchy.find(c => c.id === parseInt(user.county_id));
      if (county) {
        setCurrentDistricts(county.districts || []);
        const district = county.districts?.find(d => d.id === parseInt(user.district_id));
        if (district) {
          setCurrentClans(district.clans || []);
          const clan = district.clans?.find(c => c.id === parseInt(user.clan_id));
          if (clan) {
            setCurrentTowns(clan.towns || []);
            const town = clan.towns?.find(t => t.id === parseInt(user.town_id));
            if (town) {
              setCurrentVillages(town.villages || []);
            }
          }
        }
      }
    }
  }, [addressHierarchy, user.county_id, user.district_id, user.clan_id, user.town_id, user.village_id]);

  // Current Residence Handlers
  const handleCurrentCountyChange = (e) => {
    const id = e.target.value;
    setFormData({ ...formData, current_county_id: id, current_district_id: "", current_clan_id: "", current_town_id: "", current_village_id: "" });
    const selected = addressHierarchy.find(c => c.id === parseInt(id));
    setCurrentDistricts(selected ? selected.districts : []);
    setCurrentClans([]); setCurrentTowns([]); setCurrentVillages([]);
  };

  const handleCurrentDistrictChange = (e) => {
    const id = e.target.value;
    setFormData({ ...formData, current_district_id: id, current_clan_id: "", current_town_id: "", current_village_id: "" });
    const selected = currentDistricts.find(d => d.id === parseInt(id));
    setCurrentClans(selected ? selected.clans : []);
    setCurrentTowns([]); setCurrentVillages([]);
  };

  const handleCurrentClanChange = (e) => {
    const id = e.target.value;
    setFormData({ ...formData, current_clan_id: id, current_town_id: "", current_village_id: "" });
    const selected = currentClans.find(c => c.id === parseInt(id));
    setCurrentTowns(selected ? selected.towns : []);
    setCurrentVillages([]);
  };

  const handleCurrentTownChange = (e) => {
    const id = e.target.value;
    setFormData({ ...formData, current_town_id: id, current_village_id: "" });
    const selected = currentTowns.find(t => t.id === parseInt(id));
    setCurrentVillages(selected && selected.villages ? selected.villages : []);
  };

  const handleCurrentVillageChange = (e) => {
    const id = e.target.value;
    setFormData({ ...formData, current_village_id: id });
  };

  // Destination Handlers
  const handleCountyChange = (e) => {
    const id = e.target.value;
    setFormData({ ...formData, county_id: id, district_id: "", clan_id: "", town_id: "", village_id: "" });
    const selected = addressHierarchy.find(c => c.id === parseInt(id));
    setDistricts(selected ? selected.districts : []);
    setClans([]); setTowns([]); setVillages([]);
  };

  const handleDistrictChange = (e) => {
    const id = e.target.value;
    setFormData({ ...formData, district_id: id, clan_id: "", town_id: "", village_id: "" });
    const selected = districts.find(d => d.id === parseInt(id));
    setClans(selected ? selected.clans : []);
    setTowns([]); setVillages([]);
  };

  const handleClanChange = (e) => {
    const id = e.target.value;
    setFormData({ ...formData, clan_id: id, town_id: "", village_id: "" });
    const selected = clans.find(c => c.id === parseInt(id));
    setTowns(selected ? selected.towns : []);
    setVillages([]);
  };

  const handleTownChange = (e) => {
    const id = e.target.value;
    setFormData({ ...formData, town_id: id, village_id: "" });
    const selected = towns.find(t => t.id === parseInt(id));
    setVillages(selected ? selected.villages : []);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "document") {
      setFormData({ ...formData, document: files[0] });
      return;
    }

    // Strict Validation Logic
    let validatedValue = value;

    if (name === "national_id" || name === "phone_number" || name === "host_phone") {
      // Only numbers allowed
      validatedValue = value.replace(/[^0-9]/g, "");
      
      // National ID max 10 characters
      if (name === "national_id" && validatedValue.length > 10) {
        return;
      }
    }

    if (name === "full_name" || name === "host_name") {
      // Only letters and spaces allowed
      validatedValue = value.replace(/[^a-zA-Z\s]/g, "");
    }

    setFormData({ ...formData, [name]: validatedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    // Final Validation Check
    if (formData.national_id && formData.national_id.length > 10) {
      toast.error("National ID cannot exceed 10 digits");
      setSubmitting(false);
      return;
    }

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          data.append(key, formData[key]);
        }
      });

      const response = await fetch(`${baseURL}/api/v1/users/requests`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await response.json();
      if (response.ok) {
        toast.success("Transfer request submitted successfully!");
        // Reset form for destination and details
        setFormData({
          ...formData,
          county_id: "", district_id: "", clan_id: "", town_id: "", village_id: "",
          move_date: "", reason: "", document: null
        });
      } else {
        toast.error(result.message || "Failed to submit request");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="dashboard-stats">
      <div className="mb-4">
        
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="text-white h3 mb-1">Create Transfer Request</h1>
            <p className="text-muted small mb-0">Fill in the details below to initiate a formal citizen transfer.</p>
          </div>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><a href="/" className="text-info">Home</a></li>
              <li className="breadcrumb-item active text-white">New Transfer</li>
            </ol>
          </nav>
        </div>

      <Form onSubmit={handleSubmit} className="mt-3">
        <Row className="gy-4">
          {/* Citizen Identity */}
          <Col lg={6}>
            <Card className="bg-dark text-white border-secondary h-100">
              <Card.Header className="border-secondary bg-transparent py-3">
                <h5 className="mb-0 text-info font-weight-bold">Citizen Information</h5>
              </Card.Header>
              <Card.Body className="p-4">
                <Form.Group className="mb-3">
                  <Form.Label>Full Name*</Form.Label>
                  <Form.Control 
                    className="bg-black text-white border-secondary" 
                    type="text" 
                    name="full_name" 
                    value={formData.full_name} 
                    onChange={handleChange} 
                    required 
                  />
                </Form.Group>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>National ID (NID)*</Form.Label>
                      <Form.Control 
                        className="bg-black text-white border-secondary" 
                        type="text" 
                        name="national_id" 
                        value={formData.national_id} 
                        onChange={handleChange} 
                        required 
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number*</Form.Label>
                      <Form.Control 
                        className="bg-black text-white border-secondary" 
                        type="text" 
                        name="phone_number" 
                        value={formData.phone_number} 
                        onChange={handleChange} 
                        maxLength={10}
                        required 
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Household Size (Persons moving)*</Form.Label>
                  <Form.Control 
                    className="bg-black text-white border-secondary" 
                    type="number" 
                    name="household_size" 
                    value={formData.household_size} 
                    onChange={handleChange} 
                    min="1" 
                    required 
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>

          {/* Current Residence */}
          <Col lg={6}>
            <Card className="bg-dark text-white border-secondary h-100 shadow-sm">
              <Card.Header className="border-secondary bg-transparent py-3">
                <h5 className="mb-0 text-info font-weight-bold">Current Residence</h5>
              </Card.Header>
              <Card.Body className="p-4">
                <Alert variant="info" className="bg-info-subtle border-0 text-info-emphasis mb-4 py-2">
                  <i className="bi bi-info-circle me-2"></i>
                  Verify or update your current village records.
                </Alert>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Label className="small text-muted">Current County*</Form.Label>
                    <Form.Select className="bg-black text-white border-secondary" value={formData.current_county_id} onChange={handleCurrentCountyChange} required>
                      <option value="">Select County</option>
                      {addressHierarchy.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </Form.Select>
                  </Col>
                  <Col md={6}>
                    <Form.Label className="small text-muted">Current District*</Form.Label>
                    <Form.Select className="bg-black text-white border-secondary" value={formData.current_district_id} onChange={handleCurrentDistrictChange} disabled={!formData.current_county_id} required>
                      <option value="">Select District</option>
                      {currentDistricts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </Form.Select>
                  </Col>
                  <Col md={4}>
                    <Form.Label className="small text-muted">Current Clan*</Form.Label>
                    <Form.Select className="bg-black text-white border-secondary" value={formData.current_clan_id} onChange={handleCurrentClanChange} disabled={!formData.current_district_id} required>
                      <option value="">Select Clan</option>
                      {currentClans.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </Form.Select>
                  </Col>
                  <Col md={4}>
                    <Form.Label className="small text-muted">Current Town*</Form.Label>
                    <Form.Select className="bg-black text-white border-secondary" value={formData.current_town_id} onChange={handleCurrentTownChange} disabled={!formData.current_clan_id} required>
                      <option value="">Select Town</option>
                      {currentTowns.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </Form.Select>
                  </Col>
                  <Col md={4}>
                    <Form.Label className="small text-muted">Current Village*</Form.Label>
                    <Form.Select className="bg-black text-white border-secondary" value={formData.current_village_id} onChange={handleCurrentVillageChange} disabled={!formData.current_town_id} required>
                      <option value="">Select Village</option>
                      {currentVillages.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                    </Form.Select>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

            {/* Destination */}
            <Col lg={12}>
              <Card className="bg-dark text-white border-secondary shadow-sm">
                <Card.Header className="border-secondary bg-transparent py-3">
                  <h5 className="mb-0 text-warning font-weight-bold">Destination Location</h5>
                </Card.Header>
                <Card.Body className="p-4">
                  <Row className="g-3">
                    <Col md={4} lg>
                      <Form.Label className="small text-muted">County*</Form.Label>
                      <Form.Select className="bg-black text-white border-secondary" value={formData.county_id} onChange={handleCountyChange} required>
                        <option value="">Select County</option>
                        {addressHierarchy.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </Form.Select>
                    </Col>
                    <Col md={4} lg>
                      <Form.Label className="small text-muted">District*</Form.Label>
                      <Form.Select className="bg-black text-white border-secondary" value={formData.district_id} onChange={handleDistrictChange} disabled={!formData.county_id} required>
                        <option value="">Select District</option>
                        {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </Form.Select>
                    </Col>
                    <Col md={4} lg>
                      <Form.Label className="small text-muted">Clan*</Form.Label>
                      <Form.Select className="bg-black text-white border-secondary" value={formData.clan_id} onChange={handleClanChange} disabled={!formData.district_id} required>
                        <option value="">Select Clan</option>
                        {clans.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </Form.Select>
                    </Col>
                    <Col md={6} lg>
                      <Form.Label className="small text-muted">Town*</Form.Label>
                      <Form.Select className="bg-black text-white border-secondary" value={formData.town_id} onChange={handleTownChange} disabled={!formData.clan_id} required>
                        <option value="">Select Town</option>
                        {towns.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </Form.Select>
                    </Col>
                    <Col md={6} lg>
                      <Form.Label className="small text-muted">Village*</Form.Label>
                      <Form.Select className="bg-black text-white border-secondary" name="village_id" value={formData.village_id} onChange={handleChange} disabled={!formData.town_id} required>
                        <option value="">Select Village</option>
                        {villages.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                      </Form.Select>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            {/* Transfer Details */}
            <Col lg={12}>
              <Card className="bg-dark text-white border-secondary shadow-sm">
                <Card.Header className="border-secondary bg-transparent py-3">
                  <h5 className="mb-0 text-success font-weight-bold">Transfer Details</h5>
                </Card.Header>
                <Card.Body className="p-4">
                  <Row className="gy-4">
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Transfer Type*</Form.Label>
                        <Form.Select className="bg-black text-white border-secondary" name="transfer_type" value={formData.transfer_type} onChange={handleChange} required>
                          <option value="Marriage">Marriage</option>
                          <option value="Employment">Employment</option>
                          <option value="Education">Education</option>
                          <option value="Family relocation">Family relocation</option>
                          <option value="Business">Business</option>
                          <option value="Other">Other</option>
                        </Form.Select>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Intended Move Date*</Form.Label>
                        <Form.Control className="bg-black text-white border-secondary" type="date" name="move_date" value={formData.move_date} onChange={handleChange} required />
                      </Form.Group>
                      <Form.Group className="mb-0">
                        <Form.Label>Duration*</Form.Label>
                        <div className="d-flex gap-3 mt-1">
                          <Form.Check type="radio" label="Permanent" name="transfer_duration" value="Permanent" checked={formData.transfer_duration === "Permanent"} onChange={handleChange} />
                          <Form.Check type="radio" label="Temporary" name="transfer_duration" value="Temporary" checked={formData.transfer_duration === "Temporary"} onChange={handleChange} />
                        </div>
                      </Form.Group>
                    </Col>

                    <Col md={8}>
                      <Form.Group className="mb-3">
                        <Form.Label>Justification / Reason*</Form.Label>
                        <Form.Control 
                          as="textarea" 
                          rows={4} 
                          className="bg-black text-white border-secondary" 
                          placeholder="Provide detailed explanation for this transfer..." 
                          name="reason" 
                          value={formData.reason} 
                          onChange={handleChange} 
                          required 
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Supporting Document (Optional)</Form.Label>
                        <Form.Control type="file" className="bg-black text-white border-secondary" name="document" accept=".pdf,.jpg" onChange={handleChange} />
                        <Form.Text className="text-muted">Job letter, Marriage certificate, Admission letter, etc.</Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <hr className="border-secondary my-4" />
                  
                  {/* Optional Host Info */}
                  <h6 className="text-info mb-3">Destination Contact / Host Information: Optional</h6>
                  <Row className="g-3">
                    <Col md={4}>
                      <Form.Control className="bg-black text-white border-secondary" placeholder="Host Full Name" name="host_name" value={formData.host_name} onChange={handleChange} />
                    </Col>
                    <Col md={4}>
                      <Form.Control className="bg-black text-white border-secondary" placeholder="Host Phone Number" name="host_phone" value={formData.host_phone} onChange={handleChange} />
                    </Col>
                    <Col md={4}>
                      <Form.Control className="bg-black text-white border-secondary" placeholder="Relationship to Host" name="host_relationship" value={formData.host_relationship} onChange={handleChange} />
                    </Col>
                  </Row>
                </Card.Body>
                <Card.Footer className="bg-transparent border-secondary p-4 d-flex justify-content-end">
                  <Button variant="outline-secondary" className="me-2" type="button" onClick={() => window.history.back()}>Cancel</Button>
                  <Button variant="primary" type="submit" disabled={submitting} size="lg" className="px-5">
                    {submitting ? "Submitting..." : "Submit Transfer Request"}
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        </Form>
      </div>
    </section>
  );
};

export default TransferRequest;
