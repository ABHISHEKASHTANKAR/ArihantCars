'use client';

import Link from 'next/link';
import { FaCar, FaPhone, FaUser, FaSearch } from 'react-icons/fa';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Navbar = () => {
    const [search, setSearch] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (search.trim()) {
            router.push(`/?search=${encodeURIComponent(search.trim())}`);
        } else {
            router.push('/');
        }
        setIsMenuOpen(false);
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link href="/" className="flex items-center text-2xl font-bold">
                    <FaCar className="mr-2 text-primary" />
                    <span className="text-secondary">ArihantCars</span>
                </Link>

                {/* Search Bar (Desktop) */}
                <form onSubmit={handleSearch} className="hidden md:flex flex-1 mx-8 max-w-lg relative">
                    <input
                        type="text"
                        placeholder="Search Cars or Brands ..."
                        className="w-full border border-gray-300 rounded-full py-2 px-4 pl-10 focus:outline-none focus:border-secondary transition text-secondary"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <FaSearch className="absolute left-3 top-3 text-muted" />
                    <button type="submit" className="hidden">Search</button>
                </form>

                <div className="hidden md:flex space-x-6 items-center">
                    <Link href="/" className="text-secondary hover:text-primary font-medium">Home</Link>
                    <Link href="/about" className="text-secondary hover:text-primary font-medium">About</Link>
                    <Link href="/contact" className="text-secondary hover:text-primary font-medium">Contact</Link>
                </div>

                <div className="md:hidden">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-secondary p-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 shadow-xl animate-in slide-in-from-top duration-300">
                    <div className="container mx-auto px-4 py-4 space-y-4">
                        {/* Mobile Search */}
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                placeholder="Search Cars..."
                                className="w-full border border-gray-300 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:border-secondary transition text-secondary"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <FaSearch className="absolute left-3 top-3 text-muted" />
                        </form>

                        <div className="flex flex-col space-y-3 pb-2">
                            <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-secondary hover:text-primary font-medium py-2 border-b border-gray-50 flex items-center justify-between">
                                Home <span>&rarr;</span>
                            </Link>
                            <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-secondary hover:text-primary font-medium py-2 border-b border-gray-50 flex items-center justify-between">
                                About <span>&rarr;</span>
                            </Link>
                            <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="text-secondary hover:text-primary font-medium py-2 border-b border-gray-50 flex items-center justify-between">
                                Contact <span>&rarr;</span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
