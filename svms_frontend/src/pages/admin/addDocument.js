import React, { useState } from "react";
import { useParams } from "react-router-dom";

const OneUser = () => {
  const { id } = useParams(); // Get user ID from URL
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  const categories = ["Education", "Health", "Business", "Technology"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title || !description || !category) {
      setMessage("All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("userID", id);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("image", file);

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/users/my/document`, {
        method: "POST",
        headers: {
         Authorization: `Bearer ${token}`
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Document added successfully!");
      } else {
        setMessage(data.message || "Something went wrong");
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto", padding: "20px", border: "1px solid white", borderRadius: "10px", boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",color:'#757272' }}>
      <h2>Upload Document</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label><strong>Title:</strong></label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: "100%", padding: "8px", margin: "5px 0" }} />

        <label><strong>Description:</strong></label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required style={{ width: "100%", padding: "8px", margin: "5px 0" }} />

        <label><strong>Category:</strong></label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} required style={{ width: "100%", padding: "8px", margin: "5px 0" }}>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <label><strong>Upload Image:</strong></label>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} required style={{ width: "100%", padding: "8px", margin: "5px 0" }} />

        <button type="submit" style={{ width: "100%", padding: "10px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", marginTop: "10px" }}>
          Upload Document
        </button>
      </form>
    </div>
  );
};

export default OneUser;
