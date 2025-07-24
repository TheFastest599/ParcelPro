import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import globalContext from '../context/global/globalContext';
import { packageContext } from '../context/packages/packageContext';
import PackageModal from './PackageModal';
import StatusBadge from './StatusBadge';
import { Save } from 'lucide-react';
import PackageInfoCards from './PackageInfoCards';

function Driver() {
  document.title = 'ParcelPro | Driver';
  const navigate = useNavigate();
  const gcontext = useContext(globalContext);
  const pContext = useContext(packageContext);
  const { member, notify } = gcontext;
  const {
    fetchPackages,
    packages,
    addJob,
    updateJob,
    getPackage,
    packageDetails,
  } = pContext;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const [mode, setMode] = useState('');

  const openModal = pkg => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPackage(null);
  };

  const initialFormState = {
    location: '',
    description: '',
    reachedDest: false,
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    // console.log(formData);
    let valiadte = formData.location && formData.description;
    if (formData.reachedDest) {
      if (formData.location !== packageDetails.receiver.cityVil) {
        valiadte = false;
        notify(
          "Given location and receiver city/village  doesn't match, cannot be destination",
          'warn'
        );
      }
    }
    if (valiadte) {
      updateJob(formData);
    }
  };

  return (
    <>
      <div className="flex  justify-center space-x-2">
        <button
          className={`py-2 px-4 max-w-96 w-full text-sm  sm:text-base font-semibold text-white rounded-full focus:outline-none focus:ring-4 ${
            !member.engaged
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-300'
          }`}
          disabled={member.engaged !== true}
          onClick={() => {
            getPackage(member.packageId);
            setMode('update package');
            navigate('/company');
          }}
        >
          Update Package
        </button>
        <button
          className={`py-2 px-4 max-w-64 w-full text-sm  sm:text-base font-semibold text-white rounded-full focus:outline-none focus:ring-4 ${
            member.engaged
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-300'
          }`}
          disabled={member.engaged === true}
          onClick={() => {
            setMode('fetch packages');
            fetchPackages('member', 'driver');
          }}
        >
          Fetch Packages
        </button>
      </div>
      {mode === 'fetch packages' && !member.engaged && (
        <PackageInfoCards packages={packages} addJob={addJob} />
      )}
      {/* will see tommorow */}
      {mode === 'update package' && member.engaged && (
        <div className="container mx-auto mt-4">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Update package
          </h2>
          {packageDetails && (
            <div
              key={packageDetails?.trackID}
              className="p-4 bg-white shadow-lg rounded-lg border border-gray-200 max-w-[600px] mx-auto"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="text-gray-700 font-semibold">
                  <strong>Track ID:</strong> {packageDetails?.trackID}
                </p>
                <StatusBadge status={packageDetails?.status} />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-gray-700 font-medium ">
                  <strong>From:</strong>
                  <p>{packageDetails?.sender?.name}</p>
                  <p>
                    {packageDetails?.sender?.state},{' '}
                    {packageDetails?.sender?.cityVil},{' '}
                    {packageDetails?.sender?.pincode}
                  </p>
                </div>
                <div className="text-gray-700 font-medium ">
                  <strong>To:</strong>
                  <p>{packageDetails?.receiver?.name}</p>
                  <p>
                    {packageDetails?.receiver?.state},{' '}
                    {packageDetails?.receiver?.cityVil},{' '}
                    {packageDetails?.receiver?.pincode}
                  </p>
                </div>
                <div className="text-gray-700 font-medium ">
                  <p>
                    <strong>Last Updated:</strong>{' '}
                  </p>
                  <p>
                    {packageDetails?.lastUpdated
                      ? new Intl.DateTimeFormat('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        }).format(new Date(packageDetails.lastUpdated))
                      : 'N/A'}
                    ,{' '}
                    {packageDetails?.lastUpdated
                      ? new Date(
                          packageDetails.lastUpdated
                        ).toLocaleTimeString()
                      : ''}
                  </p>
                </div>
                <div>
                  <p className="text-gray-700 font-medium ">
                    <strong>Cost:</strong> ₹{packageDetails?.cost || 'N/A'}
                  </p>
                  <button
                    className=" py-1 px-4  text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
                    onClick={() => openModal(packageDetails)}
                  >
                    Details
                  </button>
                </div>
              </div>
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-6 gap-1 my-2 rounded-lg border-2 border-slate-200 p-1"
              >
                <div className="col-span-3 border-b-2 border-gray-300 text-gray-700 font-medium">
                  <strong>Update</strong>
                </div>
                <div className="col-span-3 border-b-2 border-gray-300 text-gray-700 font-medium">
                  <label className="inline-flex items-center space-x-2">
                    <span>Destination</span>
                    <input
                      type="checkbox"
                      name="reachedDest"
                      checked={formData.reachedDest}
                      onChange={handleChange}
                      className="form-checkbox size-4"
                    />
                  </label>
                </div>
                <div className=" col-span-5 rounded-md text-sm">
                  <label
                    className="block text-gray-700 font-medium text-xs px-1"
                    htmlFor="location"
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Update package's location"
                    className="form-input block w-full border-2 outline-none rounded-md border-gray-300 shadow-sm focus:border-gray-400 focus:ring focus:ring-gray-200 focus:ring-opacity-50 px-2 py-1"
                  />
                </div>
                <div className="row-span-2 flex items-center justify-center rounded-md border-2 border-gray-300">
                  <button type="submit">
                    <Save className="size-10 cursor-pointer text-gray-600" />
                  </button>
                </div>
                <div className="col-span-5 rounded-md text-sm">
                  <label
                    className="block text-gray-700 font-medium text-xs px-1"
                    htmlFor="description"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Update description"
                    rows="2"
                    className="form-textarea block w-full border-2 outline-none rounded-md border-gray-300 shadow-sm focus:border-gray-400 focus:ring focus:ring-gray-200 focus:ring-opacity-50 px-2 py-1"
                  />
                </div>
              </form>
              <div className="mt-2">
                <h3 className="text-xl font-semibold mb-2">Location History</h3>
                <div className="space-y-2">
                  {packageDetails.transit?.status
                    .slice()
                    .reverse()
                    .map(location => (
                      <div
                        key={location._id}
                        className="p-2 bg-white shadow-md rounded-lg border border-gray-200"
                      >
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <p className="text-gray-700 font-semibold">
                            {location.location}
                          </p>
                          <p className="text-gray-500 text-sm text-right">
                            {new Intl.DateTimeFormat('en-GB', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            }).format(new Date(location.date))}
                            , {new Date(location.date).toLocaleTimeString()}
                          </p>
                        </div>
                        <p className="text-gray-600">{location.description}</p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {isModalOpen && selectedPackage && (
        <PackageModal pkg={selectedPackage} onClose={closeModal} />
      )}
    </>
  );
}

export default Driver;
