import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import * as valUtils from "../utils/validation";

const AddPost = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "News",
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "title":
        if (!value.trim()) error = "Title is required.";
        else if (value.length < 5) error = "Title must be at least 5 characters.";
        break;
      case "content":
        if (!value.trim()) error = "Content is required.";
        else if (value.length < 10) error = "Content must be at least 10 characters.";
        break;
      default:
        break;
    }
    return error;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, image: files[0] });
    } else {
      let sanitizedValue = value;
      if (name === "title" || name === "content") {
        sanitizedValue = valUtils.sanitize(value);
      }
      setFormData({ ...formData, [name]: sanitizedValue });
      
      if (touched[name]) {
        setErrors({ ...errors, [name]: validateField(name, sanitizedValue) });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (key !== "image" && key !== "category") {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
      setMessage("Please correct the errors.");
      return;
    }

    const postData = new FormData();
    postData.append("title", formData.title);
    postData.append("content", formData.content);
    postData.append("category", formData.category);
    if (formData.image) {
      postData.append("image", formData.image);
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/posts/addPost`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: postData,
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Post added successfully!");
        setMessage("Post added successfully!");
        setFormData({ title: "", content: "", category: "News", image: null });
        setErrors({});
        setTouched({});
      } else {
        setMessage(data.message || "Failed to add post.");
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
    <div className="container mt-5">
      <ToastContainer />
      <div className="card shadow-lg p-4 bg-dark text-white">
        <h2 className="text-center mb-4">Add New Post</h2>
        {message && (
          <div className={`alert ${message.includes("successfully") ? "alert-success" : "alert-danger"}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Post Title*</label>
            <input
              type="text"
              name="title"
              className={`form-control bg-dark text-white ${getValidationClass("title")}`}
              placeholder="Enter post title"
              onChange={handleChange}
              onBlur={handleBlur}
              value={formData.title}
              required
            />
            {touched.title && errors.title && <div className="invalid-feedback">{errors.title}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Category</label>
            <select
              name="category"
              className="form-control bg-dark text-white"
              onChange={handleChange}
              value={formData.category}
            >
              <option value="News">News</option>
              <option value="Event">Event</option>
              <option value="Announcement">Announcement</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Content*</label>
            <textarea
              name="content"
              className={`form-control bg-dark text-white ${getValidationClass("content")}`}
              rows="5"
              placeholder="Write your post content here..."
              onChange={handleChange}
              onBlur={handleBlur}
              value={formData.content}
              required
            ></textarea>
            {touched.content && errors.content && <div className="invalid-feedback">{errors.content}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Upload Image</label>
            <input
              type="file"
              name="image"
              className="form-control bg-dark text-white"
              accept="image/*"
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn w-100" style={{ backgroundColor: "white", color: "black", fontWeight: "bold" }}>
            Add Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPost;
