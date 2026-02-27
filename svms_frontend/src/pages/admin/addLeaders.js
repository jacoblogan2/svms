import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { useNavigate } from 'react-router-dom';
import Leaders from '../../components/addUser';

function Home() {
  return (
    <>
      <main id="main" className="main"  style={{backgroundColor:'black',color:'white'}}>
        <div className="pagetitle">
          <h1>Users Page</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item">Pages</li>
              <li className="breadcrumb-item active">users</li>
            </ol>
          </nav>
        </div>
        <Leaders/>
        <ToastContainer />
      </main>
    </>
  );
}

export default Home;
