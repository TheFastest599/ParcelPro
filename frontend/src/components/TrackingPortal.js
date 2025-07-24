import React, { useState, useContext, useEffect } from 'react';
import { packageContext } from '../context/packages/packageContext';
import { useNavigate, useParams } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { Search, Link } from 'lucide-react';

function TrackingPortal() {
  document.title = 'ParcelPro | Track';
  const [trackingId, setTrackingId] = useState('');
  const navigate = useNavigate();
  const { trackID } = useParams();
  useEffect(() => {
    if (trackID) {
      setTrackingId(trackID);
      track(trackID);
    }
    // eslint-disable-next-line
  }, [trackID]);

  const pContext = useContext(packageContext);
  const { track, packageDetails, trackpage, copyTrackingLinkToClipboard } =
    pContext;
  const handleSubmit = e => {
    e.preventDefault();
    track(trackingId);
    navigate('/track');
  };

  return (
    <>
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
          Track Your Package
        </h1>
        <form onSubmit={handleSubmit} className="mb-2 rounded-lg">
          <div className="flex flex-row">
            <input
              type="text"
              placeholder="Enter Tracking ID"
              value={trackingId}
              onChange={e => setTrackingId(e.target.value)}
              className="flex-grow shadow appearance-none border rounded-l-lg w-full sm:w-auto py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-lg focus:outline-none focus:shadow-outline flex items-center justify-center"
            >
              <Search className="mr-2" size={20} />
              Track
            </button>
          </div>
        </form>
      </div>
      {trackpage && (
        <div className="flex items-center justify-center">
          <div className=" bg-white rounded-lg shadow-lg p-6 z-10 max-w-4xl w-full sm:mx-6 md:mx-8 lg:mx-10 xl:mx-12 overflow-y-auto max-h-full text-sm">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold">Package Details</h2>
              <StatusBadge status={packageDetails.status} />
            </div>
            <div className="flex  items-center mb-2">
              <p className="font-semibold">
                <strong>Track ID:</strong> {packageDetails.trackID}
              </p>
              <Link
                onClick={() => {
                  copyTrackingLinkToClipboard(packageDetails.trackID);
                }}
                className="size-6 mx-2 bg-gray-100 rounded-md p-1 transition duration-300 ease-in-out transform hover:bg-gray-300 hover:scale-105 cursor-pointer"
              />
            </div>
            <hr />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="mb-4">
                <h3 className="text-xl font-semibold">Sender</h3>
                <p>
                  <strong>Name:</strong> {packageDetails.sender?.name}
                </p>
                <p>
                  <strong>Email:</strong> {packageDetails.sender?.email}
                </p>
                <p>
                  <strong>Contact:</strong> {packageDetails.sender?.contact}
                </p>
                <p>
                  <strong>State:</strong> {packageDetails.sender?.state}
                </p>
                <p>
                  <strong>City/Vilage:</strong> {packageDetails.sender?.cityVil}
                </p>
                <p>
                  <strong>Pincode:</strong> {packageDetails.sender?.pincode}
                </p>
                <p>
                  <strong>Address:</strong> {packageDetails.sender?.address}
                </p>
              </div>
              <div className="mb-4">
                <h3 className="text-xl font-semibold">Receiver</h3>
                <p>
                  <strong>Name:</strong> {packageDetails.receiver?.name}
                </p>
                <p>
                  <strong>Email:</strong> {packageDetails.receiver?.email}
                </p>
                <p>
                  <strong>Contact:</strong> {packageDetails.receiver?.contact}
                </p>
                <p>
                  <strong>State:</strong> {packageDetails.receiver?.state}
                </p>
                <p>
                  <strong>City/Vilage:</strong>{' '}
                  {packageDetails.receiver?.cityVil}
                </p>
                <p>
                  <strong>Pincode:</strong> {packageDetails.receiver?.pincode}
                </p>
                <p>
                  <strong>Address:</strong> {packageDetails.receiver?.address}
                </p>
              </div>
              <div className="mb-4">
                <h3 className="text-xl font-semibold">Package</h3>
                <p>
                  <strong>Type:</strong> {packageDetails.package?.packageType}
                </p>
                <p>
                  <strong>Service:</strong>{' '}
                  {packageDetails.package?.serviceType}
                </p>
                <p>
                  <strong>Package Description:</strong>{' '}
                  {packageDetails.package?.packageDesc}
                </p>
                <p>
                  <strong>Distance:</strong> {packageDetails.package?.distance}{' '}
                  km
                </p>
                <p>
                  <strong>Weight:</strong> {packageDetails.package?.weight} kg
                </p>
                <p>
                  <strong>Size:</strong> {packageDetails.package?.size.length} x{' '}
                  {packageDetails.package?.size.breadth} x{' '}
                  {packageDetails.package?.size.height} cm
                </p>
              </div>
              <div className="mb-4">
                <h3 className="text-xl font-semibold">Cost Structure</h3>
                <p>
                  <strong>Base Cost:</strong> ₹
                  {packageDetails.costStructure?.baseCost}
                </p>
                <p>
                  <strong>Service Cost:</strong> ₹
                  {packageDetails.costStructure?.serviceCost}
                </p>
                <p>
                  <strong>Cost:</strong> ₹{packageDetails.costStructure?.cost}
                </p>
                <p>
                  <strong>Tax:</strong> ₹{packageDetails.costStructure?.tax}
                </p>
                <p>
                  <strong>Total Cost:</strong> ₹
                  {packageDetails.costStructure?.totalCost}
                </p>
              </div>
              {packageDetails.transit && (
                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-2">Transit Status</h3>
                  <p>
                    <strong>Driver:</strong>{' '}
                    {packageDetails.transit?.driverName}
                  </p>
                  <p>
                    <strong>Reached Destination:</strong>{' '}
                    {packageDetails.transit?.reachedDest ? 'Yes' : 'No'}
                  </p>
                  <div className="max-h-48 overflow-y-auto">
                    {packageDetails.transit?.reachedDest && (
                      <p className="px-2 font-semibold bg-blue-300 shadow-md rounded-lg border border-gray-300 mb-2">
                        End
                      </p>
                    )}
                    {packageDetails.transit?.status
                      .slice()
                      .reverse()
                      .map((status, index) => (
                        <div
                          key={status._id}
                          className="p-2  shadow-md rounded-lg border border-gray-300 mb-2"
                        >
                          <div className="grid grid-cols-2 gap-2 mb-2">
                            <p className=" font-semibold">{status.location}</p>
                            <p className="text-gray-500 text-sm text-right">
                              {new Date(status.date).toLocaleString('en-GB', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                              })}
                            </p>
                          </div>
                          <p className="text-gray-600">{status.description}</p>
                        </div>
                      ))}
                    <p className="px-2 font-semibold bg-blue-300 shadow-md rounded-lg border border-gray-300 mb-2">
                      Start
                    </p>
                  </div>
                </div>
              )}
              {packageDetails.delivery && (
                <div className="mb-4 ">
                  <h3 className="text-xl font-semibold">Delivery Details</h3>
                  <p>
                    <strong>Delivered:</strong>{' '}
                    {packageDetails.delivery?.delivered ? 'Yes' : 'No'}
                  </p>
                  <p>
                    <strong>Delivery Partner:</strong>{' '}
                    {packageDetails.delivery?.deliveryPartnerName}
                  </p>
                  {packageDetails.delivery?.delivered && (
                    <p>
                      <strong>Date:</strong>{' '}
                      {new Date(packageDetails.delivery?.date).toLocaleString(
                        'en-GB',
                        {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        }
                      )}
                    </p>
                  )}
                  {packageDetails.delivery?.failed.deliveryFailed && (
                    <>
                      <h3 className="text-xl font-semibold mt-4">
                        Failed Delivery
                      </h3>
                      <p>
                        <strong>Delivery Failed:</strong>{' '}
                        {packageDetails.delivery?.failed.deliveryFailed
                          ? 'Yes'
                          : 'No'}
                      </p>
                      <p>
                        <strong>Action:</strong>{' '}
                        {packageDetails.delivery?.failed.deliveryFailAction}
                      </p>
                      <p>
                        <strong>Description:</strong>{' '}
                        {packageDetails.delivery?.failed.description}
                      </p>
                    </>
                  )}
                </div>
              )}
              <div className="mb-4 md:col-span-2">
                <p>
                  <strong>Date:</strong>{' '}
                  {packageDetails.date ? (
                    <>
                      {new Date(packageDetails.date).toLocaleString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </>
                  ) : (
                    'N/A'
                  )}
                </p>
                <p>
                  <strong>Last Updated:</strong>{' '}
                  {packageDetails.lastUpdated ? (
                    <>
                      {new Date(packageDetails.lastUpdated).toLocaleString(
                        'en-GB',
                        {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        }
                      )}
                    </>
                  ) : (
                    'N/A'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TrackingPortal;
