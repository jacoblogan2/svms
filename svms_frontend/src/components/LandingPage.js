import React, { useEffect, useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import LoadingSpinner from './loading'; // Import the LoadingSpinner component
import Image from './home.jpeg';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const PostsList = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [addressHierarchy, setAddressHierarchy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  const [selectedCell, setSelectedCell] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;

  // For Modal
  const [showModal, setShowModal] = useState(false);
  const [postDetails, setPostDetails] = useState(null);
  const [comments, setComments] = useState([]);

  const [newComment, setNewComment] = useState("");
  const [newName, setNewName] = useState("");
  const [newAddress, setNewAddress] = useState("");



  const [currentPostId, setCurrentPostId] = useState(null);

  // Fetch posts
  const fetchPosts = () => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/post/`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setPosts(data.data);
        } else {
          console.error("Unexpected response format:", data);
        }
      })
      .catch((error) => console.error("Error fetching posts:", error))
      .finally(() => setLoading(false));
  };

  useEffect(fetchPosts, []);

  // Fetch address hierarchy only once
  useEffect(() => {
    fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/address`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setAddressHierarchy(data.data);
        } else {
          console.error("Unexpected response format:", data);
        }
      })
      .catch((error) => console.error("Error fetching addresses:", error));
  }, []);

  // Fetch post details and comments
  useEffect(() => {
    if (currentPostId) {
      fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/post/one/${currentPostId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setPostDetails(data.data);
            setComments(data.data.comments); // assuming comments are in data.data.comments
          } else {
            console.error("Error fetching post details:", data);
          }
        })
        .catch((error) => console.error("Error fetching post details:", error));
    }
  }, [currentPostId]);

  // Handle filters without resetting on reload
  useEffect(() => {
    let filtered = posts;
    if (selectedProvince) filtered = filtered.filter((post) => post.province_id === Number(selectedProvince));
    if (selectedDistrict) filtered = filtered.filter((post) => post.district_id === Number(selectedDistrict));
    if (selectedSector) filtered = filtered.filter((post) => post.sector_id === Number(selectedSector));
    if (selectedCell) filtered = filtered.filter((post) => post.cell_id === Number(selectedCell));
    if (selectedVillage) filtered = filtered.filter((post) => post.village_id === Number(selectedVillage));

    setFilteredPosts(filtered);
    setCurrentPage(1);
  }, [selectedProvince, selectedDistrict, selectedSector, selectedCell, selectedVillage, posts]);

  // Pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Add Comment
  const handleAddComment = () => {
    if (newComment.trim()) {
      fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/post/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          postID: currentPostId,
          comment: newComment,
          name: newName,
          address: newAddress,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setComments([...comments, data.comment]); // assuming the comment is returned
            setNewComment("");
            setNewName("");
            setNewAddress("");
          } else {
            console.error("Error adding comment:", data);
          }
        })
        .catch((error) => console.error("Error adding comment:", error));
    }
  };

  return (
    <div className="container mt-4">
      <section id="hero" className="hero">
        <div className="container position-relative">
          <div className="row gy-5" data-aos="fade-in">
            <div className="col-lg-6 order-2 order-lg-1 d-flex flex-column justify-content-center text-center text-lg-start">
              <h2 style={{ fontSize: '45px', marginBottom: '1cm', marginTop: '-1cm', fontFamily: 'monospace' }}>
                Welcome to Inteko Yabaturage
              </h2>
              <p style={{ marginBottom: '1cm', marginTop: '0cm', fontStyle: 'bold', fontFamily: 'monospace' }}>
                You can add your idea in the comment section! <br />
                Just click on post and write your idea!
              </p>
              <div className="d-flex justify-content-center justify-content-lg-start">
                <a href="" className="btn-get-started" style={{ backgroundColor: 'lightblue', color: 'white', borderRadius: '6px', fontFamily: 'monospace' }}>
                  Get Started
                </a>
                <a
                  href="/login"
                  className="glightbox btn-watch-video d-flex align-items-center"
                  style={{ backgroundColor: 'whitesmoke', border: '1px solid lightblue', borderRadius: '6px', width: '3.5cm', textAlign: 'center', fontFamily: 'monospace' }}
                >
                  &nbsp;  &nbsp; login
                </a>
              </div>
            </div>
            <div className="col-lg-6 order-1 order-lg-2">
              <img src={Image} className="img-fluid" alt="" data-aos="zoom-out" data-aos-delay="100" style={{ borderRadius: '0.3cm' }} />
            </div>
          </div>
        </div>
      </section>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📌 Posts</h2>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          🔄 Reload
        </button>
      </div>

      <div className="row mb-3">
        {[
          { label: "Province", value: selectedProvince, setter: setSelectedProvince, options: addressHierarchy },
          { label: "District", value: selectedDistrict, setter: setSelectedDistrict, options: selectedProvince ? addressHierarchy.find(p => p.id === Number(selectedProvince))?.districts || [] : [] },
          { label: "Sector", value: selectedSector, setter: setSelectedSector, options: selectedDistrict ? addressHierarchy.find(p => p.id === Number(selectedProvince))?.districts.find(d => d.id === Number(selectedDistrict))?.sectors || [] : [] },
          { label: "Cell", value: selectedCell, setter: setSelectedCell, options: selectedSector ? addressHierarchy.find(p => p.id === Number(selectedProvince))?.districts.find(d => d.id === Number(selectedDistrict))?.sectors.find(s => s.id === Number(selectedSector))?.cells || [] : [] },
          { label: "Village", value: selectedVillage, setter: setSelectedVillage, options: selectedCell ? addressHierarchy.find(p => p.id === Number(selectedProvince))?.districts.find(d => d.id === Number(selectedDistrict))?.sectors.find(s => s.id === Number(selectedSector))?.cells.find(c => c.id === Number(selectedCell))?.villages || [] : [] }
        ].map(({ label, value, setter, options }, index) => (
          <div className="col-md-2" key={index}>
            <select className="form-control" value={value} onChange={(e) => setter(e.target.value)} disabled={!options.length}>
              <option value="">{`Select ${label}`}</option>
              {options.map(option => <option key={option.id} value={option.id}>{option.name}</option>)}
            </select>
          </div>
        ))}
      </div>



      {/* Posts Display */}
      {loading ? (
        <p className="text-center text-muted" style={{ padding: '2cm' }}>loading.....</p>
      ) : currentPosts.length > 0 ? (
        <div className="row">
          {currentPosts.map((post) => (
            <div key={post.id} className="col-md-4">
              <div className="card border-primary shadow-sm mb-4" onClick={() => { setCurrentPostId(post.id); setShowModal(true); }}>
                <div className="card-body">
                  <h5 className="card-title text-primary">{post.title}</h5>
                  <p className="card-text">{post.description}</p>
                  <small className="text-muted">📅 {new Date(post.createdAt).toLocaleString()}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted">No posts available 📭</p>
      )}

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-4">
        <nav>
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
            </li>
            {[...Array(totalPages)].map((_, i) => (
              <li className={`page-item ${i + 1 === currentPage ? 'active' : ''}`} key={i}>
                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{postDetails?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>{postDetails?.description}</h5>
          <hr />
          <h6>Comments</h6>
          {comments.length > 0 ? (
            <p>
              {comments.map((comment, index) => (
                <p style={{ padding: '20px', backgroundColor: 'whitesmoke' }}
                  key={index}>comment:{comment.address} <br /> name:({comment.comment}) from {comment.name}

                </p>
              ))}
            </p>
          ) : (
            <p>No comments yet</p>
          )}
          <hr />
          <div className="mb-3">
            <div className="d-flex gap-2">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Your Name"
                className="form-control"
              />
              <input
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="Your Address"
                className="form-control"
              />
            </div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="form-control my-2"
              rows="2"
            />
            <button onClick={handleAddComment} className="btn btn-primary w-100">Submit</button>
          </div>


        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PostsList;
