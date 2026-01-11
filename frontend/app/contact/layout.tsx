import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact ArihantCars Nagpur | Visit Our Showroom',
    description: 'Get in touch with ArihantCars Nagpur. Visit our showroom, call us, or send a WhatsApp message to find your dream car today.',
};

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
