import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [status, setStatus] = useState("verifying"); // verifying, success, error

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get("token");

      if (!token) {
        toast.error("Verification token is missing.");
        setStatus("error");
        setVerifying(false);
        return;
      }

      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/api/v1/users/verify-email?token=${token}`
        );
        const data = await response.json();

        if (response.ok) {
          toast.success("Email verified successfully! Redirecting to login...");
          setStatus("success");
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } else {
          toast.error(data.message || "Verification failed.");
          setStatus("error");
        }
      } catch (error) {
        toast.error("An error occurred during verification.");
        setStatus("error");
      } finally {
        setVerifying(false);
      }
    };

    verifyToken();
  }, [searchParams, navigate]);

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-black">
      <div className="bg-dark p-5 rounded shadow-lg text-white text-center" style={{ maxWidth: "500px" }}>
        <h2 className="h3 mb-4">Smart Village Management System</h2>
        
        {verifying ? (
          <div>
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="h5">Verifying your email...</p>
          </div>
        ) : status === "success" ? (
          <div>
            <div className="text-success mb-3" style={{ fontSize: "3rem" }}>
              <i className="bi bi-check-circle-fill"></i>
            </div>
            <p className="h5 text-success">Email Verified!</p>
            <p className="mt-3">You can now sign in to your account.</p>
            <button 
              className="btn btn-primary mt-4 w-100" 
              onClick={() => navigate("/login")}
            >
              Go to Login
            </button>
          </div>
        ) : (
          <div>
            <div className="text-danger mb-3" style={{ fontSize: "3rem" }}>
              <i className="bi bi-x-circle-fill"></i>
            </div>
            <p className="h5 text-danger">Verification Failed</p>
            <p className="mt-3 text-muted">The link may be invalid or expired.</p>
            <button 
              className="btn btn-outline-light mt-4 w-100" 
              onClick={() => navigate("/login")}
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
