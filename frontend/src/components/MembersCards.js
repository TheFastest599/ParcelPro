import React, { useContext } from 'react';
import { Link } from 'lucide-react';
import { packageContext } from '../context/packages/packageContext';

function MembersCards({ memberDetails }) {
  const pcontext = useContext(packageContext);
  const { copyTrackingLinkToClipboard } = pcontext;

  return (
    <div className="container mx-auto mt-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Member Details</h2>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {memberDetails.map(member => (
          <div
            key={member._id}
            className="p-4 border rounded-lg shadow-md bg-white"
          >
            <div className="space-x-2 flex flex-wrap items-center mb-1">
              <h3 className="font-semibold text-lg ">{member.name}</h3>
              <p className="px-2 bg-purple-500 rounded-lg text-white text-sm">
                {member.memberType}
              </p>
              {member.engaged && (
                <p className="px-2 bg-lime-500 rounded-lg text-white text-sm">
                  engaged
                </p>
              )}
            </div>
            <p className="text-sm text-gray-700">
              <strong>Email</strong>: {member.email}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Member Type</strong>: {member.memberType}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Engaged</strong>: {member.engaged ? 'Yes' : 'No'}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Package ID</strong>: {member.packageId || 'N/A'}
            </p>
            {member.trackID && (
              <div className="flex  items-center">
                <p className="text-sm text-gray-700">
                  <strong>Track ID:</strong> {member.trackID}
                </p>
                <Link
                  onClick={() => {
                    copyTrackingLinkToClipboard(member.trackID);
                  }}
                  className="size-5 mx-2 bg-gray-100 rounded-md p-1 transition duration-300 ease-in-out transform hover:bg-gray-300 hover:scale-105 cursor-pointer"
                />
              </div>
            )}
            <p className="text-sm text-gray-700">
              <strong>Date Joined</strong>:{' '}
              {new Date(member.date).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Last Login</strong>:{' '}
              {new Date(member.lastLogin).toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MembersCards;
