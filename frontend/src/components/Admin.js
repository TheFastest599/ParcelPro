import React, { useState, useContext } from 'react';
import globalContext from '../context/global/globalContext';
import { packageContext } from '../context/packages/packageContext';
import PackageInfoCards from './PackageInfoCards';
import MembersCards from './MembersCards';

function Admin() {
  document.title = 'ParcelPro | Admin';
  const gcontext = useContext(globalContext);
  const pContext = useContext(packageContext);
  const { notify, member, setSpinner, host } = gcontext;
  const { fetchPackages, packages } = pContext;

  const [mode, setMode] = useState('');
  const [memberDetails, setMemberDetails] = useState([]);
  // Fetcching member details
  const fetchMembers = async () => {
    setSpinner(true);
    const response = await fetch(`${host}/api/auth/getmembers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': member.token,
      },
    });
    setSpinner(false);
    const data = await response.json();
    if (response.status === 200) {
      notify('Members fetched successfully', 'success');
      setMemberDetails(data);
      // console.log(data);
    } else {
      notify(data.error, 'error');
    }
  };
  return (
    <>
      {' '}
      <div className="flex  justify-center space-x-2">
        <button
          className="py-2 px-4 max-w-64 w-full text-sm  sm:text-base font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300"
          onClick={() => {
            fetchPackages('member', 'admin');
            setMode('fetch packages');
          }}
        >
          Fetch Packages
        </button>
        <button
          className="py-2 px-4 max-w-64 w-full text-sm  sm:text-base font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300"
          onClick={() => {
            fetchMembers();
            setMode('fetch members');
          }}
        >
          Member Details{' '}
        </button>
      </div>
      {mode === 'fetch packages' && <PackageInfoCards packages={packages} />}
      {mode === 'fetch members' && (
        <MembersCards memberDetails={memberDetails} />
      )}
    </>
  );
}

export default Admin;
