import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import globalContext from '../context/global/globalContext';
import { packageContext } from '../context/packages/packageContext';
import PackageModal from './PackageModal';
import StatusBadge from './StatusBadge';
import PackageInfoCards from './PackageInfoCards';

function DeliveryAgent() {
  document.title = 'ParcelPro | Delivery Partner';
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
    otp: '',
    deliveryFailed: false,
    deliveryFailAction: '',
    description: '',
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
    // console.log('Form Data:', formData);
    if (!formData.deliveryFailed) {
      updateJob({ deliveryFailed: formData.deliveryFailed, otp: formData.otp });
    }
    if (formData.deliveryFailed) {
      if (formData.deliveryFailAction && formData.description) {
        updateJob({
          deliveryFailed: formData.deliveryFailed,
          deliveryFailAction: formData.deliveryFailAction,
          description: formData.description,
        });
      } else {
        notify('Please fill all the fields', 'warn');
      }
    }
  };

  const handleOtpChange = e => {
    const { value } = e.target;
    if (/^\d{0,6}$/.test(value)) {
      setFormData({ ...formData, otp: value });
    }
  };

  // const handleSubmit = e => {
  //   e.preventDefault();
  //   // Handle OTP submission logic here
  //   console.log('OTP Submitted:', otp);
  // };

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
            fetchPackages('member', 'delivery partner');
          }}
        >
          Fetch Packages
        </button>
      </div>
      {mode === 'fetch packages' && !member.engaged && (
        <PackageInfoCards packages={packages} addJob={addJob} />
      )}
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
              <div className="grid grid-cols-2 gap-4 text-sm mb-2">
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
              <hr />
              {!formData.deliveryFailed && (
                <form
                  onSubmit={handleSubmit}
                  className="text-gray-700 font-medium my-2 grid grid-cols-6 gap-4 w-full  text-sm"
                >
                  <div className="col-span-4">
                    <label htmlFor="otp" className="block text-xs">
                      Enter 6-digit OTP
                    </label>
                    <input
                      type="text"
                      id="otp"
                      name="otp"
                      value={formData.otp}
                      onChange={handleOtpChange}
                      placeholder="Enter OTP"
                      className="form-input text-center block w-full border-2 outline-none rounded-md border-gray-300 shadow-sm focus:border-gray-400 focus:ring focus:ring-gray-200 focus:ring-opacity-50 px-2 py-1"
                    />
                  </div>
                  <button
                    type="submit"
                    className="col-span-2 mt-4 w-full bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
                  >
                    Submit OTP
                  </button>
                </form>
              )}
              <div className=" border-b-2 border-gray-300 text-gray-700 font-medium">
                <label className="inline-flex items-center space-x-2">
                  <span>Delivery Failed?</span>
                  <input
                    type="checkbox"
                    name="deliveryFailed"
                    checked={formData.deliveryFailed}
                    onChange={handleChange}
                    className="form-checkbox size-4"
                  />
                </label>
              </div>
              {formData.deliveryFailed && (
                <form
                  onSubmit={handleSubmit}
                  className="text-gray-700 font-medium my-2 grid grid-cols-6 gap-x-4 gap-y-2 w-full  text-sm"
                >
                  <div className="col-span-4">
                    <label
                      htmlFor="deliveryFailAction"
                      className="block text-xs"
                    >
                      Select delivery fail action
                    </label>
                    <select
                      id="deliveryFailAction"
                      name="deliveryFailAction"
                      value={formData.deliveryFailAction}
                      onChange={handleChange}
                      className="form-input block w-full border-2 outline-none rounded-md border-gray-300 shadow-sm focus:border-gray-400 focus:ring focus:ring-gray-200 focus:ring-opacity-50 px-2 py-1"
                    >
                      <option value="">Select Option</option>
                      <option value="Failed Delivery Attempt">
                        Failed Delivery Attempt
                      </option>
                      <option value="Returned to Sender">
                        Returned to Sender
                      </option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="col-span-2 mt-4 w-full bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
                  >
                    Confirm action
                  </button>
                  <div className="col-span-4">
                    <label htmlFor="description" className="block text-xs">
                      Reason/description for failed delivery
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe here.."
                      rows={2}
                      className="form-input  block w-full border-2 outline-none rounded-md border-gray-300 shadow-sm focus:border-gray-400 focus:ring focus:ring-gray-200 focus:ring-opacity-50 px-2 py-1"
                    />
                  </div>
                </form>
              )}
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

export default DeliveryAgent;
