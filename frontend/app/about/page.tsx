import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About ArihantCars | Trusted Used Car Dealer in Nagpur',
    description: 'Learn about ArihantCars, our 10+ years of experience, and why we are the most trusted destination for premium pre-owned vehicles in Nagpur.',
};

export default function About() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm">
                <h1 className="text-3xl font-bold mb-6 text-red-600">About ArihantCars</h1>

                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                    Welcome to ArihantCars, your trusted destination for premium pre-owned vehicles.
                    With over 10 years of experience in the automobile industry, we pride ourselves on offering
                    hight-quality, inspected, and certified used cars at competitive prices.
                </p>

                <h2 className="text-2xl font-bold mb-4 text-gray-800">Why Choose Us?</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-8">
                    <li><strong>Quality Assurance:</strong> Every car undergoes a rigorous 140-point inspection.</li>
                    <li><strong>Transparent Dealings:</strong> No hidden costs, verification of documents, and clear history.</li>
                    <li><strong>Customer Satisfaction:</strong> We believe in building long-term relationships, not just making a sale.</li>
                    <li><strong>Wide Variety:</strong> From hatchbacks to luxury sedans and SUVs, we have it all.</li>
                </ul>

                <h2 className="text-2xl font-bold mb-4 text-gray-800">Our Showroom</h2>
                <p className="text-gray-700 mb-6">
                    Visit our showroom to experience our collection firsthand. Our friendly staff is always here to
                    assist you in finding the perfect car that meets your needs and budget.
                </p>

                <div className="text-center mt-8">
                    <Link href="/contact" className="inline-block bg-red-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-red-700 transition">
                        Contact Us Today
                    </Link>
                </div>
            </div>
        </div>
    );
}
