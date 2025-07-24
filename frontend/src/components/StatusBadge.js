import React from 'react';
import {
  CheckCircle,
  Truck,
  Package,
  Clock,
  ArrowRightCircle,
  Box,
  CircleX,
} from 'lucide-react'; // Assuming you have these icons from lucide-react

const StatusBadge = ({ status }) => {
  const renderBadge = () => {
    switch (status) {
      case 'pending':
        return (
          <span className="relative  inline-block px-3 py-1 font-semibold text-yellow-900 leading-tight">
            <span
              aria-hidden
              className="absolute inset-0  bg-yellow-200 opacity-50 rounded-full"
            ></span>
            <span className="relative text-xs sm:text-sm">
              <Clock className="inline-block mr-1" size={16} />
              Pending
            </span>
          </span>
        );
      case 'dispatched':
        return (
          <span className="relative inline-block px-3 py-1 font-semibold text-blue-900 leading-tight">
            <span
              aria-hidden
              className="absolute inset-0 bg-blue-200 opacity-50 rounded-full"
            ></span>
            <span className="relative text-xs sm:text-sm">
              <ArrowRightCircle className="inline-block mr-1" size={16} />
              Dispatched
            </span>
          </span>
        );
      case 'transit':
        return (
          <span className="relative inline-block px-3 py-1 font-semibold text-blue-900 leading-tight">
            <span
              aria-hidden
              className="absolute inset-0 bg-blue-200 opacity-50 rounded-full"
            ></span>
            <span className="relative text-xs sm:text-sm">
              <Truck className="inline-block mr-1" size={16} />
              In Transit
            </span>
          </span>
        );
      case 'staged':
        return (
          <span className="relative inline-block px-3 py-1 font-semibold text-orange-900 leading-tight">
            <span
              aria-hidden
              className="absolute inset-0 bg-orange-200 opacity-50 rounded-full"
            ></span>
            <span className="relative text-xs sm:text-sm">
              <Box className="inline-block mr-1" size={16} />
              Staged
            </span>
          </span>
        );
      case 'out':
        return (
          <span className="relative inline-block px-3 py-1 font-semibold text-orange-900 leading-tight">
            <span
              aria-hidden
              className="absolute inset-0 bg-orange-200 opacity-50 rounded-full"
            ></span>
            <span className="relative text-xs sm:text-sm">
              <Truck className="inline-block mr-1" size={16} />
              Out for Delivery
            </span>
          </span>
        );
      case 'delivered':
        return (
          <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight ">
            <span
              aria-hidden
              className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
            ></span>
            <span className="relative text-xs sm:text-sm">
              <CheckCircle className="inline-block mr-1" size={16} />
              Delivered
            </span>
          </span>
        );
      case 'failed':
        return (
          <span className="relative inline-block px-3 py-1 font-semibold text-red-900 leading-tight">
            <span
              aria-hidden
              className="absolute inset-0 bg-red-200 opacity-50 rounded-full"
            ></span>
            <span className="relative text-xs sm:text-sm">
              <CircleX className="inline-block mr-1" size={16} />
              Failed
            </span>
          </span>
        );
      default:
        return (
          <span className="relative inline-block px-3 py-1 font-semibold text-gray-900 leading-tight">
            <span
              aria-hidden
              className="absolute inset-0 bg-gray-200 opacity-50 rounded-full"
            ></span>
            <span className="relative text-xs sm:text-sm">
              <Package className="inline-block mr-1" size={16} />
              Unknown
            </span>
          </span>
        );
    }
  };

  return renderBadge();
};

export default StatusBadge;
