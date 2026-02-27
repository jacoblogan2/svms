import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import LoadingSpinner from '../../components/loading'; // Import the LoadingSpinner component
import Image from './home.jpeg';


const PostsList = () => {

  return (
    <div className="container" style={{marginTop:'2cm'}}>
      <section id="hero" className="hero">
        <div className="container position-relative">
          <div className="row gy-5" data-aos="fade-in">
            <div className="col-lg-6 order-2 order-lg-1 d-flex flex-column justify-content-center text-center text-lg-start">
              <h2 style={{ fontSize: '45px', marginBottom: '1cm', marginTop: '-1cm', fontFamily: 'monospace' }}>
                Welcome to Inteko Yabaturage
              </h2>
              <p style={{ marginBottom: '1cm', marginTop: '0cm', fontStyle: 'bold', fontFamily: 'monospace' }}>
                click on get started to register in system ! <br/>
                or if you have account click login ! 
              </p>
              <div className="d-flex justify-content-center justify-content-lg-start">
                <a href="/signup" className="btn-get-started" style={{ backgroundColor: 'lightblue', color: 'white', borderRadius: '6px', fontFamily: 'monospace', padding: '0.2cm', marginRight: '0.2cm' }}>
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


    </div>
  );
};

export default PostsList;
