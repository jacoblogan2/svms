import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Header from './components/header';
import Aside from './components/aside'; // Changed from Sidebar to Aside
import Home from './pages/admin/home';
import Users from './pages/admin/users';
import Login from './components/login';
import SignUP from './components/Signup';
import Reset from './components/reset';
import Code from './components/code';
import ResetPassword from './components/ResetPassword';
import VerifyEmail from './components/VerifyEmail';
import OneUser from './pages/admin/oneUser'; 
import Profile from './pages/admin/profile'; 
import ProfileCitizen from './pages/admin/citizenprofile'; 
import Logout from './pages/admin/logout'; 
import AddLeader from './pages/admin/addLeaders';
import PostType from './pages/admin/PostManagement'; 
import Notification from './components/Notification_Page';
import AddCitizen from './pages/admin/addCitizen';
import PostCitizen from './pages/admin/citizenPostPages';
import Post from './pages/admin/Post'; 
import PostView from './pages/admin/PostViewPage'; 
import Statistics from './pages/admin/statisticsPage';
import Request from './pages/admin/Request_Page'
import RequestAdmin from './pages/admin/AdminRequest_Page'
// 

import AddPost from './pages/admin/AddPostPage'
import Citizens from './pages/admin/usersCitizens'
import Map from './pages/admin/map_page'
import LeaderDashboard from './pages/leaders/LeaderDashboard'; // New import
import FamilyManagement from './pages/citizen/FamilyManagement';
import ReportingModule from './pages/leaders/ReportingModule';

import './components/style.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Role labels for display
const ROLE_LABELS = {
  admin: "Admin",
  county_leader: "County Leader",
  district_leader: "District Leader",
  clan_leader: "Clan Leader",
  town_leader: "Town Leader",
  village_leader: "Village Leader",
  citizen: "Citizen",
};

// All leader roles (used in route protection)
const ALL_LEADERS = ['admin', 'county_leader', 'district_leader', 'clan_leader', 'town_leader', 'village_leader'];
const MANAGE_LEADERS = ['admin', 'county_leader', 'district_leader', 'town_leader'];

/**
 * ProtectedRoute: wraps a page component and redirects to /statistics
 * if the user's role is not in the allowedRoles list.
 */
const ProtectedRoute = ({ allowedRoles, children }) => {
  const userString = localStorage.getItem("user");
  if (!userString) return <Navigate to="/login" replace />;
  
  try {
    const user = JSON.parse(userString);
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/statistics" replace />;
    }
    return children;
  } catch {
    return <Navigate to="/login" replace />;
  }
};

const DashboardWrapper = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  return user.role === 'admin' ? <Statistics /> : <LeaderDashboard />;
};

const MainLayout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login' || location.pathname === '/reset' || location.pathname.startsWith('/code/') || location.pathname.startsWith('/resetPassword/') || location.pathname.startsWith('/verify-email');

  return (
    <div className="App">
      {!isLoginPage && <Header />}
      {!isLoginPage && <Aside />}
      <div className={`content-wrapper ${isLoginPage ? 'login-page' : ''}`}>
        <Routes>
          
          {/* Users / Leaders list — admin + leaders who can view subordinates */}
          <Route path="/users" element={
            <ProtectedRoute allowedRoles={ALL_LEADERS}>
              <Users />
            </ProtectedRoute>
          } />
          <Route path="/oneUser/:id" element={<OneUser />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profilecitizen" element={<ProfileCitizen />} />
          <Route path="/logout" element={<Logout />} />

          {/* Add users — requires create_user permission (admin + leaders) */}
          <Route path="/addusers" element={
            <ProtectedRoute allowedRoles={MANAGE_LEADERS}>
              <AddLeader />
            </ProtectedRoute>
          } />

          {/* Manage Post Types — admin only */}
          <Route path="/post_type" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <PostType />
            </ProtectedRoute>
          } />

          <Route path="/notifications" element={<Notification />} />

          {/* Broadcasts — leaders can create, everyone can view */}
          <Route path="/post" element={<Post />} />
          <Route path="/addcitizen" element={
            <ProtectedRoute allowedRoles={ALL_LEADERS}>
              <AddCitizen />
            </ProtectedRoute>
          } />
          <Route path="/citizenpost" element={<PostCitizen />} />
          <Route path="/post/:id"  element={<PostView />} />
          <Route path="/request"  element={<Request />} />
          <Route path="/request/admin"  element={
            <ProtectedRoute allowedRoles={ALL_LEADERS}>
              <RequestAdmin />
            </ProtectedRoute>
          } />
          <Route path="/addpost" element={
            <ProtectedRoute allowedRoles={ALL_LEADERS}>
              <AddPost />
            </ProtectedRoute>
          } />
          <Route 
            path="/statistics" 
            element={
              <ProtectedRoute allowedRoles={[...ALL_LEADERS, 'citizen']}>
                <DashboardWrapper />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/family" 
            element={
              <ProtectedRoute allowedRoles={['citizen', 'admin', 'village_leader']}>
                <FamilyManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reports" 
            element={
              <ProtectedRoute allowedRoles={ALL_LEADERS}>
                <ReportingModule />
              </ProtectedRoute>
            } 
          />
          <Route path="/citizens" element={
            <ProtectedRoute allowedRoles={[...ALL_LEADERS, 'clan_leader']}>
              <Citizens />
            </ProtectedRoute>
          } />

          <Route path="/map"  element={<Map/>} />
    
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <ToastContainer theme="dark" position="top-right" autoClose={3000} />
      <Routes>
        {/* Login Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/reset" element={<Reset />} />
        <Route path="/signup" element={<SignUP />} />
        <Route path="/code/:email" element={<Code />} />
        <Route path="/resetPassword/:email" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/" element={<Login />} />

        {/* Main Layout Routes */}
        <Route path="/*" element={<MainLayout />} />
      </Routes>
    </Router>
  );
}

export { ROLE_LABELS };
export default App;

