'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import CarCard from '@/components/CarCard';
import { FaRedo, FaSearch, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import { useSearchParams } from 'next/navigation';

interface Car {
  _id: string;
  name: string;
  brand: string;
  price: number;
  fuelType: string;
  transmission: string;
  kilometers: number;
  images: string[];
  registrationYear?: number;
  registrationCity?: string;
}

export default function Home() {
  const searchParams = useSearchParams();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    bodyType: '',
    sortBy: 'newest'
  });
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(2000000); // UI State
  const [debouncedPriceRange, setDebouncedPriceRange] = useState<number>(2000000); // Filter State
  const [facets, setFacets] = useState<Record<string, number>>({});
  const [happyCustomers, setHappyCustomers] = useState<number | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Sync search from URL params
  useEffect(() => {
    const search = searchParams.get('search');
    if (search !== null) {
      setFilters(prev => ({ ...prev, search }));
    } else {
      setFilters(prev => ({ ...prev, search: '' }));
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/config`);
        setHappyCustomers(res.data.happyCustomers);
      } catch (error) {
        console.error('Error fetching config:', error);
      }
    };
    fetchConfig();
  }, []);

  // Debounce price range
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedPriceRange(priceRange);
    }, 500);
    return () => clearTimeout(handler);
  }, [priceRange]);

  // Fetch cars
  const fetchCars = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);

      if (selectedBrands.length > 0) {
        params.append('brand', selectedBrands.join(','));
      }

      // Logic: if manual budget buttons used, use those. Else if range slider changed from default/max, use range.
      // Prioritize explicit filters state if set, else use slider for maxPrice
      if (filters.minPrice) params.append('minPrice', filters.minPrice);

      if (filters.maxPrice) {
        params.append('maxPrice', filters.maxPrice);
      } else if (debouncedPriceRange < 2000000) {
        params.append('maxPrice', debouncedPriceRange.toString());
      }

      if (filters.bodyType) params.append('bodyType', filters.bodyType);
      if (filters.sortBy) params.append('sort', filters.sortBy);

      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/cars?${params.toString()}`);
      setCars(res.data.cars);
      setFacets(res.data.facets?.bodyType || {});
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [filters, selectedBrands, debouncedPriceRange]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleBrandChange = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  const handlePriceRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceRange(Number(e.target.value));
    // Clear manual maxPrice if using slider
    setFilters({ ...filters, maxPrice: '' });
  };

  const setBudget = (min: string, max: string) => {
    setFilters({ ...filters, minPrice: min, maxPrice: max });
  };

  const clearFilters = () => {
    setFilters({ search: '', minPrice: '', maxPrice: '', bodyType: '', sortBy: 'newest' });
    setSelectedBrands([]);
    setPriceRange(2000000);
  };

  const availableBrands = ['Maruti Suzuki', 'Hyundai', 'Honda', 'Toyota', 'Mahindra', 'Tata', 'Kia', 'Ford', 'Renault', 'Volkswagen'];

  return (
    <div className="bg-gray-100 min-h-screen">


      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">

        {/* Mobile Filter Button */}
        <div className="md:hidden flex justify-between items-center mb-4">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-lg font-bold shadow-md active:scale-95 transition-transform"
          >
            <FaSearch /> Refine Search
          </button>
          <button onClick={clearFilters} className="text-primary text-sm font-medium hover:underline">Reset All</button>
        </div>

        {/* Sidebar Filters */}
        <aside className={`w-full md:w-1/4 fixed md:relative inset-0 z-50 md:z-auto bg-black bg-opacity-50 md:bg-transparent transition-all duration-300 ${isFilterOpen ? 'opacity-100 visible' : 'opacity-0 invisible md:opacity-100 md:visible'}`} onClick={() => setIsFilterOpen(false)}>
          <div className={`bg-white h-full md:h-auto w-4/5 md:w-full rounded-r-xl md:rounded-lg shadow-xl md:shadow-sm p-5 border border-gray-200 overflow-y-auto transform transition-transform duration-300 ${isFilterOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`} onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-secondary text-lg">Refine Your Result</h2>
              <div className="flex items-center gap-3">
                <button onClick={clearFilters} className="text-primary text-sm flex items-center gap-1 hover:underline"><FaRedo className="text-xs" /> Reset</button>
                <button onClick={() => setIsFilterOpen(false)} className="md:hidden text-gray-500 text-2xl">&times;</button>
              </div>
            </div>

            {/* Location Filter */}
            <div className="mb-6">
              <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Location</label>
              <div className="relative">
                <select className="w-full p-2 border rounded text-sm appearance-none bg-white text-gray-700 focus:outline-none focus:border-secondary">
                  <option>Nagpur</option>
                  <option>New Delhi</option>
                  <option>Mumbai</option>
                </select>
                <FaMapMarkerAlt className="absolute right-3 top-3 text-gray-400 text-xs" />
              </div>
            </div>

            {/* Range Slider */}
            <div className="mb-6">
              <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Price Range</label>
              <input
                type="range"
                min="0"
                max="2000000"
                step="50000"
                value={priceRange}
                onChange={handlePriceRangeChange}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-center mt-2">
                <span className="bg-secondary text-white text-xs px-2 py-1 rounded-full">
                  {priceRange >= 2000000 ? 'All Prices' : `Up to ₹ ${priceRange.toLocaleString('en-IN')}`}
                </span>
              </div>
            </div>

            {/* Brand Filter (Checkboxes) replaced checkboxes */}
            <div className="mb-6">
              <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Brands</label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {availableBrands.map(brand => (
                  <label key={brand} className="flex items-center space-x-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandChange(brand)}
                      className="form-checkbox text-primary rounded border-gray-300 focus:ring-primary transition"
                    />
                    <span className={`text-sm transition-colors ${selectedBrands.includes(brand) ? 'text-secondary font-bold' : 'text-gray-600 group-hover:text-primary'}`}>{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            <hr className="my-6 border-gray-100" />

            {/* Budget Filter */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-gray-700">Select Budget</label>
                <span className="text-lg text-gray-400 font-light">-</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setBudget('0', '200000')} className={`text-xs px-3 py-1.5 border rounded-full transition-all ${filters.maxPrice === '200000' ? 'bg-primary text-white border-primary shadow-sm' : 'text-gray-600 border-gray-300 hover:border-primary'}`}>Less than 2 L</button>
                <button onClick={() => setBudget('200000', '400000')} className={`text-xs px-3 py-1.5 border rounded-full transition-all ${filters.minPrice === '200000' && filters.maxPrice === '400000' ? 'bg-primary text-white border-primary shadow-sm' : 'text-gray-600 border-gray-300 hover:border-primary'}`}>2 L - 4 L</button>
                <button onClick={() => setBudget('400000', '600000')} className={`text-xs px-3 py-1.5 border rounded-full transition-all ${filters.minPrice === '400000' && filters.maxPrice === '600000' ? 'bg-primary text-white border-primary shadow-sm' : 'text-gray-600 border-gray-300 hover:border-primary'}`}>4 L - 6 L</button>
                <button onClick={() => setBudget('600000', '')} className={`text-xs px-3 py-1.5 border rounded-full transition-all ${filters.minPrice === '600000' && !filters.maxPrice ? 'bg-primary text-white border-primary shadow-sm' : 'text-gray-600 border-gray-300 hover:border-primary'}`}>More than 6 L</button>
              </div>
            </div>

            {/* Body Type Filter */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-gray-700">Body Type</label>
                <span className="text-lg text-gray-400 font-light">-</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Hatchback', 'Sedan', 'Van', 'SUV', 'MUV', 'Pickup', 'LCV'].map(type => {
                  const count = facets[type.toUpperCase()] || 0;
                  return (
                    <button
                      key={type}
                      onClick={() => setFilters({ ...filters, bodyType: type === filters.bodyType ? '' : type })}
                      className={`text-xs px-3 py-2 border rounded text-left flex justify-between items-center uppercase transition-all flex-1 min-w-[80px] ${filters.bodyType === type ? 'bg-blue-50 border-primary text-secondary font-bold shadow-sm' : 'border-gray-300 text-gray-600 hover:border-primary'}`}
                    >
                      <span>{type}</span>
                      <span className={`text-[10px] ml-1 ${filters.bodyType === type ? 'text-primary' : 'text-gray-400'}`}>({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile Apply Button */}
            <div className="md:hidden mt-8">
              <button
                onClick={() => setIsFilterOpen(false)}
                className="w-full bg-secondary text-white py-3 rounded-lg font-bold shadow-lg active:scale-95 transition-transform"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="w-full md:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800"><span className="text-gray-900">{cars.length} Used Cars</span> in Nagpur for sale!</h1>
            <div className="relative">
              <select
                name="sortBy"
                value={filters.sortBy}
                onChange={handleFilterChange}
                className="appearance-none bg-gray-100 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-secondary text-sm cursor-pointer"
              >
                <option value="newest">Sort By: Newest</option>
                <option value="oldest">Sort By: Oldest</option>
                <option value="priceLowHigh">Price: Low to High</option>
                <option value="priceHighLow">Price: High to Low</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
              </div>
            </div>
          </div>

          {/* Marketing Banner */}
          <div className="bg-secondary text-white rounded-lg p-3 flex items-center justify-between mb-8 shadow-md">
            <div className="flex items-center gap-3">
              <div className="bg-accent p-2 rounded">
                <FaCalendarAlt />
              </div>
              <span className="font-medium text-sm md:text-base">
                {happyCustomers ? `${happyCustomers}+ happy customers already started their journey with ArihantCars` : 'Start your journey with ArihantCars today!'}
              </span>
            </div>
          </div>

          {/* Search Bar for Mobile/Quick Access */}
          <div className="mb-6 relative md:hidden">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:border-blue-500"
              value={filters.search}
              onChange={handleFilterChange}
              name="search"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>

          {/* Car Grid */}
          {loading ? (
            <div className="text-center py-20 text-gray-500">Loading cars...</div>
          ) : (
            <>
              {cars.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-lg shadow-sm">
                  <h3 className="text-xl text-gray-600 mb-2">No cars found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your filters.</p>
                  <button onClick={clearFilters} className="text-blue-600 hover:underline">Clear all filters</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                  {cars.map((car) => (
                    <CarCard key={car._id} car={car} />
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div >
    </div >
  );
}
