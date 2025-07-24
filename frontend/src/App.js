import React, { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './App.css';
import './output.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import CustomerPortal from './components/CustomerPortal';
import CompanyPortal from './components/CompanyPortal';
import TrackingPortal from './components/TrackingPortal';
import Spinner from './components/Spinner';
import CustomerLogin from './components/CustomerLogin';
import CustomerSignUp from './components/CustomerSignUp';
import CustomerAccount from './components/CustomerAccount';
import CompanyLogin from './components/CompanyLogin';
import CompanySignUp from './components/CompanySignUp';
import CompanyAccount from './components/CompanyAccount';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Footer from './components/Footer';
import globalContext from './context/global/globalContext';
import { PackageState } from './context/packages/packageContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Main App Component
export default function App() {
  const gcontext = useContext(globalContext);
  const { isPhone } = gcontext;
  document.title = 'ParcelPro';
  return (
    <Router>
      <PageInfo />
      <Spinner />
      <ToastContainer
        position={isPhone ? 'bottom-right' : 'top-right'}
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="min-h-screen bg-gray-100 font-poppins">
        <Navbar />
        <main className="container  mx-auto px-4  ">
          <Routes>
            <Route
              path="/customer"
              element={
                <PackageState>
                  <CustomerPortal />
                </PackageState>
              }
            />
            <Route path="/company" element={<CompanyPortal />} />
            <Route
              path="/track/:trackID"
              element={
                <PackageState>
                  <TrackingPortal />
                </PackageState>
              }
            />
            <Route
              path="/track"
              element={
                <PackageState>
                  <TrackingPortal />
                </PackageState>
              }
            />
            <Route path="/" element={<Home />} />
            <Route path="/customer/login" element={<CustomerLogin />} />
            <Route path="/customer/signup" element={<CustomerSignUp />} />
            <Route path="/customer/account" element={<CustomerAccount />} />
            <Route
              path="/customer/forgot_password"
              element={<ForgotPassword type={'Customer'} />}
            />
            <Route
              path="/customer/reset_password/:token"
              element={<ResetPassword type={'Customer'} />}
            />
            <Route path="/company/login" element={<CompanyLogin />} />
            <Route path="/company/signup" element={<CompanySignUp />} />
            <Route path="/company/account" element={<CompanyAccount />} />
            <Route
              path="/company/forgot_password"
              element={<ForgotPassword type={'Company'} />}
            />
            <Route
              path="/company/reset_password/:token"
              element={<ResetPassword type={'Company'} />}
            />
          </Routes>
        </main>
      </div>
      <Footer />
    </Router>
  );
}

const PageInfo = () => {
  const gcontext = useContext(globalContext);
  const { setPage } = gcontext;
  const location = useLocation();

  useEffect(() => {
    // Set the page state based on the current path
    const path = location.pathname;
    if (path === '/') {
      setPage('home');
    } else if (path.startsWith('/customer')) {
      setPage('customer');
    } else if (path.startsWith('/company')) {
      setPage('company');
    } else if (path.startsWith('/track')) {
      setPage('track');
    } else {
      setPage('other');
    }
    // eslint-disable-next-line
  }, [location]);
};

// Home Component

// Customer Portal Component

// Admin Portal Component

// Tracking Portal Component
