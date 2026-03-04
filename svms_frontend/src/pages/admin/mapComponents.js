import { useState, useEffect } from "react";
const UserDocuments = () => {
    const [data, setData] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 2;
    const token = localStorage.getItem("token");
  
    useEffect(() => {
      const fetchDocuments = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/users/my/document`, {
            method: "GET",
            headers: {
              "Accept": "*/*",
              Authorization: `Bearer ${token}`,
            },
          });
          const result = await response.json();
          setData(result.data[0]);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchDocuments();
    }, []);
  
    if (!data) return <p>Loading...</p>;
  
    const { documents, county, district, clan, town, village } = data;
    const totalPages = Math.ceil(documents.length / itemsPerPage);
    const paginatedDocuments = documents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  
    // Create Google Maps search URL safely with optional chaining
    const locationParts = [
      village?.name,
      town?.name,
      clan?.name,
      district?.name,
      county?.name,
      "Liberia"
    ].filter(Boolean); // removes undefined/null/empty strings
    
    const locationQuery = locationParts.join(", ");
    const googleMapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(locationQuery)}`;
  
    return (
      <div className="container mt-4" style={{ color: "#757272" }}>
      
  
    
  
        {/* Address Information */}
        <div className="card mt-4 shadow-sm">
          <div className="card-body">
            <h4 className="card-title">Address</h4>
            <p><strong>County:</strong> {county?.name || "N/A"}</p>
            <p><strong>District:</strong> {district?.name || "N/A"}</p>
            <p><strong>Clan:</strong> {clan?.name || "N/A"}</p>
            <p><strong>Town:</strong> {town?.name || "N/A"}</p>
            <p><strong>Village:</strong> {village?.name || "N/A"}</p>
          </div>
        </div>
  
        {/* Google Maps (No API Key Required) */}
        <div className="mt-4">
          <h4>Location on Map</h4>
          <iframe
            title="Google Maps"
            width="100%"
            height="400"
            frameBorder="0"
            style={{ border: 0 }}
            src={`https://www.google.com/maps?q=${encodeURIComponent(locationQuery)}&output=embed`}
            allowFullScreen
          ></iframe>
        </div>
  
        {/* Open Google Maps in a new tab */}
        <div className="mt-3">
          <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-success">
            Open in Google Maps
          </a>
        </div>
      </div>
    );
  };
  
  export default UserDocuments;
  