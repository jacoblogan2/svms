import React, { useState, useEffect } from 'react';
import { Table, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';

const API_BASE_URL = `${process.env.REACT_APP_BASE_URL}/api/v1/post/`;
let token=localStorage.getItem('token');
const AUTH_TOKEN = `Bearer ${token}`; // Replace with actual token

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({}); // Track action per post

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_BASE_URL, {
        headers: {
          accept: '*/*',
          Authorization: AUTH_TOKEN,
        },
      });
      if (response.data.success) {
        setPosts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (postId) => {
    setActionLoading(prev => ({ ...prev, [`${postId}-approve`]: true }));
    try {
      const response = await axios.put(`${API_BASE_URL}approve/${postId}`, {}, {
        headers: {
          accept: '*/*',
          Authorization: AUTH_TOKEN,
        },
      });
      if (response.status === 200) {
        alert('Post approved successfully!');
        fetchPosts();
      }
    } catch (error) {
      console.error('Error approving post:', error);
      alert('Failed to approve post.');
    } finally {
      setActionLoading(prev => ({ ...prev, [`${postId}-approve`]: false }));
    }
  };

  const handleReject = async (postId) => {
    setActionLoading(prev => ({ ...prev, [`${postId}-reject`]: true }));
    try {
      const response = await axios.put(`${API_BASE_URL}reject/${postId}`, {}, {
        headers: {
          accept: '*/*',
          Authorization: AUTH_TOKEN,
        },
      });
      if (response.status === 200) {
        alert('Post rejected successfully!');
        fetchPosts();
      }
    } catch (error) {
      console.error('Error rejecting post:', error);
      alert('Failed to reject post.');
    } finally {
      setActionLoading(prev => ({ ...prev, [`${postId}-reject`]: false }));
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    setActionLoading(prev => ({ ...prev, [`${postId}-delete`]: true }));
    try {
      const response = await axios.delete(`${API_BASE_URL}delete/${postId}`, {
        headers: {
          accept: '*/*',
          Authorization: AUTH_TOKEN,
        },
      });
      if (response.status === 200) {
        alert('Post deleted successfully!');
        setPosts(posts.filter(post => post.id !== postId));
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post.');
    } finally {
      setActionLoading(prev => ({ ...prev, [`${postId}-delete`]: false }));
    }
  };

  return (
    <div className="container member mt-4">
      <h3 className="text-center" style={{ backgroundColor: 'lightblue', padding: '0.3cm', borderRadius: '0.2cm' }}>List of Posts</h3>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Category</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>{post.id}</td>
                <td>{post.title}</td>
                <td>{post.description}</td>
                <td>{post.category.name}</td>
                <td>{post.status}</td>
                <td>{new Date(post.createdAt).toLocaleString()}</td>
                <td className="text-center">
                  <Button 
                    variant="success" 
                    size="sm" 
                    onClick={() => handleApprove(post.id)} 
                    disabled={actionLoading[`${post.id}-approve`]}
                  >
                    {actionLoading[`${post.id}-approve`] ? <Spinner size="sm" animation="border" /> : 'Approve'}
                  </Button>{' '}
                  <Button 
                    variant="warning" 
                    size="sm" 
                    onClick={() => handleReject(post.id)} 
                    disabled={actionLoading[`${post.id}-reject`]}
                  >
                    {actionLoading[`${post.id}-reject`] ? <Spinner size="sm" animation="border" /> : 'Reject'}
                  </Button>{' '}
                  <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={() => handleDelete(post.id)} 
                    disabled={actionLoading[`${post.id}-delete`]}
                  >
                    {actionLoading[`${post.id}-delete`] ? <Spinner size="sm" animation="border" /> : 'Delete'}
                  </Button>
                   <Button variant="primary" size="sm"  href={`/post/${post.id}`}>
                                    Read More
                                  </Button>
                                  <Button variant="success" size="sm"  href={`/attandance/${post.id}`}>
                                    make attandance
                                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default PostList;
