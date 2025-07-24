import React, { useContext } from 'react';
import globalContext from '../context/global/globalContext';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function CustomerAccount() {
  const gcontext = useContext(globalContext);
  const { customer, customerLogout } = gcontext;
  // console.log(customer);
  const navigate = useNavigate();
  return (
    <div className="flex mt-32 justify-center bg-gray-100 ">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <div className="text-3xl  sm:text-4xl mb-6 font-semibold text-center ">
          Account
        </div>
        <div className="mb-4">
          <div className="mb-3">
            <label
              htmlFor="accName"
              className="block text-gray-700 font-medium mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="accName"
              value={customer.name}
              readOnly
              className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="accEmail"
              className="block text-gray-700 font-medium mb-2"
            >
              Email:
            </label>
            <input
              type="email"
              id="accEmail"
              value={customer.email}
              readOnly
              className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
        </div>
        <div className="flex justify-end my-4">
          <p className="text-sm">
            <Link
              className="text-indigo-600 hover:text-indigo-500"
              to="/customer/forgot_password"
            >
              Forgot password?
            </Link>
          </p>
        </div>
        <hr className="my-4" />
        <div className="flex justify-between mt-4">
          {/* Delete account button will be added later */}
          {/* <button
            type="button"
            className="py-2 px-4 text-sm font-medium text-white bg-red-600 rounded-full hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300"
            onClick={() => {
              // Add your delete account logic here
              console.log('Delete account clicked');
              // Example: navigate('/delete_account');
            }}
          >
            Delete Account
          </button> */}
          <button
            type="button"
            className="py-2 px-4 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100"
            onClick={() => {
              customerLogout();
              navigate('/');
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomerAccount;
