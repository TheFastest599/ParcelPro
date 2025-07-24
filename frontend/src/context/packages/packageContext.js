import { createContext, useContext, useState } from 'react';
import globalContext from '../global/globalContext';
import { useNavigate } from 'react-router-dom';

const packageContext = createContext();

const PackageState = ({ children }) => {
  const gcontext = useContext(globalContext);
  const {
    host,
    notify,
    setSpinner,
    // isCustomerLoggedIn,
    // setCustomer,
    customer,
    member,
    setMember,
  } = gcontext;

  let navigate = useNavigate();

  const [packages, setPackages] = useState([]);
  const [packageDetails, setPackageDetails] = useState();
  const [trackpage, setTrackPage] = useState(false);
  // Add package to the database
  const addPackage = async data => {
    setSpinner(true);
    const response = await fetch(`${host}/api/packages/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': customer.token,
      },
      body: JSON.stringify(data),
    });
    setSpinner(false);
    // const json = await response.json();
    // console.log(json);
    if (response.status === 200) {
      notify('Package added successfully', 'success');
    } else {
      notify('Error adding package', 'error');
    }
  };

  // fetch all packages from the database
  const fetchPackages = async (type = 'customer', value = 'customer') => {
    setSpinner(true);
    let token;
    if (type === 'customer') {
      token = customer.token;
    } else if (type === 'member') {
      token = member.token;
    }
    const response = await fetch(`${host}/api/packages/all`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': token,
      },
      body: JSON.stringify({ value: value }),
    });
    setSpinner(false);
    const json = await response.json();
    // console.log(json);
    setPackages(json);
    if (response.status === 200) {
      if (json.length === 0) {
        notify('No packages found', 'info');
      } else {
        notify('Packages fetched successfully', 'success');
      }
    } else {
      notify('Error fetching packages', 'error');
    }
  };

  // get the package assigned to a member - driver/delivery agent
  const getPackage = async packageId => {
    setSpinner(true);
    setPackageDetails({});
    const response = await fetch(`${host}/api/packages/get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': member.token,
      },
      body: JSON.stringify({
        packageId: packageId,
        memberType: member.memberType,
      }),
    });
    setSpinner(false);
    const json = await response.json();
    if (response.status === 200) {
      setPackageDetails(json.package);
      // console.log(json.package);
      notify(json.message, 'success');
    } else if (response.status === 403) {
      notify(json.message, 'warn');
    } else {
      notify('Error fetching package', 'error');
    }
  };

  // Asign job to a member and add it to the database
  const addJob = async packageId => {
    setSpinner(true);
    const response = await fetch(`${host}/api/packages/addjob`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': member.token,
      },
      body: JSON.stringify({
        memberType: member.memberType,
        packageId: packageId,
      }),
    });
    setSpinner(false);
    const json = await response.json();
    if (response.status === 200) {
      // console.log(json);
      member.engaged = json.member.engaged;
      member.packageId = json.member.packageId;
      setMember(member);
      localStorage.setItem('Member', JSON.stringify(member));
      notify(json.message, 'success');
      navigate('/company');
    } else if (response.status === 403) {
      notify(json.message, 'warn');
    } else {
      notify('Error adding job', 'error');
    }
  };

  // Update the assigned job to a member
  const updateJob = async data => {
    setSpinner(true);
    const response = await fetch(`${host}/api/packages/updatejob`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': member.token,
      },
      body: JSON.stringify({
        memberType: member.memberType,
        packageId: member.packageId,
        data: data,
      }),
    });
    setSpinner(false);
    const json = await response.json();
    if (response.status === 200) {
      setPackageDetails(json.package);
      // console.log(json);
      notify(json.message, 'success');
      if (json.driverReleived) {
        member.engaged = json.member.engaged;
        delete member.packageId;
        setMember(mem => ({ ...member }));
        localStorage.setItem('Member', JSON.stringify(member));
        notify(`${member.memberType} releived from job`, 'info');
      }
    } else if (response.status === 403) {
      notify(json.message, 'warn');
    } else {
      notify('Error fetching package', 'error');
    }
  };

  const track = async trackID => {
    setSpinner(true);
    setPackageDetails({});
    const response = await fetch(`${host}/api/packages/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ trackID: trackID }),
    });
    setSpinner(false);
    const json = await response.json();
    if (response.status === 200) {
      setPackageDetails(json.package);
      setTrackPage(true);
      // console.log(json);
      notify(json.message, 'success');
    } else {
      setTrackPage(false);
      notify(json.message, 'error');
    }
  };

  // Copy tracking link to clipboard
  const copyTrackingLinkToClipboard = async trackID => {
    const hostAddress = window.location.host;
    const trackingLink = `${
      hostAddress.startsWith('localhost') ? 'http://' : 'https://'
    }${hostAddress}/track/${trackID}`;

    try {
      await navigator.clipboard.writeText(trackingLink);
      notify('Tracking link copied to clipboard', 'success');
    } catch (err) {
      // console.error('Failed to copy: ', err);
    }
  };

  return (
    <packageContext.Provider
      value={{
        addPackage,
        fetchPackages,
        packages,
        setPackages,
        addJob,
        updateJob,
        getPackage,
        track,
        trackpage,
        packageDetails,
        copyTrackingLinkToClipboard,
      }}
    >
      {children}
    </packageContext.Provider>
  );
};

export { PackageState, packageContext };
