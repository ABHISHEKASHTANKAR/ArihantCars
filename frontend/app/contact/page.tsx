'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [siteConfig, setSiteConfig] = useState<any>(null);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
                const res = await axios.get(`${apiUrl}/api/config`);
                setSiteConfig(res.data);
            } catch (error) {
                console.error('Error fetching config:', error);
            }
        };
        fetchConfig();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
            await axios.post(`${apiUrl}/api/contact`, formData);
            toast.success('Message sent successfully! We will contact you soon.');
            setFormData({ name: '', phone: '', message: '' });
        } catch (error) {
            toast.error('Failed to send message. Please try again.');
            console.error('Contact form error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center text-primary">Contact Us</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Contact Info */}
                <div className="bg-white p-6 rounded-lg shadow-sm h-fit">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Get In Touch</h2>

                    <div className="space-y-6">
                        <div className="flex items-start">
                            <FaMapMarkerAlt className="text-primary text-xl mt-1 mr-4" />
                            <div>
                                <h3 className="font-bold text-gray-700">Visit Us</h3>
                                <p className="text-gray-600">{siteConfig?.businessAddress || 'Loading address...'}</p>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <FaPhone className="text-primary text-xl mr-4" />
                            <div>
                                <h3 className="font-bold text-gray-700">Call Us</h3>
                                <a href={`tel:${siteConfig?.businessPhone}`} className="text-gray-600 hover:text-primary">{siteConfig?.businessPhone || 'Loading phone...'}</a>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <FaWhatsapp className="text-green-500 text-xl mr-4" />
                            <div>
                                <h3 className="font-bold text-gray-700">WhatsApp</h3>
                                <a href={`https://wa.me/${siteConfig?.businessWhatsapp}`} className="text-gray-600 hover:text-green-600">{siteConfig?.businessPhone}</a>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <FaEnvelope className="text-primary text-xl mr-4" />
                            <div>
                                <h3 className="font-bold text-gray-700">Email Us</h3>
                                <a href={`mailto:${siteConfig?.businessEmail}`} className="text-gray-600 hover:text-primary">{siteConfig?.businessEmail || 'Loading email...'}</a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Send us a Message</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Your Name"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="phone">Phone Number</label>
                            <input
                                type="tel"
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Your Phone Number"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="message">Message</label>
                            <textarea
                                id="message"
                                rows={4}
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Hi, I am interested in..."
                                required
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white font-bold py-3 px-4 rounded hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Map Embed */}
            <div className="mt-12">
                <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    {siteConfig ? (
                        <iframe
                            width="100%"
                            height="450"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            src={`https://www.google.com/maps?q=${encodeURIComponent(siteConfig.businessAddress)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                            className="rounded-lg shadow-inner"
                        ></iframe>
                    ) : (
                        <div className="h-[450px] bg-gray-50 flex items-center justify-center text-gray-400">Loading Map...</div>
                    )}
                </div>
            </div>
        </div>
    );
}
