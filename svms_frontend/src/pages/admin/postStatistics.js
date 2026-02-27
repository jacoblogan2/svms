import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, ListGroup } from 'react-bootstrap';

let token=localStorage.getItem('token');
const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [statistics, setStatistics] = useState({
    totalPosts: 0,
    categoryStats: {},
    postsByUser: {},
  });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/post/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setPosts(response.data.data);
        calculateStatistics(response.data.data);
      } catch (err) {
        console.error('Error fetching posts', err);
      }
    };

    fetchPosts();
  }, []);

  const calculateStatistics = (posts) => {
    const totalPosts = posts.length;
    const categoryStats = {};
    const postsByUser = {};

    posts.forEach((post) => {
      // Calculate posts per category
      const category = post.category?.name || 'Uncategorized'; // Handle undefined category
      categoryStats[category] = categoryStats[category] ? categoryStats[category] + 1 : 1;

      // Calculate posts by user
      const user = post.user?.name || 'Unknown User'; // Handle undefined user
      postsByUser[user] = postsByUser[user] ? postsByUser[user] + 1 : 1;
    });

    setStatistics({ totalPosts, categoryStats, postsByUser });
  };

  return (
    <Container className="my-5">
      {/* Post Statistics */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title className="text-center">Post Statistics</Card.Title>
          <Row>
            <Col md={4}>
              <ListGroup>
                <ListGroup.Item><strong>Total Posts:</strong> {statistics.totalPosts}</ListGroup.Item>
                <ListGroup.Item><strong>Posts by Category:</strong></ListGroup.Item>
                {Object.entries(statistics.categoryStats).map(([category, count]) => (
                  <ListGroup.Item key={category}>{category}: {count} posts</ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
            <Col md={4}>
              <ListGroup>
                <ListGroup.Item><strong>Posts by User:</strong></ListGroup.Item>
                {Object.entries(statistics.postsByUser).map(([user, count]) => (
                  <ListGroup.Item key={user}>{user}: {count} posts</ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
          </Row>
        </Card.Body>
      </Card>


    </Container>
  );
};

export default PostsPage;