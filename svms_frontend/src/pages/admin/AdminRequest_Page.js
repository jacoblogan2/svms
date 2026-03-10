import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import RequestList from '../../components/admin_requestlist'

function Home() {

  
  return (
    <>
      <main id="main" className="main" style={{backgroundColor:'black',color:'white',height:'100vh'}}>
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
       
        <RequestList/>
      </main>
    </>
  );
}

export default Home;
