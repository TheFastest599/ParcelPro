import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import globalContext from '../context/global/globalContext';
import { Eye, EyeOff } from 'lucide-react';

function ResetPassword({ type }) {
  document.title = `ParcelPro | ${type} Sign Up`;
  const { token } = useParams();
  // console.log(token);
  const gcontext = useContext(globalContext);
  const { notify, setSpinner, isMemberLoggedIn, host } = gcontext;

  let navigate = useNavigate();

  useEffect(() => {
    if (isMemberLoggedIn) {
      navigate('/company');
    }
    // eslint-disable-next-line
  }, [isMemberLoggedIn]);

  const [credentials, setCredentials] = useState({
    password: '',
    cpassword: '',
  });

  const [check, setCheck] = useState({
    password: false,
    cpassword: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  useEffect(() => {
    if (credentials.password !== credentials.cpassword) {
      setCheck(prevCheck => ({ ...prevCheck, cpassword: false }));
    }
  }, [credentials.password, credentials.cpassword]);

  const [passInfo, setPassInfo] = useState(false);

  const passRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={};':"\\|,.<>?])[A-Za-z\d!@#$%^&*()_+\-={};':"\\|,.<>?]{6,}$/;

  const handleSubmit = async e => {
    const { password } = credentials;
    e.preventDefault();
    setSpinner(true);
    // console.log(password);
    let temp;
    if (type === 'Customer') {
      temp = 'userresetpassword';
    } else if (type === 'Company') {
      temp = 'memberresetpassword';
    }
    const response = await fetch(`${host}/api/auth/${temp}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password,
        token,
      }),
    });
    setSpinner(false);

    const json = await response.json();
    if (response.status === 200) {
      // console.log(json);
      notify(json.message, 'success');
      navigate(`/${type.toLowerCase()}/login`);
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

  const toggleCPasswordVisibility = () => {
    setShowCPassword(!showCPassword);
  };

  return (
    <div className="flex justify-center mt-16">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-lg rounded-lg">
          <div className="p-5">
            <form className="mb-3" onSubmit={handleSubmit}>
              <div className="text-3xl sm:text-4xl mb-5 font-semibold text-center">
                Reset Password
              </div>
              <div className="mb-3">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative mb-3">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`mt-1 block w-full px-3 py-2 border ${
                      check.password ? 'border-green-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    name="password"
                    id="password"
                    onFocus={() => {
                      setPassInfo(true);
                    }}
                    onChange={e => {
                      onChange(e);
                      if (passRegex.test(e.target.value)) {
                        setCheck({ ...check, password: true });
                      } else {
                        setCheck({ ...check, password: false });
                      }
                    }}
                    placeholder="*******"
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
              </div>
              <div
                id="criteria"
                className="text-sm"
                style={
                  check.password
                    ? { display: 'none' }
                    : { display: 'block', color: 'red' }
                }
              >
                <ul>
                  {passInfo && (
                    <li id="passInfo">
                      Use a combination of at least 1 uppercase, 1 lowercase, 1
                      symbol, numbers, and a minimum length of 6.
                    </li>
                  )}
                </ul>
              </div>
              <div className="mb-3">
                <label
                  htmlFor="cpassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <div className="relative mb-3">
                  <input
                    type={showCPassword ? 'text' : 'password'}
                    className={`mt-1 block w-full px-3 py-2 border ${
                      check.cpassword ? 'border-green-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    name="cpassword"
                    id="cpassword"
                    readOnly={check.password ? false : true}
                    onChange={e => {
                      onChange(e);
                      if (e.target.value === credentials.password) {
                        setCheck({ ...check, cpassword: true });
                      } else {
                        setCheck({ ...check, cpassword: false });
                      }
                    }}
                    placeholder="*******"
                  />
                  <span
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={toggleCPasswordVisibility}
                  >
                    {showCPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-500" />
                    )}
                  </span>
                </div>
              </div>
              <div className="flex justify-center pt-4">
                <button
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  id="signupBtn"
                  type="submit"
                  disabled={check.password && check.cpassword ? false : true}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
