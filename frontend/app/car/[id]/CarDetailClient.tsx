'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaWhatsapp, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

interface Car {
    _id: string;
    name: string;
    brand: string;
    price: number;
    fuelType: string;
    transmission: string;
    kilometers: number;
    registrationYear: number;
    registrationCity: string;
    description: string;
    bodyType?: string;
    mileage?: string;
    // New Specs
    seats?: number;
    rto?: string;
    ownership?: string;
    engineDisplacement?: string;
    engineType?: string;
    yearOfManufacture?: number;
    topSpeed?: string;
    maxPower?: string;
    maxTorque?: string;
    gearbox?: string;
    emissionControl?: string;
    fuelTankCapacity?: string;
    steeringType?: string;
    frontBrakeType?: string;
    rearBrakeType?: string;
    length?: string;
    width?: string;
    height?: string;
    wheelBase?: string;
    kerbWeight?: string;
    grossWeight?: string;
    doors?: number;

    images: string[];
}

export default function CarDetailClient({ car: initialCar }: { car: Car }) {
    const [car] = useState<Car>(initialCar);
    const [activeImage, setActiveImage] = useState(0);
    const [showAllSpecs, setShowAllSpecs] = useState(false);
    const [siteConfig, setSiteConfig] = useState<any>(null);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/config`);
                setSiteConfig(res.data);
            } catch (error) {
                console.error('Error fetching config:', error);
            }
        };
        fetchConfig();
    }, []);

    if (!car) return <div className="text-center py-20">Car not found</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="md:flex">
                    {/* Image Gallery */}
                    <div className="md:w-1/2 p-4">
                        <div className="h-96 w-full bg-gray-200 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
                            {car.images && car.images.length > 0 ? (
                                <img src={car.images[activeImage]} alt={`${car.brand} ${car.name}`} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-gray-500">No Image</span>
                            )}
                        </div>
                        {car.images && car.images.length > 1 && (
                            <div className="flex space-x-2 overflow-x-auto pb-2">
                                {car.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        className={`flex-shrink-0 w-20 h-20 rounded border-2 ${activeImage === idx ? 'border-red-600' : 'border-transparent'}`}
                                    >
                                        <img src={img} alt={`${car.name} thumbnail ${idx + 1}`} className="w-full h-full object-cover rounded" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="md:w-1/2 p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">{car.name}</h1>
                                <p className="text-gray-600 text-lg flex items-center mt-1">
                                    <FaMapMarkerAlt className="mr-1" /> {car.registrationCity || 'City N/A'}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-bold text-red-600">₹ {car.price.toLocaleString('en-IN')}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500">Brand</span>
                                <span className="font-semibold">{car.brand}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500">Year</span>
                                <span className="font-semibold">{car.registrationYear || '2020'}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500">Kilometers</span>
                                <span className="font-semibold">{car.kilometers?.toLocaleString() ?? 'N/A'} km</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500">Fuel Type</span>
                                <span className="font-semibold">{car.fuelType}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500">Transmission</span>
                                <span className="font-semibold">{car.transmission}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500">Body Type</span>
                                <span className="font-semibold">{car.bodyType || 'N/A'}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500">Mileage</span>
                                <span className="font-semibold">{car.mileage || 'N/A'}</span>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold mb-2">Description</h3>
                        <p className="text-gray-700 leading-relaxed mb-8">
                            {car.description || 'No description available for this car.'}
                        </p>

                        {/* Detailed Specifications */}
                        <h3 className="text-xl font-bold mb-4">Specifications</h3>
                        <div className="grid grid-cols-2 md:grid-cols-2 gap-x-4 gap-y-2 mb-8 bg-gray-50 p-4 rounded-lg">
                            {[
                                { label: 'Registration Year', value: car.registrationYear },
                                { label: 'Year of Manufacture', value: car.yearOfManufacture },
                                { label: 'Ownership', value: car.ownership },
                                { label: 'RTO', value: car.rto },
                                { label: 'Seats', value: car.seats },
                                { label: 'No of Doors', value: car.doors },
                                { label: 'Fuel Type', value: car.fuelType },
                                { label: 'Transmission', value: car.transmission },
                                { label: 'Engine Type', value: car.engineType },
                                { label: 'Engine Displacement', value: car.engineDisplacement },
                                { label: 'Max Power', value: car.maxPower },
                                { label: 'Max Torque', value: car.maxTorque },
                                { label: 'Gearbox', value: car.gearbox },
                                { label: 'Mileage', value: car.mileage },
                                { label: 'Fuel Tank Capacity', value: car.fuelTankCapacity },
                                { label: 'Top Speed', value: car.topSpeed },
                                { label: 'Kms Driven', value: car.kilometers ? `${car.kilometers.toLocaleString()} km` : null },
                                { label: 'Steering Type', value: car.steeringType },
                                { label: 'Front Brake', value: car.frontBrakeType },
                                { label: 'Rear Brake', value: car.rearBrakeType },
                                { label: 'Length', value: car.length },
                                { label: 'Width', value: car.width },
                                { label: 'Height', value: car.height },
                                { label: 'Wheel Base', value: car.wheelBase },
                                { label: 'Kerb Weight', value: car.kerbWeight },
                                { label: 'Gross Weight', value: car.grossWeight },
                            ].filter(spec => spec.value).map((spec, index) => (
                                <div key={index} className={`flex justify-between border-b border-gray-200 py-1 last:border-0 ${index >= 6 && !showAllSpecs ? 'hidden' : ''}`}>
                                    <span className="text-gray-500 text-sm">{spec.label}</span>
                                    <span className="font-semibold text-gray-800 text-sm">{spec.value}</span>
                                </div>
                            ))}
                        </div>

                        <div className="text-center mb-8">
                            <button
                                onClick={() => setShowAllSpecs(!showAllSpecs)}
                                className="text-secondary font-bold hover:underline focus:outline-none"
                            >
                                {showAllSpecs ? 'View Less Specifications' : 'View All Specifications'}
                            </button>
                        </div>

                        <div className="flex space-x-4">
                            <a href={`tel:${siteConfig?.businessPhone}`} className="flex-1 bg-gray-900 text-white py-3 rounded-lg flex items-center justify-center font-bold hover:bg-gray-800 transition">
                                <FaPhone className="mr-2" /> Call Now
                            </a>
                            <a href={`https://wa.me/${siteConfig?.businessWhatsapp}?text=I'm interested in ${car.name}`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-green-600 text-white py-3 rounded-lg flex items-center justify-center font-bold hover:bg-green-700 transition">
                                <FaWhatsapp className="mr-2" /> WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
