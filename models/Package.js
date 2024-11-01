const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = require('mongodb');

const AddressSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  contact: { type: String, required: true },
  state: { type: String, required: true },
  cityVil: { type: String, required: true },
  pincode: { type: String, required: true },
  address: { type: String, required: true },
});

const SizeSchema = new Schema({
  length: { type: String },
  breadth: { type: String },
  height: { type: String },
});

const PackageDetailsSchema = new Schema({
  packageType: { type: String, required: true },
  serviceType: { type: String, required: true },
  distance: { type: String, required: true },
  weight: { type: String, required: true },
  size: { type: SizeSchema, required: true },
  packageDesc: { type: String, required: true },
});

const CostStructureSchema = new Schema({
  baseCost: { type: Number, required: true },
  serviceCost: { type: Number, required: true },
  cost: { type: Number, required: true },
  tax: { type: Number, required: true },
  totalCost: { type: Number, required: true },
});

const transitSchema = new Schema({
  driver: { type: ObjectId, ref: 'member' },
  driverName: { type: String },
  status: [
    {
      location: { type: String },
      description: { type: String },
      date: { type: Date },
    },
  ],
  reachedDest: { type: Boolean, default: false },
});

const deliverySchema = new Schema({
  deliveryPartner: { type: ObjectId, ref: 'member' },
  deliveryPartnerName: { type: String },
  otp: { type: Number },
  delivered: { type: Boolean, default: false },
  failed: {
    deliveryFailed: { type: Boolean, default: false },
    deliveryFailAction: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  date: { type: Date },
});

const PackageSchema = new Schema({
  customer: { type: ObjectId, ref: 'user', required: true },
  trackID: { type: String, required: true },
  sender: { type: AddressSchema, required: true },
  receiver: { type: AddressSchema, required: true },
  package: { type: PackageDetailsSchema, required: true },
  costStructure: { type: CostStructureSchema, required: true },
  cost: { type: Number, required: true },
  status: { type: String, required: true, default: 'pending' }, // pending, dispatched, transit, staged, out, delivered
  transit: { type: transitSchema },
  delivery: { type: deliverySchema },
  date: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('package', PackageSchema);
