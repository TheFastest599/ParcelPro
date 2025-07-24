import { useEffect, useState } from 'react';
import GlobalContext from './globalContext';

import { toast } from 'react-toastify';

const GlobalState = props => {
  // Alert----------------------------
  const host = process.env.REACT_APP_PARCELPRO_HOST || '';

  const isPhone = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    // Patterns to detect mobile phones
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      userAgent.toLowerCase()
    );
  };

  // ---------------------------------
  // Spinner---------------------------
  const [spinner, setSpinner] = useState(false);

  // Notification

  const notify = (message, type) => {
    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      case 'info':
        toast.info(message);
        break;
      case 'warn':
        toast.warn(message);
        break;
      default:
        toast(message);
    }
  };

  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false);
  const [isMemberLoggedIn, setisMemberLoggedIn] = useState(false);

  const [customer, setCustomer] = useState({});
  const [member, setMember] = useState({});

  useEffect(() => {
    const customer = JSON.parse(localStorage.getItem('Customer'));
    const member = JSON.parse(localStorage.getItem('Member'));
    // console.log(customer, member);
    if (customer) {
      setIsCustomerLoggedIn();
      setCustomer(customer);
    }
    if (member) {
      setisMemberLoggedIn(true);
      setMember(member);
    }
  }, []);

  const customerLogin = data => {
    localStorage.setItem('Customer', JSON.stringify(data));
    setCustomer(data);
    setIsCustomerLoggedIn(true);
    if (isMemberLoggedIn) {
      memberLogout();
    }
  };

  const memberLogin = data => {
    localStorage.setItem('Member', JSON.stringify(data));
    setMember(data);
    setisMemberLoggedIn(true);
    if (isCustomerLoggedIn) {
      customerLogout();
    }
  };

  const customerLogout = () => {
    localStorage.removeItem('Customer');
    setIsCustomerLoggedIn(false);
    setCustomer({});
  };

  const memberLogout = () => {
    localStorage.removeItem('Member');
    setisMemberLoggedIn(false);
    setMember({});
  };

  const [isSticky, setIsSticky] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = () => {
    if (window.scrollY < lastScrollY) {
      setIsSticky(true);
    } else {
      setIsSticky(false);
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
    // eslint-disable-next-line
  }, [lastScrollY]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [page, setPage] = useState('');

  useEffect(() => {
    // console.log(page);
  }, [page]);

  return (
    <GlobalContext.Provider
      value={{
        host,
        isMenuOpen,
        setIsMenuOpen,
        page,
        setPage,
        isSticky,
        customer,
        setCustomer,
        member,
        setMember,
        isPhone,
        isCustomerLoggedIn,
        isMemberLoggedIn,
        setisMemberLoggedIn,
        setIsCustomerLoggedIn,
        spinner,
        setSpinner,
        notify,
        customerLogin,
        memberLogin,
        customerLogout,
        memberLogout,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};

export default GlobalState;
