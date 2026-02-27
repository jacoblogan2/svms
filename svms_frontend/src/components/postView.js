import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Image from './images.png'

const PostDetail = () => {
    const { id } = useParams(); // Grabbing postId from URL params
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [commentText, setCommentText] = useState("");
    const [comments, setComments] = useState([]);
    const TOKEN = localStorage.getItem("token");


    useEffect(() => {
        const fetchPostDetail = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/post/one/${id}`, {
                    method: 'GET',
                    headers: {
                        'accept': '*/*',
                        Authorization: `Bearer ${TOKEN}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch post');
                }

                const data = await response.json();
                setPost(data.data);
                setComments(data.data.comments);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPostDetail();
    }, [id]);

    const handleCommentSubmit = async (event) => {
        event.preventDefault();

        if (!commentText) {
            alert("Please enter a comment.");
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/post/comment`, {
                method: 'POST',
                headers: {
                    'accept': '*/*',
                    Authorization: `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    comment: commentText,
                    postID: id,
                }),
            });

            if (response.ok) {
                const newComment = await response.json();
                setComments((prevComments) => [newComment.data, ...prevComments]);
                window.location.reload();

            } else {
                throw new Error("Failed to add comment");
            }
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mt-4">
            <div className="card col-md-6 shadow-sm mb-4">
                <div className="card-body">
                    <br/>
                    <h3>{post.title}</h3>
                    <p>{post.description}</p>

                    {/* <p><strong>Status:</strong> {post.status}</p> */}
                    <p><strong>Category:</strong> {post.category.name}</p>
                    <p><strong>Created At:</strong> {new Date(post.createdAt).toLocaleString()}</p>
                </div>
            </div>

            <div className="card shadow-sm mb-4">
  <div className="card-body">
    <h2>Comments</h2>
    <div className="mb-3">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="media mb-3"
          style={{
            backgroundColor: "whitesmoke",
            margin: "0.3cm",
            padding: "0.2cm",
            borderRadius: "0.3cm",
          }}
        >
          <div className="row">
            <div className="col-1">
              <div
                className="d-flex align-items-center justify-content-center rounded-circle text-white"
                style={{
                  width: "50px",
                  height: "50px",
                  marginTop: "0.2cm",
                  backgroundColor: "blue",
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                }}
              >
                {comment.user?.firstname?.charAt(0).toUpperCase() || "?"}
                {comment.user?.lastname?.charAt(0).toUpperCase() || "?"}
              </div>
            </div>
            <div className="col-md-11">
              <div className="media-body">
                <h5 className="mt-0" style={{ color: "gray" }}>
                  {comment.user?.firstname} {comment.user?.lastname}
                </h5>
                <p style={{ color: "gray" }}>{comment?.comment}</p>
                <small className="text-muted">
                  Posted at {new Date(comment?.createdAt).toLocaleString()}
                </small>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>

    <h3>Add a Comment</h3>
    <form onSubmit={handleCommentSubmit}>
      <div className="form-group">
        <textarea
          className="form-control"
          rows="4"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Enter your comment"
        />
      </div>
      <br />
      <button type="submit" className="btn btn-primary">
        Submit Comment
      </button>
    </form>
  </div>
</div>

        </div>
    );
};

export default PostDetail;
