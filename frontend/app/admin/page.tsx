'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaTrash, FaEdit, FaPlus, FaSignOutAlt, FaChevronDown, FaChevronUp, FaEnvelope } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export default function AdminPanel() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [cars, setCars] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    // Form State for Add/Edit
    const [showForm, setShowForm] = useState(false);
    const [editingCar, setEditingCar] = useState<any | null>(null);
    const [formData, setFormData] = useState({
        name: '', brand: '', price: '', fuelType: 'Petrol', transmission: 'Manual', kilometers: '', description: '', bodyType: 'Hatchback', mileage: '', arihantCertified: false,
        registrationYear: '', registrationCity: '',
        seats: '', rto: '', ownership: '', engineDisplacement: '', engineType: '', yearOfManufacture: '', topSpeed: '', maxPower: '', maxTorque: '', gearbox: '', emissionControl: '', fuelTankCapacity: '', steeringType: '', frontBrakeType: '', rearBrakeType: '', length: '', width: '', height: '', wheelBase: '', kerbWeight: '', grossWeight: '', doors: ''
    });
    const [selectedImages, setSelectedImages] = useState<FileList | null>(null);
    const [happyCustomers, setHappyCustomers] = useState<string>('');
    const [businessDetails, setBusinessDetails] = useState({
        address: '',
        phone: '',
        whatsapp: '',
        email: ''
    });
    const [messages, setMessages] = useState<any[]>([]);
    const [showInbox, setShowInbox] = useState(false);

    // Collapsible Sections State
    const [expandedSections, setExpandedSections] = useState({
        basic: true,
        general: false,
        engine: false,
        transmissionDetails: false,
        suspension: false,
        dimensions: false
    });

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const router = useRouter();

    useEffect(() => {
        // Check for token
        const savedToken = localStorage.getItem('adminToken');
        if (savedToken) {
            setToken(savedToken);
            setIsAuthenticated(true);
            fetchCars();
            fetchConfig();
            // Fetch messages with saved token
            axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/contact`, {
                headers: { 'x-auth-token': savedToken }
            }).then(res => setMessages(res.data)).catch(err => console.error(err));
        }
    }, []);

    const fetchConfig = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/config`);
            setHappyCustomers(res.data.happyCustomers);
            setBusinessDetails({
                address: res.data.businessAddress || '',
                phone: res.data.businessPhone || '',
                whatsapp: res.data.businessWhatsapp || '',
                email: res.data.businessEmail || ''
            });
        } catch (err) {
            console.error(err);
        }
    };

    const updateConfig = async () => {
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/config`, {
                happyCustomers: Number(happyCustomers),
                businessAddress: businessDetails.address,
                businessPhone: businessDetails.phone,
                businessWhatsapp: businessDetails.whatsapp,
                businessEmail: businessDetails.email
            }, {
                headers: { 'x-auth-token': token }
            });
            toast.success('Updated successfully');
        } catch (err) {
            toast.error('Error updating config');
        }
    };

    const fetchMessages = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
                headers: { 'x-auth-token': token }
            });
            setMessages(res.data);
        } catch (err) {
            console.error('Error fetching messages:', err);
        }
    };

    const handleDeleteMessage = async (id: string) => {
        if (!confirm('Delete this message?')) return;
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/contact/${id}`, {
                headers: { 'x-auth-token': token }
            });
            toast.success('Message deleted');
            fetchMessages();
        } catch (err) {
            toast.error('Error deleting message');
        }
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/contact/${id}/read`, {}, {
                headers: { 'x-auth-token': token }
            });
            fetchMessages();
        } catch (err) {
            toast.error('Error updating message');
        }
    };

    const fetchCars = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/cars?limit=100`); // Fetch all for admin
            setCars(res.data.cars);
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/login`, { username, password });
            localStorage.setItem('adminToken', res.data.token);
            setToken(res.data.token);
            setIsAuthenticated(true);
            fetchCars();
            fetchConfig();
            // Fetch messages after token is available
            const messagesRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
                headers: { 'x-auth-token': res.data.token }
            });
            setMessages(messagesRes.data);
        } catch (err) {
            toast.error('Invalid Credentials');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
        setToken(null);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/cars/${id}`, {
                headers: { 'x-auth-token': token }
            });
            toast.success('Car deleted successfully');
            fetchCars();
        } catch (err) {
            toast.error('Error deleting car');
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const config = { headers: { 'x-auth-token': token } };
            const data = new FormData();
            data.append('name', formData.name);
            data.append('brand', formData.brand);
            data.append('price', formData.price);
            data.append('fuelType', formData.fuelType);
            data.append('transmission', formData.transmission);
            data.append('kilometers', formData.kilometers);
            data.append('description', formData.description);
            data.append('bodyType', formData.bodyType);
            data.append('mileage', formData.mileage);
            data.append('arihantCertified', String(formData.arihantCertified));
            data.append('registrationYear', formData.registrationYear);
            data.append('registrationCity', formData.registrationCity);

            // Append new detailed specs
            const optionalFields = ['seats', 'rto', 'ownership', 'engineDisplacement', 'engineType', 'yearOfManufacture', 'topSpeed', 'maxPower', 'maxTorque', 'gearbox', 'emissionControl', 'fuelTankCapacity', 'steeringType', 'frontBrakeType', 'rearBrakeType', 'length', 'width', 'height', 'wheelBase', 'kerbWeight', 'grossWeight', 'doors'];
            optionalFields.forEach(field => {
                if ((formData as any)[field]) data.append(field, (formData as any)[field]);
            });

            if (selectedImages) {
                for (let i = 0; i < selectedImages.length; i++) {
                    data.append('images', selectedImages[i]);
                }
            }

            if (editingCar) {
                await axios.put(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/cars/${editingCar._id}`, data, config);
                toast.success('Car updated successfully');
            } else {
                await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/cars`, data, config);
                toast.success('Car added successfully');
            }
            setShowForm(false);
            setEditingCar(null);
            setEditingCar(null);
            setFormData({
                name: '', brand: '', price: '', fuelType: 'Petrol', transmission: 'Manual', kilometers: '', description: '', bodyType: 'Hatchback', mileage: '', arihantCertified: false,
                registrationYear: '', registrationCity: '',
                seats: '', rto: '', ownership: '', engineDisplacement: '', engineType: '', yearOfManufacture: '', topSpeed: '', maxPower: '', maxTorque: '', gearbox: '', emissionControl: '', fuelTankCapacity: '', steeringType: '', frontBrakeType: '', rearBrakeType: '', length: '', width: '', height: '', wheelBase: '', kerbWeight: '', grossWeight: '', doors: ''
            });
            setSelectedImages(null);
            fetchCars();
        } catch (err) {
            console.error(err);
            toast.error('Error saving car');
        }
    };

    const openEdit = (car: any) => {
        setEditingCar(car);
        setFormData({
            name: car.name,
            brand: car.brand,
            price: car.price,
            fuelType: car.fuelType,
            transmission: car.transmission,
            kilometers: car.kilometers,
            description: car.description || '',
            bodyType: car.bodyType || 'Hatchback',
            mileage: car.mileage || '',
            arihantCertified: car.arihantCertified || false,
            registrationYear: car.registrationYear || '', registrationCity: car.registrationCity || '',
            seats: car.seats || '', rto: car.rto || '', ownership: car.ownership || '', engineDisplacement: car.engineDisplacement || '', engineType: car.engineType || '', yearOfManufacture: car.yearOfManufacture || '', topSpeed: car.topSpeed || '', maxPower: car.maxPower || '', maxTorque: car.maxTorque || '', gearbox: car.gearbox || '', emissionControl: car.emissionControl || '', fuelTankCapacity: car.fuelTankCapacity || '', steeringType: car.steeringType || '', frontBrakeType: car.frontBrakeType || '', rearBrakeType: car.rearBrakeType || '', length: car.length || '', width: car.width || '', height: car.height || '', wheelBase: car.wheelBase || '', kerbWeight: car.kerbWeight || '', grossWeight: car.grossWeight || '', doors: car.doors || ''
        });
        setShowForm(true);
    };

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 rounded shadow-md w-96">
                    <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
                    <form onSubmit={handleLogin}>
                        <input type="text" placeholder="Username" className="w-full border p-2 mb-4 rounded" value={username} onChange={e => setUsername(e.target.value)} />
                        <input type="password" placeholder="Password" className="w-full border p-2 mb-4 rounded" value={password} onChange={e => setPassword(e.target.value)} />
                        <button className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700">Login</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setShowInbox(true)}
                        className="relative bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark flex items-center gap-2"
                    >
                        <FaEnvelope />
                        Inbox
                        {messages.filter(m => !m.read).length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                {messages.filter(m => !m.read).length}
                            </span>
                        )}
                    </button>
                    <button onClick={handleLogout} className="flex items-center text-red-600 hover:text-red-800"><FaSignOutAlt className="mr-2" /> Logout</button>
                </div>
            </div>

            <button onClick={() => { setEditingCar(null); setFormData({ name: '', brand: '', price: '', fuelType: 'Petrol', transmission: 'Manual', kilometers: '', description: '', bodyType: 'Hatchback', mileage: '', arihantCertified: false, registrationYear: '', registrationCity: '', seats: '', rto: '', ownership: '', engineDisplacement: '', engineType: '', yearOfManufacture: '', topSpeed: '', maxPower: '', maxTorque: '', gearbox: '', emissionControl: '', fuelTankCapacity: '', steeringType: '', frontBrakeType: '', rearBrakeType: '', length: '', width: '', height: '', wheelBase: '', kerbWeight: '', grossWeight: '', doors: '' }); setSelectedImages(null); setShowForm(true); }} className="bg-primary text-white px-4 py-2 rounded mb-6 flex items-center hover:bg-primary-dark">
                <FaPlus className="mr-2" /> Add New Car
            </button>

            <div className="bg-white p-6 rounded shadow-md mb-8">
                <h2 className="text-xl font-bold mb-6 text-secondary border-b pb-2">Site Configuration</h2>
                <div className="space-y-6">
                    {/* Happy Customers */}
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                        <label className="font-bold text-gray-700 min-w-[150px]">Happy Customers:</label>
                        <input type="number" value={happyCustomers} onChange={(e) => setHappyCustomers(e.target.value)} className="border p-2 rounded flex-1 focus:ring-1 focus:ring-secondary outline-none" />
                    </div>

                    {/* Business Address */}
                    <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4">
                        <label className="font-bold text-gray-700 min-w-[150px]">Business Address:</label>
                        <textarea value={businessDetails.address} onChange={(e) => setBusinessDetails({ ...businessDetails, address: e.target.value })} className="border p-2 rounded flex-1 focus:ring-1 focus:ring-secondary outline-none h-20" />
                    </div>

                    {/* Business Phone */}
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                        <label className="font-bold text-gray-700 min-w-[150px]">Phone Number:</label>
                        <input type="text" value={businessDetails.phone} onChange={(e) => setBusinessDetails({ ...businessDetails, phone: e.target.value })} className="border p-2 rounded flex-1 focus:ring-1 focus:ring-secondary outline-none" />
                    </div>

                    {/* WhatsApp */}
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                        <label className="font-bold text-gray-700 min-w-[150px]">WhatsApp Number:</label>
                        <input type="text" value={businessDetails.whatsapp} onChange={(e) => setBusinessDetails({ ...businessDetails, whatsapp: e.target.value })} className="border p-2 rounded flex-1 focus:ring-1 focus:ring-secondary outline-none" placeholder="Include country code, e.g. 919876543210" />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                        <label className="font-bold text-gray-700 min-w-[150px]">Contact Email:</label>
                        <input type="email" value={businessDetails.email} onChange={(e) => setBusinessDetails({ ...businessDetails, email: e.target.value })} className="border p-2 rounded flex-1 focus:ring-1 focus:ring-secondary outline-none" />
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button onClick={updateConfig} className="w-full md:w-auto bg-secondary text-white px-8 py-3 rounded-lg hover:bg-black transition-all font-bold shadow-lg active:scale-95">
                            Save All Changes
                        </button>
                    </div>
                </div>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded shadow-md mb-8">
                    <h2 className="text-xl font-bold mb-4 text-secondary">{editingCar ? 'Edit Car (Update images not supported yet)' : 'Add Car'}</h2>
                    <form onSubmit={handleSave} className="space-y-4">

                        {/* Section 1: Basic Information (Always Open by Default) */}
                        <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
                            <button type="button" onClick={() => toggleSection('basic')} className="w-full flex justify-between items-center p-4 bg-gray-50 border-b font-bold text-gray-700 hover:bg-gray-100 transition">
                                <span>Basic Information</span>
                                {expandedSections.basic ? <FaChevronUp /> : <FaChevronDown />}
                            </button>
                            {expandedSections.basic && (
                                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2 flex items-center space-x-2 mb-2 bg-blue-50 p-3 rounded border border-blue-100">
                                        <input type="checkbox" id="certified" checked={formData.arihantCertified} onChange={e => setFormData({ ...formData, arihantCertified: e.target.checked })} className="w-5 h-5 text-primary focus:ring-primary" />
                                        <label htmlFor="certified" className="text-secondary font-bold cursor-pointer select-none">Mark as Arihant Certified</label>
                                    </div>
                                    <input placeholder="Name" className="border p-2 rounded" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                                    <input placeholder="Brand" className="border p-2 rounded" value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} required />
                                    <input type="number" placeholder="Price" className="border p-2 rounded" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                                    <select className="border p-2 rounded" value={formData.fuelType} onChange={e => setFormData({ ...formData, fuelType: e.target.value })}>
                                        <option>Petrol</option><option>Diesel</option><option>CNG</option><option>Electric</option>
                                    </select>
                                    <select className="border p-2 rounded" value={formData.transmission} onChange={e => setFormData({ ...formData, transmission: e.target.value })}>
                                        <option>Manual</option><option>Automatic</option>
                                    </select>
                                    <input type="number" placeholder="Kilometers" className="border p-2 rounded" value={formData.kilometers} onChange={e => setFormData({ ...formData, kilometers: e.target.value })} required />
                                    <select className="border p-2 rounded" value={formData.bodyType} onChange={e => setFormData({ ...formData, bodyType: e.target.value })}>
                                        <option value="Hatchback">Hatchback</option><option value="Sedan">Sedan</option><option value="SUV">SUV</option><option value="MUV">MUV</option><option value="Van">Van</option><option value="Pickup">Pickup</option><option value="LCV">LCV</option>
                                    </select>
                                    <input placeholder="Mileage (e.g. 18 kmpl)" className="border p-2 rounded" value={formData.mileage} onChange={e => setFormData({ ...formData, mileage: e.target.value })} />
                                    <input type="file" multiple accept="image/*" className="border p-2 rounded md:col-span-2" onChange={e => setSelectedImages(e.target.files)} />
                                    <textarea placeholder="Description" className="border p-2 rounded md:col-span-2" rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                                </div>
                            )}
                        </div>

                        {/* Section 2: General & Registration */}
                        <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
                            <button type="button" onClick={() => toggleSection('general')} className="w-full flex justify-between items-center p-4 bg-gray-50 border-b font-bold text-gray-700 hover:bg-gray-100 transition">
                                <span>General & Registration</span>
                                {expandedSections.general ? <FaChevronUp /> : <FaChevronDown />}
                            </button>
                            {expandedSections.general && (
                                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input type="number" placeholder="Registration Year" className="border p-2 rounded" value={formData.registrationYear} onChange={e => setFormData({ ...formData, registrationYear: e.target.value })} />
                                    <input placeholder="Registration City" className="border p-2 rounded" value={formData.registrationCity} onChange={e => setFormData({ ...formData, registrationCity: e.target.value })} />
                                    <input type="number" placeholder="Seats" className="border p-2 rounded" value={formData.seats} onChange={e => setFormData({ ...formData, seats: e.target.value })} />
                                    <input placeholder="RTO" className="border p-2 rounded" value={formData.rto} onChange={e => setFormData({ ...formData, rto: e.target.value })} />
                                    <input placeholder="Ownership (e.g. First)" className="border p-2 rounded" value={formData.ownership} onChange={e => setFormData({ ...formData, ownership: e.target.value })} />
                                    <input type="number" placeholder="Year of Manufacture" className="border p-2 rounded" value={formData.yearOfManufacture} onChange={e => setFormData({ ...formData, yearOfManufacture: e.target.value })} />
                                    <input type="number" placeholder="No of Doors" className="border p-2 rounded" value={formData.doors} onChange={e => setFormData({ ...formData, doors: e.target.value })} />
                                </div>
                            )}
                        </div>

                        {/* Section 3: Engine & Performance */}
                        <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
                            <button type="button" onClick={() => toggleSection('engine')} className="w-full flex justify-between items-center p-4 bg-gray-50 border-b font-bold text-gray-700 hover:bg-gray-100 transition">
                                <span>Engine & Performance</span>
                                {expandedSections.engine ? <FaChevronUp /> : <FaChevronDown />}
                            </button>
                            {expandedSections.engine && (
                                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input placeholder="Engine Displacement (e.g. 1796 cc)" className="border p-2 rounded" value={formData.engineDisplacement} onChange={e => setFormData({ ...formData, engineDisplacement: e.target.value })} />
                                    <input placeholder="Engine Type" className="border p-2 rounded" value={formData.engineType} onChange={e => setFormData({ ...formData, engineType: e.target.value })} />
                                    <input placeholder="Max Power" className="border p-2 rounded" value={formData.maxPower} onChange={e => setFormData({ ...formData, maxPower: e.target.value })} />
                                    <input placeholder="Max Torque" className="border p-2 rounded" value={formData.maxTorque} onChange={e => setFormData({ ...formData, maxTorque: e.target.value })} />
                                    <input placeholder="Top Speed" className="border p-2 rounded" value={formData.topSpeed} onChange={e => setFormData({ ...formData, topSpeed: e.target.value })} />
                                    <input placeholder="Emission Control System" className="border p-2 rounded" value={formData.emissionControl} onChange={e => setFormData({ ...formData, emissionControl: e.target.value })} />
                                </div>
                            )}
                        </div>

                        {/* Section 4: Transmission & Fuel */}
                        <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
                            <button type="button" onClick={() => toggleSection('transmissionDetails')} className="w-full flex justify-between items-center p-4 bg-gray-50 border-b font-bold text-gray-700 hover:bg-gray-100 transition">
                                <span>Transmission & Fuel (Detailed)</span>
                                {expandedSections.transmissionDetails ? <FaChevronUp /> : <FaChevronDown />}
                            </button>
                            {expandedSections.transmissionDetails && (
                                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input placeholder="Gearbox" className="border p-2 rounded" value={formData.gearbox} onChange={e => setFormData({ ...formData, gearbox: e.target.value })} />
                                    <input placeholder="Fuel Tank Capacity" className="border p-2 rounded" value={formData.fuelTankCapacity} onChange={e => setFormData({ ...formData, fuelTankCapacity: e.target.value })} />
                                </div>
                            )}
                        </div>

                        {/* Section 5: Suspension & Brakes */}
                        <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
                            <button type="button" onClick={() => toggleSection('suspension')} className="w-full flex justify-between items-center p-4 bg-gray-50 border-b font-bold text-gray-700 hover:bg-gray-100 transition">
                                <span>Suspension, Steering & Brakes</span>
                                {expandedSections.suspension ? <FaChevronUp /> : <FaChevronDown />}
                            </button>
                            {expandedSections.suspension && (
                                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input placeholder="Steering Type" className="border p-2 rounded" value={formData.steeringType} onChange={e => setFormData({ ...formData, steeringType: e.target.value })} />
                                    <input placeholder="Front Brake Type" className="border p-2 rounded" value={formData.frontBrakeType} onChange={e => setFormData({ ...formData, frontBrakeType: e.target.value })} />
                                    <input placeholder="Rear Brake Type" className="border p-2 rounded" value={formData.rearBrakeType} onChange={e => setFormData({ ...formData, rearBrakeType: e.target.value })} />
                                </div>
                            )}
                        </div>

                        {/* Section 6: Dimensions & Weight */}
                        <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
                            <button type="button" onClick={() => toggleSection('dimensions')} className="w-full flex justify-between items-center p-4 bg-gray-50 border-b font-bold text-gray-700 hover:bg-gray-100 transition">
                                <span>Dimensions & Weight</span>
                                {expandedSections.dimensions ? <FaChevronUp /> : <FaChevronDown />}
                            </button>
                            {expandedSections.dimensions && (
                                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input placeholder="Length" className="border p-2 rounded" value={formData.length} onChange={e => setFormData({ ...formData, length: e.target.value })} />
                                    <input placeholder="Width" className="border p-2 rounded" value={formData.width} onChange={e => setFormData({ ...formData, width: e.target.value })} />
                                    <input placeholder="Height" className="border p-2 rounded" value={formData.height} onChange={e => setFormData({ ...formData, height: e.target.value })} />
                                    <input placeholder="Wheel Base" className="border p-2 rounded" value={formData.wheelBase} onChange={e => setFormData({ ...formData, wheelBase: e.target.value })} />
                                    <input placeholder="Kerb Weight" className="border p-2 rounded" value={formData.kerbWeight} onChange={e => setFormData({ ...formData, kerbWeight: e.target.value })} />
                                    <input placeholder="Gross Weight" className="border p-2 rounded" value={formData.grossWeight} onChange={e => setFormData({ ...formData, grossWeight: e.target.value })} />
                                </div>
                            )}
                        </div>

                        <div className="flex space-x-2 pt-4">
                            <button type="submit" className="bg-secondary text-white px-6 py-3 rounded-lg hover:bg-black font-bold flex-1 md:flex-none">Save Car</button>
                            <button type="button" onClick={() => setShowForm(false)} className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 font-bold flex-1 md:flex-none">Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Messages Inbox Modal */}
            {showInbox && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowInbox(false)}>
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-secondary">Contact Messages ({messages.filter(m => !m.read).length} unread)</h2>
                            <button onClick={() => setShowInbox(false)} className="text-gray-500 hover:text-gray-700 text-3xl leading-none">&times;</button>
                        </div>
                        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 80px)' }}>
                            {messages.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No messages yet</p>
                            ) : (
                                <div className="space-y-4">
                                    {messages.map(msg => (
                                        <div key={msg._id} className={`border rounded-lg p-4 ${msg.read ? 'bg-gray-50' : 'bg-blue-50 border-primary'}`}>
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h3 className="font-bold text-gray-800">{msg.name}</h3>
                                                        {!msg.read && <span className="text-xs bg-primary text-white px-2 py-0.5 rounded">NEW</span>}
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-2">📞 {msg.phone}</p>
                                                    <p className="text-gray-700 mb-2">{msg.message}</p>
                                                    <p className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleString()}</p>
                                                </div>
                                                <div className="flex gap-2 ml-4">
                                                    {!msg.read && (
                                                        <button
                                                            onClick={() => handleMarkAsRead(msg._id)}
                                                            className="text-xs bg-secondary text-white px-3 py-1 rounded hover:bg-black whitespace-nowrap"
                                                        >
                                                            Mark Read
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteMessage(msg._id)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded shadow overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="p-4 text-secondary font-bold">Name</th>
                            <th className="p-4 text-secondary font-bold">Brand</th>
                            <th className="p-4 text-secondary font-bold">Price</th>
                            <th className="p-4 text-secondary font-bold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cars.map(car => (
                            <tr key={car._id} className="border-b hover:bg-gray-50">
                                <td className="p-4">{car.name}</td>
                                <td className="p-4">{car.brand}</td>
                                <td className="p-4">₹ {car.price.toLocaleString()}</td>
                                <td className="p-4 flex space-x-2">
                                    <button onClick={() => openEdit(car)} className="text-accent hover:text-secondary"><FaEdit /></button>
                                    <button onClick={() => handleDelete(car._id)} className="text-red-600 hover:text-red-800"><FaTrash /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
