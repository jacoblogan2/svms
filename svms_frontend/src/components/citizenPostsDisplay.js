import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Pagination } from 'react-bootstrap';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [postsPerPage] = useState(2); // Adjust as needed
  const [filterText, setFilterText] = useState('');
  let token = localStorage.getItem('token');
  useEffect(() => {
    // Fetch the posts from the API
    const fetchPosts = async () => {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/post/`, {
        method: 'GET',
        headers: {
          'Accept': '*/*',
         'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setPosts(data.data);
        setFilteredPosts(data.data);
      }
    };

    fetchPosts();
  }, []);

  // Pagination Logic
  const indexOfLastPost = page * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Filter Logic
  const handleFilterChange = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterText(value);
    const filtered = posts.filter(post =>
      post.title.toLowerCase().includes(value) || post.description.toLowerCase().includes(value)
    );
    setFilteredPosts(filtered);
  };

  // Pagination Handlers
  const paginate = (pageNumber) => setPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredPosts.length / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <Container>
      <h1 className="my-4">Posts</h1>

      {/* Filter */}
      <Form.Control
        type="text"
        placeholder="Filter posts..."
        value={filterText}
        onChange={handleFilterChange}
        className="mb-4"
      />

      {/* Post List */}
      <Row>
        {currentPosts.map((post) => (
          <Col key={post.id} sm={12} md={6} lg={4}>
            <Card className="mb-4">
              {/* <Card.Img variant="top" src={post.image} /> */}
              <Card.Body>
                <Card.Title>{post.title}</Card.Title>
                <Card.Text>{post.description}</Card.Text>
                <p><strong>Created At:</strong> {new Date(post.createdAt).toLocaleString()}</p>
                <Button variant="primary" href={`/post/${post.id}`}>
                  Read More
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Pagination */}
      <Pagination className="justify-content-center">
        {pageNumbers.map(number => (
          <Pagination.Item
            key={number}
            active={number === page}
            onClick={() => paginate(number)}
          >
            {number}
          </Pagination.Item>
        ))}
      </Pagination>
    </Container>
  );
};

export default PostList;
