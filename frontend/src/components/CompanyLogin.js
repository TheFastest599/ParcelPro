import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import globalContext from '../context/global/globalContext';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

function CompanyLogin() {
  document.title = 'ParcelPro | Company Login';
  const gcontext = useContext(globalContext);
  const { notify, setSpinner, isMemberLoggedIn, memberLogin, host } = gcontext;
  let navigate = useNavigate();

  useEffect(() => {
    if (isMemberLoggedIn) {
      navigate('/company');
    }
    // eslint-disable-next-line
  }, [isMemberLoggedIn]);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    memberType: 'admin',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    const { email, password, memberType } = credentials;
    setSpinner(true);
    // console.log(email, password, memberType);
    const response = await fetch(`${host}/api/auth/memberlogin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        memberType,
      }),
    });
    setSpinner(false);

    const json = await response.json();
    if (json.success) {
      const data = {
        name: json.name,
        email: json.email,
        memberType: json.memberType,
        engaged: json.engaged,
        packageId: json.packageId,
        token: json.authToken,
      };
      // console.log(data);
      memberLogin(data);
      notify('Logged In Successfully', 'success');
      navigate('/company');
    } else {
      notify(json.error, 'error');
    }
  };

  const onChange = e => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex justify-center mt-5">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-lg rounded-lg pb-5 pt-2 mt-5">
          <div className="px-5 pt-4">
            <form className="mb-3 mt-4" onSubmit={handleSubmit}>
              <div className="text-3xl  sm:text-4xl mb-5 font-semibold text-center">
                Company Login
              </div>
              <div className="mb-3">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  id="email"
                  name="email"
                  value={credentials.email}
                  onChange={onChange}
                  placeholder="Enter here"
                />
              </div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative mb-3">
                <input
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="*******"
                  value={credentials.password}
                  onChange={onChange}
                />
                <span
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500" />
                  )}
                </span>
              </div>
              <div className="mb-3">
                <label
                  htmlFor="memberType"
                  className="block text-sm font-medium text-gray-700"
                >
                  Member Type
                </label>
                <select
                  name="memberType"
                  id="memberType"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={credentials.memberType}
                  onChange={onChange}
                >
                  <option value="admin">Admin</option>
                  <option value="driver">Driver</option>
                  <option value="delivery partner">Delivery Partner</option>
                </select>
              </div>
              <div className="text-right py-2">
                <p className="text-sm">
                  <Link
                    className="text-indigo-600 hover:text-indigo-500"
                    to="/company/forgot_password"
                  >
                    Forgot password?
                  </Link>
                </p>
              </div>
              <div className="flex justify-center">
                <button
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  id="loginButton"
                  type="submit"
                >
                  Login
                </button>
              </div>
            </form>
            <br />
            <div>
              <p className="text-center text-sm">
                Don't have an account? &nbsp;&nbsp; | &nbsp;&nbsp;
                <Link
                  to="/company/signup"
                  className="font-bold text-indigo-600 hover:text-indigo-500"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyLogin;
