const costFunction = (
  distance,
  weight,
  size = { length: 0, breadth: 0, height: 0 },
  packageType,
  serviceType
) => {
  let baseCost = 0;

  // Base cost based on package type
  if (packageType === 'parcel') {
    baseCost = 50; // Base cost for parcel
  } else if (packageType === 'document') {
    baseCost = 30; // Base cost for document
  }

  // Additional cost based on distance (e.g., 5 rupees per km)
  const distanceCost = distance * 1.07;

  // Calculate volumetric weight
  const volumetricWeight = (size.length * size.breadth * size.height) / 5000;

  // Use the greater of actual weight and volumetric weight
  const effectiveWeight = Math.max(weight, volumetricWeight);

  // Additional cost based on weight (e.g., 10 rupees per kg)
  const weightCost = effectiveWeight * 10;

  // Additional cost based on service type
  let serviceCost = 0;
  if (serviceType === 'express') {
    serviceCost = 100; // Additional cost for express service
  }

  // Total cost calculation
  const totalCost = baseCost + distanceCost + weightCost + serviceCost;

  return totalCost;
};

// Example usage
const distance = 1700; // in km
const weight = 5; // in kg
const size = { length: 30, breadth: 20, height: 10 }; // in cm
const packageType = 'parcel';
const serviceType = 'express';

const cost = costFunction(distance, weight, size, packageType, serviceType);
console.log(`The total cost is: ₹${cost}`);
