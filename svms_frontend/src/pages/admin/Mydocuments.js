import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

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

  return (
    <div className="container mt-4" style={{color:'#757272'}}>
      <h2 className="mb-4">User Documents</h2>
      <div className="row">
        {paginatedDocuments.map((doc) => (
          <div key={doc.id} className="col-md-6 mb-4">
            <div className="card shadow-sm  p-2" style={{border:"1px solid white"}}>
              <img src={doc.image} alt={doc.title} className="card-img-top" style={{ height: "200px", objectFit: "cover" }} />
              <div className="card-body">
                <h5 className="card-title">{doc.title}</h5>
                <p className="card-text">{doc.description}</p>

                <hr/>
                  <p><strong>recorded by:</strong><br/>
                  Names {doc.recorder.firstname} {doc.recorder.lastname}<br/>
                  phone {doc.recorder.phone}<br/>
                  Email {doc.recorder.email} <br/>
                  
                  </p>
            
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="d-flex justify-content-between align-items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="btn btn-primary"
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="btn btn-primary"
        >
          Next
        </button>
      </div>
   
    </div>
  );
};

export default UserDocuments;
