const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    fuelType: { type: String, required: true }, // Petrol, Diesel, CNG, Electric
    transmission: { type: String, required: true }, // Manual, Automatic
    kilometers: { type: Number, required: true },
    registrationYear: { type: Number },
    registrationCity: { type: String },
    description: { type: String },
    bodyType: { type: String }, // Hatchback, Sedan, SUV, etc.
    mileage: { type: String }, // e.g., "18 kmpl"
    arihantCertified: { type: Boolean, default: false },

    // New Detailed Specs
    seats: { type: Number },
    rto: { type: String },
    ownership: { type: String }, // First, Second, etc.
    engineDisplacement: { type: String }, // e.g., "1796 cc"
    engineType: { type: String },
    yearOfManufacture: { type: Number },
    topSpeed: { type: String },
    maxPower: { type: String },
    maxTorque: { type: String },
    gearbox: { type: String },
    emissionControl: { type: String },
    fuelTankCapacity: { type: String },
    steeringType: { type: String },
    frontBrakeType: { type: String },
    rearBrakeType: { type: String },
    length: { type: String },
    width: { type: String },
    height: { type: String },
    wheelBase: { type: String },
    kerbWeight: { type: String },
    grossWeight: { type: String },
    doors: { type: Number },

    images: [{ type: String }], // Array of image URLs
    featured: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Car', carSchema);
