import React, { useState, useEffect } from "react";
import { Table, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import { FaCheck, FaTimes, FaTrash, FaEye } from "react-icons/fa";

const API_BASE_URL = `${process.env.REACT_APP_BASE_URL}/api/v1/post/`;
let token = localStorage.getItem("token");
const AUTH_TOKEN = `Bearer ${token}`;

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_BASE_URL, {
        headers: {
          accept: "*/*",
          Authorization: AUTH_TOKEN,
        },
      });
      if (response.data.success) {
        setPosts(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (postId, actionType, apiEndpoint, successMessage) => {
    setActionLoading((prev) => ({ ...prev, [`${postId}-${actionType}`]: true }));
    try {
      const response = await axios.put(`${API_BASE_URL}${apiEndpoint}/${postId}`, {}, {
        headers: {
          accept: "*/*",
          Authorization: AUTH_TOKEN,
        },
      });
      if (response.status === 200) {
        alert(successMessage);
        fetchPosts();
      }
    } catch (error) {
      console.error(`Error performing ${actionType} action:`, error);
      alert(`Failed to ${actionType} post.`);
    } finally {
      setActionLoading((prev) => ({ ...prev, [`${postId}-${actionType}`]: false }));
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    setActionLoading((prev) => ({ ...prev, [`${postId}-delete`]: true }));
    try {
      const response = await axios.delete(`${API_BASE_URL}delete/${postId}`, {
        headers: {
          accept: "*/*",
          Authorization: AUTH_TOKEN,
        },
      });
      if (response.status === 200) {
        alert("Post deleted successfully!");
        setPosts(posts.filter((post) => post.id !== postId));
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post.");
    } finally {
      setActionLoading((prev) => ({ ...prev, [`${postId}-delete`]: false }));
    }
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div className="container mt-4">
      <h3 className="text-center bg-light p-3 rounded">List of Posts</h3>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          <Table striped hover responsive className="table-dark">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentPosts.map((post, index) => (
                <tr key={post.id}>
                  <td>{indexOfFirstPost + index + 1}</td>
                  <td>{post.title}</td>
                  <td>{post.category.name}</td>
                  <td>
                    {post.status}
                    {post.status === "approved" ? (
                      <FaCheck className="text-success ms-2" />
                    ) : (
                      <FaTimes className="text-danger ms-2" />
                    )}
                  </td>
                  <td>{new Date(post.createdAt).toLocaleString()}</td>
                  <td>
                    <Button variant="primary" size="sm" href={`/post/${post.id}`} className="me-2">
                      <FaEye />
                    </Button>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleAction(post.id, "approve", "approve", "Post approved successfully!")}
                      disabled={actionLoading[`${post.id}-approve`]}
                      className="me-2"
                    >
                      {actionLoading[`${post.id}-approve`] ? <Spinner size="sm" animation="border" /> : <FaCheck />}
                    </Button>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => handleAction(post.id, "reject", "reject", "Post rejected successfully!")}
                      disabled={actionLoading[`${post.id}-reject`]}
                      className="me-2"
                    >
                      {actionLoading[`${post.id}-reject`] ? <Spinner size="sm" animation="border" /> : <FaTimes />}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(post.id)}
                      disabled={actionLoading[`${post.id}-delete`]}
                    >
                      {actionLoading[`${post.id}-delete`] ? <Spinner size="sm" animation="border" /> : <FaTrash />}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-center mt-4">
            <Button
              variant="outline-primary"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="me-2"
            >
              Previous
            </Button>
            <Button
              variant="outline-primary"
              onClick={() => setCurrentPage((prev) => (indexOfLastPost < posts.length ? prev + 1 : prev))}
              disabled={indexOfLastPost >= posts.length}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default PostList;