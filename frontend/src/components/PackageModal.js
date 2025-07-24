import React, { useContext } from 'react';
import StatusBadge from './StatusBadge';
import globalContext from '../context/global/globalContext';
import { packageContext } from '../context/packages/packageContext';
import { Link } from 'lucide-react';

const PackageModal = ({ pkg, onClose }) => {
  const gcontext = useContext(globalContext);
  const pcontext = useContext(packageContext);
  const { member } = gcontext;
  const { copyTrackingLinkToClipboard } = pcontext;
  const adminCheck = member && member.memberType === 'admin';
  // console.log(pkg);
  // console.log('adminCheck', adminCheck);

  return (
    <div className="fixed inset-0 flex items-center justify-center ">
      <div
        className="bg-black opacity-50 absolute inset-0"
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-lg shadow-lg p-6  max-w-4xl w-full mx-4 sm:mx-6 md:mx-8 lg:mx-10 xl:mx-12 overflow-y-auto max-h-full text-sm z-10">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">Package Details</h2>
          <StatusBadge status={pkg.status} />
        </div>
        <div className="flex  items-center mb-2">
          <p className="font-semibold">
            <strong>Track ID:</strong> {pkg.trackID}
          </p>
          <Link
            onClick={() => {
              copyTrackingLinkToClipboard(pkg.trackID);
            }}
            className="size-6 mx-2 bg-gray-100 rounded-md p-1 transition duration-300 ease-in-out transform hover:bg-gray-300 hover:scale-105 cursor-pointer"
          />
        </div>

        <hr />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div className="mb-4">
            <h3 className="text-xl font-semibold">Sender</h3>
            <p>
              <strong>Name:</strong> {pkg.sender.name}
            </p>
            <p>
              <strong>Email:</strong> {pkg.sender.email}
            </p>
            <p>
              <strong>Contact:</strong> {pkg.sender.contact}
            </p>
            <p>
              <strong>State:</strong> {pkg.sender.state}
            </p>
            <p>
              <strong>City/Vilage:</strong> {pkg.sender.cityVil}
            </p>
            <p>
              <strong>Pincode:</strong> {pkg.sender.pincode}
            </p>
            <p>
              <strong>Address:</strong> {pkg.sender.address}
            </p>
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-semibold">Receiver</h3>
            <p>
              <strong>Name:</strong> {pkg.receiver.name}
            </p>
            <p>
              <strong>Email:</strong> {pkg.receiver.email}
            </p>
            <p>
              <strong>Contact:</strong> {pkg.receiver.contact}
            </p>
            <p>
              <strong>State:</strong> {pkg.receiver.state}
            </p>
            <p>
              <strong>City/Vilage:</strong> {pkg.receiver.cityVil}
            </p>
            <p>
              <strong>Pincode:</strong> {pkg.receiver.pincode}
            </p>
            <p>
              <strong>Address:</strong> {pkg.receiver.address}
            </p>
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-semibold">Package</h3>
            {adminCheck && (
              <p>
                <strong>ID:</strong> {pkg.package._id}
              </p>
            )}
            <p>
              <strong>Type:</strong> {pkg.package.packageType}
            </p>
            <p>
              <strong>Service:</strong> {pkg.package.serviceType}
            </p>
            <p>
              <strong>Package Description:</strong> {pkg.package.packageDesc}
            </p>
            <p>
              <strong>Distance:</strong> {pkg.package.distance} km
            </p>
            <p>
              <strong>Weight:</strong> {pkg.package.weight} kg
            </p>
            <p>
              <strong>Size:</strong> {pkg.package.size.length} x{' '}
              {pkg.package.size.breadth} x {pkg.package.size.height} cm
            </p>
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-semibold">Cost Structure</h3>
            <p>
              <strong>Base Cost:</strong> ₹{pkg.costStructure.baseCost}
            </p>
            <p>
              <strong>Service Cost:</strong> ₹{pkg.costStructure.serviceCost}
            </p>
            <p>
              <strong>Cost:</strong> ₹{pkg.costStructure.cost}
            </p>
            <p>
              <strong>Tax:</strong> ₹{pkg.costStructure.tax}
            </p>
            <p>
              <strong>Total Cost:</strong> ₹{pkg.costStructure.totalCost}
            </p>
          </div>
          {pkg.transit && (
            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2">Transit Status</h3>
              {adminCheck && (
                <p>
                  <strong>Driver ID:</strong> {pkg.transit.driver}
                </p>
              )}
              <p>
                <strong>Driver:</strong> {pkg.transit.driverName}
              </p>
              <p>
                <strong>Reached Destination:</strong>{' '}
                {pkg.transit.reachedDest ? 'Yes' : 'No'}
              </p>
              <div className="max-h-48 overflow-y-auto">
                {pkg.transit.reachedDest && (
                  <p className="px-2 font-semibold bg-blue-300 shadow-md rounded-lg border border-gray-300 mb-2">
                    End
                  </p>
                )}
                {pkg.transit.status
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
          {pkg.delivery && (
            <div className="mb-4 ">
              <h3 className="text-xl font-semibold">Delivery Details</h3>
              <p>
                <strong>Delivered:</strong>{' '}
                {pkg.delivery.delivered ? 'Yes' : 'No'}
              </p>
              {adminCheck && (
                <p>
                  <strong>Delivery Partner ID:</strong>{' '}
                  {pkg.delivery.deliveryPartner}
                </p>
              )}
              <p>
                <strong>Delivery Partner:</strong>{' '}
                {pkg.delivery.deliveryPartnerName}
              </p>
              {pkg.delivery.delivered && (
                <p>
                  <strong>Date:</strong>{' '}
                  {new Date(pkg.delivery.date).toLocaleString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </p>
              )}
              {pkg.delivery.failed.deliveryFailed && (
                <>
                  <h3 className="text-xl font-semibold mt-4">
                    Failed Delivery
                  </h3>
                  <p>
                    <strong>Delivery Failed:</strong>{' '}
                    {pkg.delivery.failed.deliveryFailed ? 'Yes' : 'No'}
                  </p>
                  <p>
                    <strong>Action:</strong>{' '}
                    {pkg.delivery.failed.deliveryFailAction}
                  </p>
                  <p>
                    <strong>Description:</strong>{' '}
                    {pkg.delivery.failed.description}
                  </p>
                </>
              )}
            </div>
          )}
          <div className="mb-4 md:col-span-2">
            <p>
              <strong>Date:</strong>{' '}
              {new Date(pkg.date).toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
            </p>
            <p>
              <strong>Last Updated:</strong>{' '}
              {new Date(pkg.lastUpdated).toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
            </p>
          </div>
        </div>
        <button
          className="mt-4 py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PackageModal;
