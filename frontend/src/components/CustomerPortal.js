import React, { useContext, useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import globalContext from '../context/global/globalContext';
import { packageContext } from '../context/packages/packageContext';
import PackageInfoCards from './PackageInfoCards';

// Utility function to generate a random tracking ID
const generateTrackingId = () => {
  return 'TRK' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

const CustomerPortal = () => {
  document.title = 'ParcelPro | Customer';
  const navigate = useNavigate();
  const gcontext = useContext(globalContext);
  const pContext = useContext(packageContext);
  const { customer, customerLogout, notify } = gcontext;
  const { addPackage, fetchPackages, packages } = pContext;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const initialFormState = {
    senderName: '',
    senderEmail: '',
    senderContact: '',
    senderState: '',
    senderCityVillage: '',
    senderAddress: '',
    senderPincode: '',
    receiverName: '',
    receiverEmail: '',
    receiverContact: '',
    receiverState: '',
    receiverCityVillage: '',
    receiverAddress: '',
    receiverPincode: '',
    packageWeight: '',
    packageDistance: '',
    packageLength: '',
    packageBreadth: '',
    packageHeight: '',
    packageDescription: '',
    packageType: 'parcel',
    serviceType: 'standard',
    cost: 0,
    totalCost: 0,
    tax: 0,
    baseCost: 0,
    serviceCost: 0,
  };

  const indianStates = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
    'Andaman and Nicobar Islands',
    'Chandigarh',
    'Dadra and Nagar Haveli and Daman and Diu',
    'Lakshadweep',
    'Delhi',
    'Puducherry',
    'Ladakh',
    'Jammu and Kashmir',
  ];

  const [formData, setFormData] = useState(initialFormState);

  const costFunction = () => {
    const distance = parseFloat(formData.packageDistance);
    const weight = parseFloat(formData.packageWeight);
    let length;
    let breadth;
    let height;
    if (formData.packageType === 'document') {
      length = 0;
      breadth = 0;
      height = 0;
    } else {
      length = parseFloat(formData.packageLength);
      breadth = parseFloat(formData.packageBreadth);
      height = parseFloat(formData.packageHeight);
    }
    const packageType = formData.packageType;
    const serviceType = formData.serviceType;
    let base = 0;

    const pricing = [
      [50, 80, 120, 200, 300],
      [70, 100, 150, 250, 350],
      [100, 150, 200, 300, 400],
      [150, 200, 300, 500, 700],
      [200, 250, 400, 700, 1000],
    ];

    const weightCat = [0, 0.5, 2, 5, 10];
    const distCat = [0, 50, 300, 1000, 2000];

    // Base cost based on package type
    if (packageType === 'parcel') {
      base = 50; // Base cost for parcel
    } else if (packageType === 'document') {
      base = 30; // Base cost for document
    }

    let [m, n] = [0, 0];

    // Calculate volumetric weight
    const volumetricWeight = (length * breadth * height) / 5000;

    // Use the greater of actual weight and volumetric weight
    const effectiveWeight = Math.max(weight, volumetricWeight);

    for (let i = 0; i < weightCat.length; i++) {
      if (effectiveWeight > weightCat[i]) {
        m = i;
      }
    }

    for (let i = 0; i < distCat.length; i++) {
      if (distance > distCat[i]) {
        n = i;
      }
    }

    let baseCost = base + pricing[m][n];
    // Additional cost based on service type
    let serviceCost = 50;
    if (serviceType === 'express') {
      serviceCost = baseCost * 0.5; // Additional cost for express service
    }

    // Total cost calculation
    const cost = baseCost + serviceCost;
    const tax = (cost * 0.18).toFixed(2);
    const totalCost = (parseFloat(cost) + parseFloat(tax)).toFixed(2); // 18% GST
    setFormData({
      ...formData,
      totalCost,
      tax,
      baseCost,
      serviceCost,
      cost,
    });
    // console.log('Total cost:', [
    //   totalCost,
    //   cost,
    //   tax,
    //   preCost,
    //   serviceCost,
    // ]);
    return [totalCost, cost, tax, baseCost, serviceCost];
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const nextPage = () => {
    if (validatePage()) {
      if (currentPage + 1 === 4) {
        costFunction();
      }
      setCurrentPage(currentPage + 1);
    } else {
      notify('Please fill all the fields correctly', 'warn');
    }
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (validatePage()) {
      // Handle form submission
      const data = {
        trackID: generateTrackingId(),
        sender: {
          name: formData.senderName,
          email: formData.senderEmail,
          contact: formData.senderContact,
          state: formData.senderState,
          cityVil: formData.senderCityVillage,
          pincode: formData.senderPincode,
          address: formData.senderAddress,
        },
        receiver: {
          name: formData.receiverName,
          email: formData.receiverEmail,
          contact: formData.receiverContact,
          state: formData.receiverState,
          cityVil: formData.receiverCityVillage,
          pincode: formData.receiverPincode,
          address: formData.receiverAddress,
        },
        package: {
          packageType: formData.packageType,
          serviceType: formData.serviceType,
          distance: formData.packageDistance,
          weight: formData.packageWeight,
          size: {
            length: formData.packageLength,
            breadth: formData.packageBreadth,
            height: formData.packageHeight,
          },
          packageDesc: formData.packageDescription,
        },
        costStructure: {
          baseCost: formData.baseCost,
          serviceCost: formData.serviceCost,
          cost: formData.cost,
          tax: formData.tax,
          totalCost: formData.totalCost,
        },
        cost: formData.totalCost,
        status: 'pending',
      };
      // console.log('Form submitted:', data);
      addPackage(data);
      closeModal();
    } else {
      notify('Error', 'error');
    }
  };

  const openModal = () => {
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentPage(1); // Reset to the first page when closing the modal
  };

  const validatePage = () => {
    switch (currentPage) {
      case 1:
        return (
          formData.senderName &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.senderEmail.trim()) &&
          /^[0-9]{10}$/.test(formData.senderContact.trim()) &&
          /^[0-9]{6}$/.test(formData.senderPincode.trim()) &&
          formData.senderState &&
          formData.senderCityVillage &&
          formData.senderAddress
        );
      case 2:
        return (
          formData.receiverName &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.receiverEmail.trim()) &&
          /^[0-9]{10}$/.test(formData.receiverContact.trim()) &&
          /^[0-9]{6}$/.test(formData.receiverPincode.trim()) &&
          formData.receiverState &&
          formData.receiverCityVillage &&
          formData.receiverAddress
        );
      case 3: {
        const isParcel = formData.packageType === 'parcel';

        // Validate weight and distance
        const isWeightValid = /^[0-9]+(\.[0-9]+)?$/.test(
          formData.packageWeight.trim()
        );
        const isDistanceValid = /^[0-9]+(\.[0-9]+)?$/.test(
          formData.packageDistance.trim()
        );

        // Validate length, breadth, and height only if package type is parcel
        const isLengthValid = isParcel
          ? /^[0-9]+(\.[0-9]+)?$/.test(formData.packageLength.trim())
          : true;
        const isBreadthValid = isParcel
          ? /^[0-9]+(\.[0-9]+)?$/.test(formData.packageBreadth.trim())
          : true;
        const isHeightValid = isParcel
          ? /^[0-9]+(\.[0-9]+)?$/.test(formData.packageHeight.trim())
          : true;

        return (
          isWeightValid &&
          isDistanceValid &&
          isLengthValid &&
          isBreadthValid &&
          isHeightValid &&
          formData.packageDescription
        );
      }
      default:
        return true;
    }
  };

  return (
    <>
      <div className="container mx-auto lg:px-6 py-2 flex justify-between items-center my-2">
        <p className="font-bold">{customer.name}</p>
        <div className="flex flex-row items-center justify-center space-x-2">
          <button
            type="button"
            className="py-2 px-3 sm:py-2.5 sm:px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
            onClick={() => navigate('/customer/account')}
          >
            Account
          </button>

          <button
            type="button"
            className="py-2 px-3 sm:py-2.5 sm:px-5 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm "
            onClick={() => {
              customerLogout();
              navigate('/');
            }}
          >
            Logout
          </button>
        </div>
      </div>
      <div className="flex  justify-center space-x-2">
        <button
          className="py-1 px-4 max-w-96 w-full text-sm  sm:text-base font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300"
          onClick={openModal}
        >
          Request Courier
        </button>
        <button
          className="py-2 px-4 max-w-64 w-full text-sm  sm:text-base font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300"
          onClick={() => {
            fetchPackages('customer');
          }}
        >
          Fetch Packages
        </button>
      </div>
      <hr className="my-4 border-t border-gray-300" />
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10"
          // onClick={e => {
          //   if (e.target === e.currentTarget) {
          //     closeModal();
          //   }
          // }}
        >
          <div className="bg-white rounded-lg shadow-lg p-6 relative max-w-md w-full">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              <X />
            </button>
            <h3 className="font-bold text-2xl text-center text-indigo-600 mb-4">
              {currentPage === 1 && 'Sender Details'}
              {currentPage === 2 && 'Receiver Details'}
              {currentPage === 3 && 'Package Details'}
              {currentPage === 4 && 'Price and Checkout'}
            </h3>
            <form onSubmit={handleSubmit}>
              {currentPage === 1 && (
                <div>
                  <div className="mb-2">
                    <label
                      className="block text-gray-700 font-medium mb-2"
                      htmlFor="senderName"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="senderName"
                      name="senderName"
                      value={formData.senderName}
                      onChange={handleChange}
                      placeholder="Enter sender's name"
                      className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-400 focus:ring focus:ring-gray-200 focus:ring-opacity-50 p-2"
                    />
                  </div>
                  <div className="mb-2">
                    <label
                      className="block text-gray-700 font-medium mb-2"
                      htmlFor="senderEmail"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="senderEmail"
                      name="senderEmail"
                      value={formData.senderEmail}
                      onChange={handleChange}
                      placeholder="Enter sender's email"
                      className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-400 focus:ring focus:ring-gray-200 focus:ring-opacity-50 p-2"
                    />
                  </div>
                  <div className="mb-2">
                    <label
                      className="block text-gray-700 font-medium mb-2"
                      htmlFor="senderContact"
                    >
                      Contact Number
                    </label>
                    <input
                      type="text"
                      id="senderContact"
                      name="senderContact"
                      value={formData.senderContact}
                      onChange={handleChange}
                      placeholder="Enter sender's 10 digit contact number"
                      className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-400 focus:ring focus:ring-gray-200 focus:ring-opacity-50 p-2"
                    />
                  </div>
                  <div className="mb-2">
                    <label
                      className="block text-gray-700 font-medium mb-2"
                      htmlFor="senderCityVillage"
                    >
                      City/Village
                    </label>
                    <input
                      type="text"
                      id="senderCityVillage"
                      name="senderCityVillage"
                      value={formData.senderCityVillage}
                      onChange={handleChange}
                      placeholder="Enter sender's city or village"
                      className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-400 focus:ring focus:ring-gray-200 focus:ring-opacity-50 p-2"
                    />
                  </div>
                  <div className="flex space-x-2 mb-2">
                    <div>
                      <label
                        className="block text-gray-700 font-medium mb-2"
                        htmlFor="senderState"
                      >
                        State
                      </label>
                      <select
                        id="senderState"
                        name="senderState"
                        value={formData.senderState}
                        onChange={handleChange}
                        className="form-select mt-1 block w-48 rounded-md border-gray-300 shadow-sm focus:border-gray-400 focus:ring focus:ring-gray-200 focus:ring-opacity-50 p-2"
                      >
                        <option value="">Select State</option>
                        {indianStates.map(state => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        className="block text-gray-700 font-medium mb-2"
                        htmlFor="senderPincode"
                      >
                        Pincode
                      </label>
                      <input
                        type="text"
                        id="senderPincode"
                        name="senderPincode"
                        value={formData.senderPincode}
                        onChange={handleChange}
                        placeholder="6 digit pincode"
                        className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-400 focus:ring focus:ring-gray-200 focus:ring-opacity-50 p-2"
                      />
                    </div>
                  </div>
                  <div className="mb-2">
                    <label
                      className="block text-gray-700 font-medium mb-2"
                      htmlFor="senderAddress"
                    >
                      Address
                    </label>
                    <textarea
                      id="senderAddress"
                      name="senderAddress"
                      value={formData.senderAddress}
                      onChange={handleChange}
                      placeholder="Ward No, Street No, House No, etc"
                      rows="3"
                      className="form-textarea mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-400 focus:ring focus:ring-gray-200 focus:ring-opacity-50 p-2"
                    />
                  </div>
                  <div className="flex justify-between">
                    <button
                      type="button"
                      className="py-2 px-4 text-sm font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300"
                      onClick={nextPage}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
              {currentPage === 2 && (
                <div>
                  <div className="mb-2">
                    <label
                      className="block text-gray-700 font-medium mb-2"
                      htmlFor="receiverName"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="receiverName"
                      name="receiverName"
                      value={formData.receiverName}
                      onChange={handleChange}
                      placeholder="Enter receiver's name"
                      className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-400 focus:ring focus:ring-gray-200 focus:ring-opacity-50 p-2"
                    />
                  </div>
                  <div className="mb-2">
                    <label
                      className="block text-gray-700 font-medium mb-2"
                      htmlFor="receiverEmail"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="receiverEmail"
                      name="receiverEmail"
                      value={formData.receiverEmail}
                      onChange={handleChange}
                      placeholder="Enter receiver's email"
                      className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-400 focus:ring focus:ring-gray-200 focus:ring-opacity-50 p-2"
                    />
                  </div>
                  <div className="mb-2">
                    <label
                      className="block text-gray-700 font-medium mb-2"
                      htmlFor="receiverContact"
                    >
                      Contact Number
                    </label>
                    <input
                      type="text"
                      id="receiverContact"
                      name="receiverContact"
                      value={formData.receiverContact}
                      onChange={handleChange}
                      placeholder="Enter receiver's 10 digit contact number"
                      className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-400 focus:ring focus:ring-gray-200 focus:ring-opacity-50 p-2"
                    />
                  </div>
                  <div className="mb-2">
                    <label
                      className="block text-gray-700 font-medium mb-2"
                      htmlFor="receiverCityVillage"
                    >
                      City/Village
                    </label>
                    <input
                      type="text"
                      id="receiverCityVillage"
                      name="receiverCityVillage"
                      value={formData.receiverCityVillage}
                      onChange={handleChange}
                      placeholder="Enter receiver's city or village"
                      className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-400 focus:ring focus:ring-gray-200 focus:ring-opacity-50 p-2"
                    />
                  </div>
                  <div className="flex space-x-2 mb-2">
                    <div>
                      <label
                        className="block text-gray-700 font-medium mb-2"
                        htmlFor="receiverState"
                      >
                        State
                      </label>
                      <select
                        id="receiverState"
                        name="receiverState"
                        value={formData.receiverState}
                        onChange={handleChange}
                        className="form-select mt-1 block w-48 rounded-md border-gray-300 shadow-sm focus:border-gray-400 focus:ring focus:ring-gray-200 focus:ring-opacity-50 p-2"
                      >
                        <option value="">Select State</option>
                        {indianStates.map(state => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        className="block text-gray-700 font-medium mb-2"
                        htmlFor="receiverPincode"
                      >
                        Pincode
                      </label>
                      <input
                        type="text"
                        id="receiverPincode"
                        name="receiverPincode"
                        value={formData.receiverPincode}
                        onChange={handleChange}
                        placeholder="6 digit pincode"
                        className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-400 focus:ring focus:ring-gray-200 focus:ring-opacity-50 p-2"
                      />
                    </div>
                  </div>
                  <div className="mb-2">
                    <label
                      className="block text-gray-700 font-medium mb-2"
                      htmlFor="receiverAddress"
                    >
                      Address
                    </label>
                    <textarea
                      id="receiverAddress"
                      name="receiverAddress"
                      value={formData.receiverAddress}
                      onChange={handleChange}
                      placeholder="Ward No, Street No, House No, etc"
                      rows="3"
                      className="form-textarea mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-400 focus:ring focus:ring-gray-200 focus:ring-opacity-50 p-2"
                    />
                  </div>
                  <div className="flex justify-between">
                    <button
                      type="button"
                      className="py-2 px-4 text-sm font-medium text-white bg-gray-600 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-300"
                      onClick={prevPage}
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      className="py-2 px-4 text-sm font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300"
                      onClick={nextPage}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
              {currentPage === 3 && (
                <div>
                  <div className="flex space-x-2 mb-2">
                    <div>
                      <label
                        className="block text-gray-700 font-medium mb-2"
                        htmlFor="serviceType"
                      >
                        Service Type
                      </label>
                      <select
                        id="serviceType"
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleChange}
                        className="form-select mt-1 block w-48 rounded-md border-gray-300 shadow-sm focus:border-gray-400 focus:ring focus:ring-gray-200 focus:ring-opacity-50 p-2"
                      >
                        <option value="standard">Standard</option>
                        <option value="express">Express</option>
                      </select>
                    </div>
                    <div>
                      <label
                        className="block text-gray-700 font-medium mb-2"
                        htmlFor="serviceType"
                      >
                        Package Type
                      </label>
                      <select
                        id="packageType"
                        name="packageType"
                        value={formData.packageType}
                        onChange={handleChange}
                        className="form-select mt-1 block w-40 rounded-md border-gray-300 shadow-sm focus:border-gray-400 focus:ring focus:ring-gray-200 focus:ring-opacity-50 p-2"
                      >
                        <option value="parcel">Parcel</option>
                        <option value="document">Document</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex space-x-2 mb-2">
                    <div>
                      <label
                        className="block text-gray-700 font-medium mb-2"
                        htmlFor="packageWeight"
                      >
                        Weight (kg)
                      </label>
                      <input
                        type="text"
                        id="packageWeight"
                        name="packageWeight"
                        value={formData.packageWeight}
                        onChange={handleChange}
                        placeholder="Weight in kg"
                        className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-400 focus:ring focus:ring-gray-200 focus:ring-opacity-50 p-2"
                      />
                    </div>
                    <div>
                      <label
                        className="block text-gray-700 font-medium mb-2"
                        htmlFor="packageDistance"
                      >
                        Distance (km)
                      </label>
                      <input
                        type="text"
                        id="packageDistance"
                        name="packageDistance"
                        value={formData.packageDistance}
                        onChange={handleChange}
                        placeholder="Distance in km"
                        className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-400 focus:ring focus:ring-gray-200 focus:ring-opacity-50 p-2"
                      />
                    </div>
                  </div>
                  <div
                    className={`mb-2 ${
                      formData.packageType === 'document' ? 'hidden' : ''
                    }`}
                  >
                    <label
                      className="block text-gray-700 font-medium mb-2"
                      htmlFor="packageSize"
                    >
                      Size (cm)
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        id="packageLength"
                        name="packageLength"
                        value={formData.packageLength}
                        onChange={handleChange}
                        placeholder="Length"
                        className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-400 focus:ring focus:ring-gray-200 focus:ring-opacity-50 p-2"
                      />
                      <input
                        type="text"
                        id="packageBreadth"
                        name="packageBreadth"
                        value={formData.packageBreadth}
                        onChange={handleChange}
                        placeholder="Breadth"
                        className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-400 focus:ring focus:ring-gray-200 focus:ring-opacity-50 p-2"
                      />
                      <input
                        type="text"
                        id="packageHeight"
                        name="packageHeight"
                        value={formData.packageHeight}
                        onChange={handleChange}
                        placeholder="Height"
                        className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-400 focus:ring focus:ring-gray-200 focus:ring-opacity-50 p-2"
                      />
                    </div>
                  </div>
                  <div className="mb-2">
                    <label
                      className="block text-gray-700 font-medium mb-2"
                      htmlFor="packageDescription"
                    >
                      Package Description
                    </label>
                    <textarea
                      id="packageDescription"
                      name="packageDescription"
                      value={formData.packageDescription}
                      onChange={handleChange}
                      placeholder="Enter the package's description"
                      rows="2"
                      className="form-textarea mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-400 focus:ring focus:ring-gray-200 focus:ring-opacity-50 p-2"
                    />
                  </div>
                  <div className="flex justify-between">
                    <button
                      type="button"
                      className="py-2 px-4 text-sm font-medium text-white bg-gray-600 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-300"
                      onClick={prevPage}
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      className="py-2 px-4 text-sm font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300"
                      onClick={nextPage}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
              {currentPage === 4 && (
                <div>
                  <div className="p-4 bg-white shadow-md rounded-lg mb-4">
                    <h2 className="text-xl font-bold mb-4 text-center">
                      Invoice
                    </h2>
                    <div className="mb-2">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-700 font-medium">
                          Package Type:
                        </span>
                        <span className="text-gray-900">
                          {formData.packageType}
                        </span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-700 font-medium">
                          Service Type:
                        </span>
                        <span className="text-gray-900">
                          {formData.serviceType}
                        </span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-700 font-medium">
                          Base Cost:
                        </span>
                        <span className="text-gray-900">
                          {formData.baseCost} ₹
                        </span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-700 font-medium">
                          Service Cost:
                        </span>
                        <span className="text-gray-900">
                          {formData.serviceCost} ₹
                        </span>
                      </div>
                      <hr />
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-700 font-medium">Cost:</span>
                        <span className="text-gray-900">{formData.cost} ₹</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-700 font-medium">
                          18% GST:
                        </span>
                        <span className="text-gray-900">{formData.tax} ₹</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-700 font-medium">
                          Total Cost:
                        </span>
                        <span className="text-gray-900 font-bold">
                          {formData.totalCost} ₹
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <button
                      type="button"
                      className="py-2 px-4 text-sm font-medium text-white bg-gray-600 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-300"
                      onClick={prevPage}
                    >
                      Previous
                    </button>
                    <button
                      type="submit"
                      className="py-2 px-4 text-sm font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300"
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
      <PackageInfoCards packages={packages} />
    </>
  );
};

export default CustomerPortal;
