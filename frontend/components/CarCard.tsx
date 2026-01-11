import Link from 'next/link';
import { FaGasPump, FaCogs, FaRoad } from 'react-icons/fa';

interface CarProps {
    _id: string;
    name: string;
    price: number;
    brand: string;
    fuelType: string;
    transmission: string;
    kilometers: number;
    mileage?: string;
    images: string[];
    registrationCity?: string;
    registrationYear?: number;
    arihantCertified?: boolean;
}

const CarCard = ({ car }: { car: CarProps }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200 flex flex-col h-full relative group">
            {/* Image Section - Clickable */}
            <Link href={`/car/${car._id}`} className="block relative h-48 w-full bg-gray-200 overflow-hidden cursor-pointer">
                {car.images && car.images.length > 0 ? (
                    <img src={car.images[0]} alt={`${car.brand} ${car.name} - Certified Used Car in ${car.registrationCity || 'Nagpur'}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">No Image</div>
                )}
                {car.arihantCertified && (
                    <div className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                        Arihant Certified
                    </div>
                )}
            </Link>

            {/* Warranty Strip */}
            <div className="bg-gray-50 border-b border-gray-200 py-1 px-3 text-xs text-gray-500 flex justify-center items-center space-x-1">
                <span>6 Months Warranty</span>
                <span className="text-gray-300">|</span>
                <span>3 Free Service</span>
            </div>

            <div className="p-4 flex flex-col flex-grow">
                {/* Title & Location - Clickable */}
                <Link href={`/car/${car._id}`} className="block">
                    <h3 className="text-lg font-bold text-secondary mb-1 truncate hover:text-primary transition-colors">{car.name}</h3>
                    <div className="flex items-center text-xs text-gray-500 mb-3">
                        <span className="mr-2">{car.registrationCity || 'Nagpur'}</span>
                    </div>
                </Link>

                {/* Specs Row */}
                <div className="flex items-center text-sm text-gray-600 mb-2 space-x-2">
                    <span>{car.brand}</span>
                    <span className="text-gray-300">|</span>
                    <span>{car.registrationYear || 2020}</span>
                    <span className="text-gray-300">|</span>
                    <span>{car.fuelType}</span>
                    <span className="text-gray-300">|</span>
                    <span>{car.kilometers?.toLocaleString() ?? '10,000'} km</span>
                </div>

                {/* Rating */}
                <div className="flex text-yellow-400 text-sm mb-3">
                    {'★'.repeat(4)}{'☆'.repeat(1)}
                </div>

                {/* Price Section */}
                <div className="mt-auto">
                    <h4 className="text-xl font-bold text-primary mb-1">₹ {car.price?.toLocaleString('en-IN') ?? 'N/A'}</h4>
                    <div className="mb-4">
                        <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-1 rounded-sm uppercase tracking-wide">Available for Finance</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        <Link href="/contact" className="block w-full text-center border border-secondary text-secondary text-sm font-bold py-2 rounded hover:bg-gray-50 transition-colors uppercase">
                            Contact Dealer
                        </Link>
                        <Link href={`/car/${car._id}`} className="block w-full text-center bg-secondary text-white text-sm font-bold py-2 rounded hover:bg-primary-dark transition-colors uppercase">
                            Book Test Drive
                        </Link>
                    </div>

                    {/* Bottom Options */}
                    <div className="flex justify-between mt-3 text-[10px] text-gray-500 uppercase tracking-wide border-t pt-2">
                        <div className="flex flex-col items-center">
                            <FaRoad className="text-lg mb-1" />
                            <span>{car.kilometers?.toLocaleString() ?? '0'} km</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <FaCogs className="text-lg mb-1" />
                            <span>{car.transmission}</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <FaGasPump className="text-lg mb-1" />
                            <span>{car.mileage || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarCard;
