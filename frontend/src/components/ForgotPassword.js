import React, { useContext, useState } from 'react';
import globalContext from '../context/global/globalContext';

function ForgotPassword({ type }) {
  document.title = `ParcelPro | ${type} Sign Up`;
  const gcontext = useContext(globalContext);
  const { notify, setSpinner, host } = gcontext;

  const [credentials, setCredentials] = useState({
    email: '',
  });

  const [check, setCheck] = useState({
    email: false,
  });

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleSubmit = async e => {
    const { email } = credentials;
    e.preventDefault();
    setSpinner(true);
    // console.log(email);
    let temp;
    if (type === 'Customer') {
      temp = 'userforgotpassword';
    } else if (type === 'Company') {
      temp = 'memberforgotpassword';
    }
    const response = await fetch(`${host}/api/auth/${temp}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
      }),
    });
    setSpinner(false);

    const json = await response.json();
    if (response.status === 200) {
      // console.log(json);
      notify(json.message, 'success');
    } else {
      notify(json.error, 'error');
    }
  };

  const onChange = e => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex justify-center mt-16">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-lg rounded-lg">
          <div className="p-5">
            <form className="mb-3" onSubmit={handleSubmit}>
              <div className="text-3xl sm:text-4xl mb-5 font-semibold text-center">
                Forgot Password
              </div>
              <div className="mb-3">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <input
                  type="email"
                  className={`mt-1 block w-full px-3 py-2 border ${
                    check.email ? 'border-green-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  name="email"
                  id="email"
                  onChange={e => {
                    onChange(e);
                    if (emailRegex.test(e.target.value)) {
                      setCheck({ ...check, email: true });
                    } else {
                      setCheck({ ...check, email: false });
                    }
                  }}
                  placeholder="name@example.com"
                />
              </div>
              <div className="flex justify-center pt-4">
                <button
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  id="signupBtn"
                  type="submit"
                  disabled={check.email ? false : true}
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

export default ForgotPassword;
