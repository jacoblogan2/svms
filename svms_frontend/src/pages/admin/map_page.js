import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import Map from './mapComponents'

function Home() {

  
  return (
    <>
      <main id="main" className="main" style={{backgroundColor:'black',color:'white'}}>
       
        
        <Map/>
        <ToastContainer />
      </main>
    </>
  );
}

export default Home;
