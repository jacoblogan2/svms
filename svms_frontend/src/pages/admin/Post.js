import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import VillagePosts from './villagePosts';


function Home() {
  // Retrieve user data from localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <>
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Users Page</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item">Pages</li>
              <li className="breadcrumb-item active">Posts</li>
            </ol>
          </nav>
        </div>

        {/* Conditionally render components based on role */}
        {/* {user?.role === 'admin' && <PostAdd />} */}
        {user?.role === 'village_leader' && <VillagePosts />}
       

        <ToastContainer />
      </main>
    </>
  );
}

export default Home;
