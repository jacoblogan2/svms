import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const CategoriesPage = () => {
  const token = localStorage.getItem("token");
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // Modal state

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/categories`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "*/*",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch categories");

      const data = await response.json();
      setCategories(data.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!name) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/categories/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) throw new Error("Failed to add category");

      const data = await response.json();
      setMessage(data.message);
      setCategories([...categories, data.Category]);
      setName("");
      setShowModal(false); // Close modal after adding
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/categories/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete category");

      setCategories(categories.filter((category) => category.id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4  p-2 rounded" style={{backgroundColor:'white',color:'black'}}>
        Manage Post Categories
      </h2>

      <div className="text-end mb-3">
        <button className="btn" style={{backgroundColor:'white',color:'black'}} onClick={() => setShowModal(true)}>
          Add Post Type
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h4 className="card-title">Existing Categories</h4>

          {loading ? (
            <p className="text-primary">Loading categories...</p>
          ) : error ? (
            <p className="text-danger">{error}</p>
          ) : categories.length > 0 ? (
            <table className="table table-striped table-dark table-hover">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Created at</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <tr key={category.id}>
                    <td>{index + 1}</td>
                    <td>{category.name}</td>
                    <td>{new Date(category.createdAt).toLocaleString()}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteCategory(category.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-muted">No categories found.</p>
          )}
        </div>
      </div>

      {/* Modal for Adding Post Type */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Post Type</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <input type="text" className="form-control" style={{backgroundColor:'white',color:'black'}} placeholder="Enter post type name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleAddCategory}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
