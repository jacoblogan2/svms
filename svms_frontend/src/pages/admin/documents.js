import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const UserDocuments = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [documentsPerPage] = useState(2); // Adjust per-page count as needed
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserDocuments = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/users/${id}`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUser(data.user);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDocuments();
  }, [id]);

  const handleDelete = async (docId) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/users/documents/${docId}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete document");
      }

      setUser((prevUser) => ({
        ...prevUser,
        documents: prevUser.documents.filter(doc => doc.id !== docId)
      }));
      alert("Document deleted successfully");
    } catch (err) {
      alert("Error deleting document: " + err.message);
    }
  };

  const handleView = (doc) => {
    setSelectedDocument(doc);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDocument(null);
  };

  // **Pagination Logic**
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!user || user.documents.length === 0) return <p>No documents available</p>;

  const indexOfLastDocument = currentPage * documentsPerPage;
  const indexOfFirstDocument = indexOfLastDocument - documentsPerPage;
  const currentDocuments = user.documents.slice(indexOfFirstDocument, indexOfLastDocument);
  const totalPages = Math.ceil(user.documents.length / documentsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="member" style={{color:'#757272'}}>
      <h2>{user.firstname} {user.lastname}'s Documents</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(1, 1fr)", gap: "20px",color:'#757272' }}>
        {currentDocuments.map((doc) => (
          <div key={doc.id} style={{ border: "1px solid white", padding: "20px", borderRadius: "8px" }}>
            <img src={doc.image} alt={doc.title} style={{ width: "100%", objectFit: "cover" }} />
            <h3>{doc.title}</h3>
            <p><strong>Category:</strong> {doc.category}</p>
            <p>{doc.description}</p>
            <hr/>
            <p><strong>recorded by:</strong><br/>
            Names {doc.recorder.firstname} {doc.recorder.lastname}<br/>
            phone {doc.recorder.phone}<br/>
            Email {doc.recorder.email} <br/>
            
            </p>
            
            <button onClick={() => handleView(doc)} style={{ marginRight: "10px", backgroundColor: "#007bff", color: "#fff", padding: "5px 10px", border: "none", cursor: "pointer" }}>View</button>
            <button onClick={() => handleDelete(doc.id)} style={{ backgroundColor: "#dc3545", color: "#fff", padding: "5px 10px", border: "none", cursor: "pointer" }}>Delete</button>
          </div>
        ))}
      </div>

      {/* **Pagination Controls** */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button 
          onClick={goToPrevPage} 
          disabled={currentPage === 1} 
          style={{ marginRight: "10px", padding: "5px 10px", backgroundColor: currentPage === 1 ? "#ccc" : "#007bff", color: "#fff", border: "none", cursor: "pointer" }}>
          Previous
        </button>
        
        <span> Page {currentPage} of {totalPages} </span>
        
        <button 
          onClick={goToNextPage} 
          disabled={currentPage === totalPages} 
          style={{ marginLeft: "10px", padding: "5px 10px", backgroundColor: currentPage === totalPages ? "#ccc" : "#007bff", color: "#fff", border: "none", cursor: "pointer" }}>
          Next
        </button>
      </div>

      {isModalOpen && selectedDocument && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "8px", width: "400px" }}>
            <h2>{selectedDocument.title}</h2>
            <img src={selectedDocument.image} alt={selectedDocument.title} style={{ width: "100%", objectFit: "cover" }} />
            <a href={selectedDocument.image} download style={{ display: "block", marginTop: "10px", textAlign: "center", backgroundColor: "#28a745", color: "#fff", padding: "5px 10px", textDecoration: "none" }}>
              Download Image
            </a>
            <p><strong>Category:</strong> {selectedDocument.category}</p>
            <p><strong>Description:</strong> {selectedDocument.description}</p>
            
           
            <hr/>
            <p><strong>recorded by:</strong><br/>
            Names {selectedDocument.recorder.firstname} {selectedDocument.recorder.lastname}<br/>
            phone {selectedDocument.recorder.phone}<br/>
            Email {selectedDocument.recorder.email} <br/>
            
            </p>

            <button onClick={handleCloseModal} style={{ display: "block", marginTop: "10px", backgroundColor: "#6c757d", color: "#fff", padding: "5px 10px", border: "none", cursor: "pointer", width: "100%" }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDocuments;
