import { Metadata } from 'next';
import axios from 'axios';
import CarDetailClient from './CarDetailClient';

interface Props {
    params: Promise<{ id: string }>;
}

async function getCar(id: string) {
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/cars/${id}`);
        return res.data;
    } catch (error) {
        return null;
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const id = (await params).id;
    const car = await getCar(id);

    if (!car) {
        return {
            title: 'Car Not Found | ArihantCars',
        };
    }

    const title = `${car.registrationYear} ${car.brand} ${car.name} | ArihantCars Nagpur`;
    const description = `Buy this certified ${car.registrationYear} ${car.brand} ${car.name} with ${car.kilometers?.toLocaleString()}km for ₹${car.price?.toLocaleString('en-IN')} at ArihantCars Nagpur.`;
    const image = car.images?.[0] || 'https://arihantcars.com/og-image.jpg';

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [image],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image],
        },
    };
}

export default async function Page({ params }: Props) {
    const id = (await params).id;
    const car = await getCar(id);

    if (!car) {
        return <div className="text-center py-20 text-2xl font-bold">Car not found</div>;
    }

    // JSON-LD Structured Data
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Car',
        'name': car.name,
        'brand': {
            '@type': 'Brand',
            'name': car.brand
        },
        'description': car.description,
        'image': car.images,
        'offers': {
            '@type': 'Offer',
            'price': car.price,
            'priceCurrency': 'INR',
            'availability': 'https://schema.org/InStock'
        },
        'vehicleModelDate': car.registrationYear,
        'mileageFromOdometer': {
            '@type': 'QuantitativeValue',
            'value': car.kilometers,
            'unitCode': 'KMT'
        },
        'fuelType': car.fuelType,
        'vehicleTransmission': car.transmission
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <CarDetailClient car={car} />
        </>
    );
}
