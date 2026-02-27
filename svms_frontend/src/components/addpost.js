import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spinner } from "react-bootstrap";

const AddPostForm = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    categoryID: "",
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/api/v1/categories/`,
          {
            method: "GET",
            headers: {
              Accept: "*/*",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (data.success) {
          setCategories(data.data);
        }
      } catch (error) {
        toast.error("Error fetching categories");
      }
      setLoading(false);
    };

    fetchCategories();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { categoryID, title, description } = formData;

    if (!categoryID || !title || !description) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/v1/post/add`,
        {
          method: "POST",
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      if (result.success) {
        toast.success("Post added successfully!");
        setFormData({ categoryID: "", title: "", description: "" });
      } else {
        toast.error("Failed to add post. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="container mt-5" >
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="col-md-8 mx-auto p-4 border rounded shadow-sm">
        <h3 className="text-center text-light">Add new broadcast Post</h3>

        {loading && (
          <div className="text-center my-3">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="categoryID" className="form-label text-light">
              Post type
            </label>
            <select
              id="categoryID"
              name="categoryID"
              className="form-control"
              value={formData.categoryID}
              onChange={handleInputChange}
              required
            >
              <option value="">Select broadcast type</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="title" className="form-label text-light">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label text-light">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              rows="4"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <button type="submit" className="btn  w-100" disabled={loading} style={{backgroundColor:'white',color:'black'}}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPostForm;
