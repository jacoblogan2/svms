import React, { useState, useEffect } from "react";
import { Table, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import { FaCheck, FaTimes, FaEye } from "react-icons/fa";

const API_BASE_URL = `${process.env.REACT_APP_BASE_URL}/api/v1/post/`;
let token = localStorage.getItem("token");
const AUTH_TOKEN = `Bearer ${token}`;

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
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

  // Pagination Logic
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
          <Table striped  hover responsive className="shadow-sm mt-3 table-dark">
            <thead className="table-primary">
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Category</th>
                {/* <th>Status</th> */}
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
                  {/* <td>
                    {post.status === "approved" ? (
                      <FaCheck className="text-success" />
                    ) : (
                      <FaTimes className="text-danger" />
                    )}
                  </td> */}
                  <td>{new Date(post.createdAt).toLocaleString()}</td>
                  <td>
                    <Button variant="primary" size="sm" href={`/post/${post.id}`}>
                      <FaEye className="me-1" /> 
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Pagination */}
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
