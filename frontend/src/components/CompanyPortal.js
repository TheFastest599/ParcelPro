import React, { useContext, Suspense, lazy } from 'react';
import { Package, Truck, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import globalContext from '../context/global/globalContext';
import { PackageState } from '../context/packages/packageContext';
const Admin = lazy(() => import('./Admin'));
const Driver = lazy(() => import('./Driver'));
const DeliveryAgent = lazy(() => import('./DeliveryAgent'));

function CompanyPortal() {
  const gcontext = useContext(globalContext);
  const { member, memberLogout } = gcontext;

  const navigate = useNavigate();
  return (
    <>
      <div className="container mx-auto lg:px-6 py-2 flex justify-between items-center my-2">
        <div className="space-x-2 flex flex-wrap">
          <p className="font-bold">{member.name}</p>
          <p className="px-2 bg-purple-500 rounded-lg text-white">
            {member.memberType}
          </p>
          {member.engaged && (
            <p className="px-2 bg-lime-500 rounded-lg text-white">engaged</p>
          )}
        </div>
        <div className="flex flex-row items-center justify-center space-x-2">
          <button
            type="button"
            className="py-2 px-3 sm:py-2.5 sm:px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
            onClick={() => navigate('/company/account')}
          >
            Account
          </button>

          <button
            type="button"
            className="py-2 px-3 sm:py-2.5 sm:px-5 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm "
            onClick={() => {
              memberLogout();
              navigate('/');
            }}
          >
            Logout
          </button>
        </div>
      </div>
      <PackageState>
        <Suspense fallback={<div>Loading...</div>}>
          {member.memberType === 'admin' && <Admin />}
          {member.memberType === 'driver' && <Driver />}
          {member.memberType === 'delivery partner' && <DeliveryAgent />}
        </Suspense>
      </PackageState>
    </>
  );
}

export default CompanyPortal;
